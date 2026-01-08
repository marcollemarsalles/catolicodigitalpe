import React, { useState, useRef, useEffect } from 'react';
import { 
  Flame, 
  ChevronRight, 
  Volume2, 
  VolumeX as VolumeXIcon, 
  X, 
  Loader2, 
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  BookOpen,
  Send
} from 'lucide-react';
import { PRAYERS_TEXTS } from '../constants';
import { generatePrayerAudio } from '../services/geminiService';
import { UserProfile } from '../types';
import { addFeedItem } from '../services/feedService';

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

const Prayers: React.FC = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [selectedPrayer, setSelectedPrayer] = useState<{key: keyof typeof PRAYERS_TEXTS, title: string} | null>(null);
  const [isPraying, setIsPraying] = useState(false);
  const [prayerLoading, setPrayerLoading] = useState(false);
  const [interruptionError, setInterruptionError] = useState(false);
  
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [showGratitude, setShowGratitude] = useState(false);
  const [gratitudeMsg, setGratitudeMsg] = useState('');
  const [isPosting, setIsPosting] = useState(false);

  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const timerRef = useRef<number | null>(null);
  const isManuallyStoppedRef = useRef<boolean>(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('ejc_user');
    if (savedUser) setUser(JSON.parse(savedUser));
    return () => stopTimer();
  }, []);

  const stopTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const startAudio = async () => {
    if (!selectedPrayer) return;
    setPrayerLoading(true);
    setInterruptionError(false);
    setShowGratitude(false);
    setGratitudeMsg('');
    setCurrentTime(0);
    isManuallyStoppedRef.current = false;

    const audioBase64 = await generatePrayerAudio(PRAYERS_TEXTS[selectedPrayer.key]);
    
    if (!audioBase64) {
      alert("Houve um erro ao preparar a voz natural. Tente novamente.");
      setPrayerLoading(false);
      return;
    }

    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      }
      
      const audioData = decodeBase64(audioBase64);
      const buffer = await decodeAudioData(audioData, audioContextRef.current, 24000, 1);
      
      const source = audioContextRef.current.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContextRef.current.destination);
      
      // Velocidade alterada para 1.0x (normal)
      const playbackSpeed = 1.0;
      source.playbackRate.value = playbackSpeed;
      
      const effectiveDuration = buffer.duration / playbackSpeed;
      setDuration(effectiveDuration);

      source.onended = () => {
        stopTimer();
        if (!isManuallyStoppedRef.current) {
          handlePrayerComplete();
        }
      };

      audioSourceRef.current = source;
      source.start();
      setIsPraying(true);
      setPrayerLoading(false);

      timerRef.current = window.setInterval(() => {
        setCurrentTime(prev => {
          if (prev + 0.1 >= effectiveDuration) {
            stopTimer();
            return effectiveDuration;
          }
          return prev + 0.1;
        });
      }, 100);

    } catch (e) {
      console.error(e);
      setPrayerLoading(false);
    }
  };

  const stopAudio = () => {
    if (!audioSourceRef.current) return;
    const progress = currentTime / duration;
    isManuallyStoppedRef.current = true;
    audioSourceRef.current.stop();
    stopTimer();

    // Requisito: Pelo menos 75% da oração ouvida
    if (progress < 0.75) {
      setInterruptionError(true);
      setIsPraying(false);
    } else {
      handlePrayerComplete();
    }
  };

  const handlePrayerComplete = () => {
    setIsPraying(false);
    setShowGratitude(true);
    if (user) {
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`prayer_${user.id}`, today);
    }
  };

  const postGrace = async () => {
    if (!user || !selectedPrayer) return;
    setIsPosting(true);

    const payload = {
      userName: user.name,
      userPhoto: user.photoUrl,
      timestamp: new Date().toISOString(),
      prayer: selectedPrayer.title,
      prayerName: selectedPrayer.title,
      gratitude: gratitudeMsg.trim(),
      amenCount: 0,
      hasAmened: false,
      glorias: {} // Objeto vazio para Record<string, string>
    };

    try {
      await addFeedItem(payload);
      setIsPosting(false);
      setSelectedPrayer(null);
      setShowGratitude(false);
    } catch (error) {
      console.error("Erro ao postar:", error);
      setIsPosting(false);
    }
  };

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center shadow-sm">
            <Flame size={24} />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Oracional EJC</h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Encontro com o Mestre</p>
          </div>
        </div>
        <div className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
          <span className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">Digital</span>
        </div>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {(Object.keys(PRAYERS_TEXTS) as Array<keyof typeof PRAYERS_TEXTS>).map(key => {
          const title = key.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          return (
            <button 
              key={key}
              onClick={() => setSelectedPrayer({key, title})}
              className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm flex items-center gap-4 hover:border-emerald-300 hover:shadow-xl hover:shadow-emerald-100/50 transition-all group text-left active:scale-95"
            >
              <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-all">
                <BookOpen size={28} />
              </div>
              <div className="flex-1">
                <h4 className="font-black text-slate-700 uppercase text-xs tracking-widest">{title}</h4>
                <p className="text-[9px] text-slate-400 mt-1 font-black tracking-widest uppercase">Voz Natural • Sintonizada</p>
              </div>
              <ChevronRight size={20} className="text-slate-200 group-hover:text-emerald-500 transition-transform group-hover:translate-x-1" />
            </button>
          );
        })}
      </div>

      {selectedPrayer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/95 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/20">
            
            <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h3 className="text-xl font-black text-slate-800 uppercase tracking-tight">{selectedPrayer.title}</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Momento de Oração Natural</p>
              </div>
              <button onClick={() => { !isPraying && !showGratitude && setSelectedPrayer(null); }} className="p-3 text-slate-400 hover:bg-slate-200 rounded-full transition-colors">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar">
              {!isPraying && !showGratitude && !interruptionError && (
                <div className="animate-in slide-in-from-bottom-4">
                  <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100 mb-8 shadow-inner text-center">
                    <p className="text-slate-600 text-lg leading-relaxed font-black italic">
                      "{PRAYERS_TEXTS[selectedPrayer.key]}"
                    </p>
                  </div>
                  <button 
                    onClick={startAudio}
                    className="w-full py-6 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-all hover:bg-emerald-700"
                  >
                    <Play size={20} fill="currentColor" /> Ouvir com Voz Natural
                  </button>
                  <p className="text-center text-[9px] text-slate-400 mt-4 uppercase font-black tracking-widest">Cadência Contemplativa</p>
                </div>
              )}

              {isPraying && (
                <div className="flex flex-col items-center py-6 animate-in zoom-in-95">
                  <div className="w-36 h-36 bg-emerald-50 rounded-full flex items-center justify-center mb-10 relative">
                    <div className="absolute inset-0 bg-emerald-200 rounded-full animate-ping opacity-20" />
                    <Volume2 className="text-emerald-600 relative z-10" size={64} />
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tighter">Ouvindo com Fé</h3>
                  <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-10">Voz Natural Humana</p>
                  
                  <div className="w-full mb-10">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] font-black text-emerald-600 tracking-widest">{formatTime(currentTime)}</span>
                      <span className="text-[10px] font-black text-slate-300 tracking-widest">{formatTime(duration)}</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden shadow-inner">
                      <div 
                        className="h-full bg-emerald-500 transition-all duration-100 shadow-sm"
                        style={{ width: `${(currentTime / duration) * 100}%` }}
                      />
                    </div>
                  </div>

                  <button 
                    onClick={stopAudio}
                    className="flex items-center gap-2 px-10 py-4 bg-rose-50 text-rose-600 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-rose-100 transition-colors"
                  >
                    <VolumeXIcon size={20} /> Parar
                  </button>
                </div>
              )}

              {showGratitude && (
                <div className="flex flex-col items-center py-4 animate-in slide-in-from-bottom-8">
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 text-amber-500 shadow-sm border border-amber-100">
                    <Sparkles size={40} className="animate-pulse" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-800 mb-2 uppercase tracking-tight">Concluído!</h3>
                  <p className="text-slate-500 text-sm mb-8 text-center leading-relaxed">Cada oração é uma graça. Quer compartilhar uma palavra curta de gratidão no feed?</p>
                  
                  <div className="w-full relative mb-8">
                    <input 
                      type="text"
                      maxLength={30}
                      value={gratitudeMsg}
                      onChange={(e) => setGratitudeMsg(e.target.value)}
                      placeholder="Ex: Gratidão pela família..."
                      className="w-full px-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder-slate-400 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    />
                  </div>

                  <div className="flex flex-col w-full gap-3 mt-4">
                    <button 
                      onClick={postGrace}
                      disabled={isPosting}
                      className="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl shadow-emerald-200 hover:bg-emerald-700 disabled:opacity-50"
                    >
                      {isPosting ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Postar Graça</>}
                    </button>
                    <button 
                      onClick={() => { setSelectedPrayer(null); setShowGratitude(false); }}
                      className="w-full py-4 text-slate-400 font-black uppercase tracking-widest text-[10px] hover:bg-slate-50 rounded-xl"
                    >
                      Pular
                    </button>
                  </div>
                </div>
              )}

              {interruptionError && (
                <div className="flex flex-col items-center py-10 text-center animate-in zoom-in-95">
                  <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mb-6 text-amber-500">
                    <AlertCircle size={40} />
                  </div>
                  <h3 className="text-xl font-black text-slate-800 mb-2 uppercase">Tempo Insuficiente</h3>
                  <p className="text-slate-500 text-sm mb-10 leading-relaxed">A oração deve ser concluída para ser contabilizada como uma graça.</p>
                  <div className="flex flex-col w-full gap-3">
                    <button onClick={() => setInterruptionError(false)} className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-xs">Tentar Novamente</button>
                  </div>
                </div>
              )}
            </div>

            {prayerLoading && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center z-50">
                <Loader2 className="animate-spin text-emerald-600 mb-4" size={56} />
                <p className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">Sintonizando Voz Natural...</p>
              </div>
            )}
          </div>
        </div>
      )}

      <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl">
        <div className="absolute -bottom-10 -left-10 opacity-10"><Sparkles size={160} /></div>
        <div className="relative z-10 flex items-center gap-6">
          <div className="flex-1">
            <h3 className="text-xl font-black mb-2 uppercase tracking-tight">Comunhão</h3>
            <p className="text-slate-400 text-sm leading-relaxed">Suas orações inspiram outros jovens do círculo.</p>
          </div>
          <div className="bg-emerald-500/20 p-4 rounded-3xl flex flex-col items-center border border-emerald-500/30">
            <CheckCircle2 size={32} className="text-emerald-400" />
            <span className="text-[8px] font-black uppercase mt-1 text-emerald-300">Graças</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Prayers;