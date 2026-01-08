import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as htmlToImage from 'html-to-image';
import { 
  Calendar as CalendarIcon, 
  Loader2, 
  Flame, 
  MessageCircle, 
  Sparkles,
  Share2,
  X
} from 'lucide-react';
import { EJCEvent, UserProfile, PrayerActivity } from '../types';
import { subscribeToEvents } from '../services/eventService';
import { subscribeToFeed, updateFeedItem } from '../services/feedService';

interface HomeProps {
  user: UserProfile;
}

const CAROUSEL_ITEMS = [
  { id: 1, title: "Encontro Anual 2025", description: "Inscrições abertas para o maior momento do ano!", image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=800", tag: "Destaque" },
  { id: 2, title: "Missa de Envio", description: "Neste domingo, às 19h na Matriz. Contamos com você!", image: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?auto=format&fit=crop&q=80&w=800", tag: "Aviso" },
  { id: 3, title: "Campanha do Agasalho", description: "Arrecadação no salão paroquial. Participe!", image: "https://images.unsplash.com/photo-1594498653385-d5172c532c00?auto=format&fit=crop&q=80&w=800", tag: "Social" }
];

const GLORIA_EMOJIS = ['🙌', '✨', '🔥', '🕊️', '❤️', '👏', '🙏', '⛪'];

const Home: React.FC<HomeProps> = ({ user }) => {
  const navigate = useNavigate();
  const [prayerFeed, setPrayerFeed] = useState<PrayerActivity[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [loadingFeed, setLoadingFeed] = useState(true);
  const [sharingId, setSharingId] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [activeEmojiPicker, setActiveEmojiPicker] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribeEvents = subscribeToEvents(() => {
      setLoadingEvents(false);
    });

    const unsubscribeFeed = subscribeToFeed((firebaseData) => {
      const sanitizedData = firebaseData.map(item => {
        // Sanitização extra para garantir que glorias seja um objeto Map e evitar erros de Uncaught
        const glorias = (item.glorias && typeof item.glorias === 'object' && !Array.isArray(item.glorias)) 
          ? item.glorias 
          : {} as Record<string, string>;
          
        return {
          ...item,
          myGloria: user?.id ? (glorias as any)[user.id] || null : null,
          glorias: glorias
        };
      });

      setPrayerFeed(sanitizedData as any);
      setLoadingFeed(false);
    });

    const timer = setInterval(() => setCurrentSlide(prev => (prev + 1) % CAROUSEL_ITEMS.length), 5000);
    
    return () => {
      if (unsubscribeEvents) unsubscribeEvents();
      if (unsubscribeFeed) unsubscribeFeed();
      clearInterval(timer);
    };
  }, [user?.id]);

  const handleGloria = async (id: string, emoji: string) => {
    if (!user?.id) return;
    setActiveEmojiPicker(null);

    // Otimismo na UI: atualiza localmente antes do Firebase para uma experiência sem lag
    setPrayerFeed(prev => prev.map(p => {
      if (p.id === id) {
        return { 
          ...p, 
          myGloria: emoji,
          glorias: { ...(p.glorias || {}), [user.id]: emoji }
        };
      }
      return p;
    }));

    try {
      // Usamos dot notation do Firestore para atualizar ou criar a chave específica do usuário
      // Isso garante que cada usuário tenha apenas uma reação por post e mude conforme desejar, sem duplicar contagem
      await updateFeedItem(id, {
        [`glorias.${user.id}`]: emoji
      });
    } catch (error) {
      console.error("Erro ao sincronizar reação:", error);
    }
  };

  const handleShareCard = async (activity: PrayerActivity) => {
    const cardElement = document.getElementById(`prayer-card-${activity.id}`);
    if (!cardElement) return;

    setSharingId(activity.id);

    try {
      setActiveEmojiPicker(null);
      await new Promise(r => setTimeout(r, 150));

      const options = { 
        backgroundColor: '#ffffff', 
        pixelRatio: 2, 
        cacheBust: true,
        filter: (node: any) => {
          if (node.classList && node.classList.contains('hide-on-export')) {
            return false;
          }
          return true;
        }
      };

      const blob = await htmlToImage.toBlob(cardElement, options);
      if (!blob) throw new Error("Falha ao gerar imagem");

      const file = new File([blob], 'graca-ejc.png', { type: 'image/png' });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: 'Minha Graça EJC',
          text: 'EJC é mesmo assim, foi Deus quem quis isso pra mim! 🙌 #catolicodigital'
        });
      } else {
        const dataUrl = await htmlToImage.toPng(cardElement, options);
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = `minha-graca-ejc.png`;
        link.click();
        alert("Sua imagem foi baixada com a marca @catolicodigital! Agora você pode postar no seu Status do WhatsApp.");
      }
    } catch (err: any) {
      console.error("Erro ao compartilhar:", err);
      alert("Não foi possível abrir o compartilhamento. Tente baixar a imagem.");
    } finally {
      setSharingId(null);
    }
  };

  if (loadingEvents && loadingFeed) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest text-center px-6">Sincronizando...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={user?.photoUrl || 'https://picsum.photos/seed/default/200/200'} alt={user?.name} className="w-14 h-14 rounded-2xl object-cover border border-slate-100 shadow-sm" />
          <div>
            <h2 className="text-xl font-bold text-slate-800 tracking-tight leading-none">Paz e Bem, {user?.nickname || user?.name?.split(' ')[0] || 'Jovem'}!</h2>
            <p className="text-slate-400 text-xs font-semibold mt-1">{user?.currentTeam || 'EJC'}</p>
          </div>
        </div>
        <div className="bg-emerald-50 p-2 rounded-xl text-emerald-600 flex flex-col items-center min-w-[60px]">
          <Flame size={20} className="mb-0.5" />
          <span className="text-[10px] font-black uppercase">Fogo</span>
        </div>
      </section>

      <section className="relative h-48 md:h-64 rounded-[2.5rem] overflow-hidden shadow-lg border border-slate-200/50">
        {CAROUSEL_ITEMS.map((item, idx) => (
          <div key={item.id} className={`absolute inset-0 transition-opacity duration-1000 ${idx === currentSlide ? 'opacity-100' : 'opacity-0'}`}>
            <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-6 flex flex-col justify-end">
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full w-fit mb-2 uppercase tracking-widest">{item.tag}</span>
              <h3 className="text-white text-xl md:text-2xl font-black tracking-tight">{item.title}</h3>
              <p className="text-slate-200 text-sm line-clamp-1">{item.description}</p>
            </div>
          </div>
        ))}
      </section>

      {/* Agenda EJC fixada antes do Feed de Graças conforme solicitado */}
      <section className="space-y-4">
        <div className="flex items-center justify-between bg-white rounded-3xl p-5 border border-slate-100 shadow-sm">
          <h3 className="font-black text-slate-800 flex items-center gap-2 uppercase text-xs tracking-widest">
            <CalendarIcon size={18} className="text-emerald-500" /> Agenda EJC
          </h3>
          <button onClick={() => navigate('/eventos')} className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors">Ver Tudo</button>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-amber-500" />
            <h3 className="text-slate-800 font-black uppercase tracking-widest text-xs">Feed de Graças</h3>
          </div>
        </div>

        <div className="space-y-8">
          {prayerFeed.length > 0 ? prayerFeed.map((activity, idx) => {
            // Lógica para contabilizar reações únicas de usuários
            const gloriasMap = activity.glorias || {};
            const gloriasList = Object.values(gloriasMap);
            const uniqueEmojis = Array.from(new Set(gloriasList));
            const totalGlorias = gloriasList.length;

            return (
              <div 
                key={activity.id} 
                id={`prayer-card-${activity.id}`}
                className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40 overflow-hidden animate-in slide-in-from-bottom-4" 
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={activity.userPhoto} alt={activity.userName} className="w-12 h-12 rounded-full object-cover border-2 border-emerald-50 p-0.5 shadow-sm" />
                    <div>
                      <span className="text-base font-black text-slate-800 leading-none">{activity.userName}</span>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">IGREJA MATRIZ</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300">
                    {activity.timestamp ? new Date(activity.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : '--:--'}
                  </span>
                </div>

                <div className="px-5 pb-1">
                  <div className="bg-slate-50 rounded-[2rem] p-5 border border-slate-100 mb-2 relative overflow-hidden">
                    <div className="flex items-center gap-2 mb-3">
                      <Flame size={16} className="text-emerald-500" />
                      <span className="text-[11px] font-black text-emerald-700 uppercase tracking-widest">Graça Alcançada</span>
                    </div>
                    <p className="text-sm text-slate-600 font-semibold leading-relaxed">
                      Recebeu a graça na oração: <strong className="text-slate-900 font-black">{activity.prayerName}</strong>. 
                    </p>
                    {activity.userMessage && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-base text-slate-800 font-black italic">"{activity.userMessage}"</p>
                      </div>
                    )}
                  </div>

                  {totalGlorias > 0 && (
                    <div className="flex flex-wrap gap-1 px-4 mb-3 hide-on-export">
                      <div className="flex -space-x-1.5 overflow-hidden py-1">
                        {uniqueEmojis.slice(0, 5).map((emo, i) => (
                          <div key={i} className="text-sm bg-white border border-slate-100 rounded-full w-6 h-6 flex items-center justify-center shadow-sm">
                            {emo as string}
                          </div>
                        ))}
                      </div>
                      <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest self-center ml-1">
                        {totalGlorias} {totalGlorias === 1 ? 'SHURI' : 'SHURIS'}
                      </span>
                    </div>
                  )}
                </div>

                <div className="px-5 pb-4 flex justify-center">
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] opacity-30">
                    @catolicodigital
                  </span>
                </div>

                <div className="p-5 pt-3 border-t border-slate-50 flex items-center justify-between hide-on-export">
                  <div className="flex items-center">
                    <div className="relative">
                      <button 
                        onClick={() => setActiveEmojiPicker(activeEmojiPicker === activity.id ? null : activity.id)}
                        className={`p-2 transition-all ${activity.myGloria ? 'text-amber-500 scale-110' : 'text-slate-400'}`}
                      >
                        <div className="relative">
                          {activity.myGloria ? (
                            <span className="text-2xl leading-none animate-bounce">{activity.myGloria}</span>
                          ) : (
                            <MessageCircle size={24} />
                          )}
                          {totalGlorias > 0 && (
                            <span className="absolute -top-1 -right-4 bg-amber-500 text-white text-[8px] font-black min-w-4 h-4 px-1 rounded-full flex items-center justify-center border border-white">
                              {totalGlorias}
                            </span>
                          )}
                        </div>
                      </button>
                      
                      {activeEmojiPicker === activity.id && (
                        <div className="absolute bottom-16 left-0 bg-white border border-slate-100 shadow-2xl rounded-3xl p-3 flex gap-3 z-50 animate-in slide-in-from-bottom-4">
                          {GLORIA_EMOJIS.map(emoji => (
                            <button 
                              key={emoji} 
                              onClick={() => handleGloria(activity.id, emoji)}
                              className="text-2xl hover:scale-150 transition-transform p-1"
                            >
                              {emoji}
                            </button>
                          ))}
                          <button onClick={() => setActiveEmojiPicker(null)} className="p-1 text-slate-300 hover:text-rose-500 transition-colors"><X size={18} /></button>
                        </div>
                      )}
                    </div>
                  </div>

                  <button 
                    onClick={() => handleShareCard(activity)}
                    disabled={sharingId === activity.id}
                    className={`p-2 ${sharingId === activity.id ? 'opacity-50' : 'text-slate-400 hover:text-emerald-500 transition-colors'}`}
                  >
                    {sharingId === activity.id ? <Loader2 size={24} className="animate-spin" /> : <Share2 size={24} />}
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="bg-white rounded-[2.5rem] p-16 border border-dashed border-slate-200 text-center flex flex-col items-center">
               <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
                  <MessageCircle size={32} />
               </div>
               <p className="text-slate-400 text-sm italic font-medium">Nenhuma graça compartilhada ainda.</p>
               <p className="text-slate-300 text-[10px] font-black uppercase mt-2 tracking-widest">Seja o primeiro a testemunhar!</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;