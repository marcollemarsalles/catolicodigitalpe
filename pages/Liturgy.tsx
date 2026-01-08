
import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, BookOpen, Loader2, Info, BookMarked, Flame, Sparkles, RefreshCw, Quote } from 'lucide-react';

const Liturgy: React.FC = () => {
  const getTodayFormatted = () => new Date().toISOString().split('T')[0];

  const [date, setDate] = useState<string>(getTodayFormatted());
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchLiturgy = useCallback(async (selectedDate: string) => {
    setLoading(true);
    setError(null);
    try {
      const [year, month, day] = selectedDate.split('-');
      const url = `https://liturgia.up.railway.app/v2/?dia=${day}&mes=${month}&ano=${year}`;

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Erro no servidor (${response.status})`);
      }

      const result = await response.json();
      setData(result);
    } catch (err: any) {
      console.error('Liturgy API Error:', err);
      setError(err.message || 'Não foi possível carregar a liturgia.');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiturgy(date);
  }, [date, fetchLiturgy]);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDate(e.target.value);
  };

  const handleResetDate = () => {
    setDate(getTodayFormatted());
  };

  const getCorStyles = (cor: string) => {
    const normalCor = cor?.toLowerCase() || '';
    if (normalCor.includes('verde')) return 'bg-emerald-600 text-white';
    if (normalCor.includes('roxo')) return 'bg-purple-700 text-white';
    if (normalCor.includes('branco')) return 'bg-white text-slate-800 border-slate-200 shadow-sm';
    if (normalCor.includes('vermelho')) return 'bg-rose-600 text-white';
    if (normalCor.includes('rosa')) return 'bg-pink-400 text-white';
    return 'bg-emerald-600 text-white';
  };

  const ReadingSection = ({
    reading,
    type,
    icon: Icon,
    colorClass,
    isGospel = false
  }: {
    reading: any;
    type: string;
    icon: any;
    colorClass: string;
    isGospel?: boolean;
  }) => {
    if (!reading) return null;

    const text = reading.texto || reading.texto_leitura || '';
    const reference = reading.referencia || reading.referencia_leitura || '';
    const title = reading.titulo || '';

    return (
      <article className={`bg-white rounded-[2.5rem] p-8 md:p-10 border border-slate-100 shadow-sm transition-all hover:shadow-md ${isGospel ? 'ring-2 ring-emerald-100 bg-emerald-50/20' : ''}`}>
        <div className="flex items-center gap-4 mb-8">
          <div className={`w-12 h-12 ${colorClass} rounded-2xl flex items-center justify-center text-white shadow-sm`}>
            <Icon size={24} />
          </div>
          <div>
            <h4 className="font-black text-slate-400 uppercase text-[10px] tracking-[0.2em]">{type}</h4>
            <p className={`text-base font-bold ${isGospel ? 'text-emerald-700' : 'text-slate-700'}`}>{reference}</p>
          </div>
        </div>

        {title && (
          <h5 className="text-xl font-black text-slate-800 mb-6 border-l-4 border-emerald-500 pl-4 leading-tight">
            {title}
          </h5>
        )}

        <p className="text-slate-600 leading-relaxed text-lg whitespace-pre-line font-medium">
          {text}
        </p>

        <div className="mt-8 pt-6 border-t border-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] flex justify-between items-center">
          <span>{isGospel ? '— Palavra da Salvação.' : '— Palavra do Senhor.'}</span>
          {isGospel && <span className="text-emerald-600">Glória a vós, Senhor</span>}
        </div>
      </article>
    );
  };

  const AntifonSection = ({ text, type }: { text: string; type: string }) => {
    if (!text) return null;
    return (
      <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 italic relative overflow-hidden group">
        <Quote className="absolute -top-2 -right-2 text-slate-200 opacity-20 group-hover:opacity-40 transition-opacity" size={80} />
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-2">{type}</span>
        <p className="text-slate-600 text-sm leading-relaxed relative z-10">{text}</p>
      </div>
    );
  };

  const leituras = data?.leituras || {};
  const primeiraLeitura = leituras.primeiraLeitura?.[0] || null;
  const segundaLeitura = leituras.segundaLeitura?.[0] || null;
  const salmo = leituras.salmo?.[0] || null;
  const evangelho = leituras.evangelho?.[0] || null;

  return (
    <div className="space-y-6 pb-10 animate-in fade-in duration-500">
      {/* HEADER COMPACTO E INTEGRADO */}
      <section className="bg-white rounded-[2rem] p-5 md:p-6 border border-slate-100 shadow-sm">
        <div className="flex flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
              <BookMarked size={22} />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg md:text-xl font-black text-slate-800 truncate leading-none">Liturgia Diária</h2>
              <p className="text-slate-400 text-[10px] md:text-xs font-medium truncate mt-1">Alimento para a missão</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDate}
              className="hidden sm:flex p-2.5 bg-slate-50 text-slate-400 rounded-xl hover:bg-emerald-50 hover:text-emerald-600 transition-all border border-slate-100"
              title="Hoje"
            >
              <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </button>

            <div className="relative group">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors pointer-events-none">
                <Calendar size={16} />
              </div>
              <input
                type="date"
                value={date}
                onChange={handleDateChange}
                onClick={(e) => (e.target as any).showPicker?.()}
                className="pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-100 text-slate-700 rounded-xl text-xs font-bold outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition-all cursor-pointer hover:bg-white"
              />
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="relative">
            <Loader2 className="animate-spin text-emerald-600" size={48} />
            <Sparkles className="absolute -top-2 -right-2 text-amber-400 animate-pulse" size={20} />
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Buscando a Palavra...</p>
        </div>
      ) : error ? (
        <div className="bg-white rounded-[2.5rem] p-12 text-center border border-rose-100">
           <Info className="mx-auto text-rose-500 mb-4" size={48} />
           <p className="text-slate-600 font-medium mb-6">{error}</p>
           <button onClick={() => fetchLiturgy(date)} className="px-8 py-3 bg-emerald-600 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200">Tentar novamente</button>
        </div>
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto">
          {/* CARD DE INFORMAÇÕES DO DIA */}
          <section className={`rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-transparent transition-all duration-700 ${getCorStyles(data.cor)}`}>
            <div className="flex flex-col items-center text-center">
               <span className="px-4 py-1.5 rounded-full bg-slate-900/10 backdrop-blur-sm text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                {data.cor || 'Tempo Comum'}
              </span>
              <h3 className="text-2xl md:text-4xl font-black leading-tight mb-4">{data.liturgia}</h3>
              <div className="flex items-center gap-3 text-xs md:text-sm font-bold opacity-80 uppercase tracking-widest">
                <span>{data.data}</span>
                <span className="opacity-40">•</span>
                <span>{data.dia}</span>
              </div>
            </div>
          </section>

          <AntifonSection text={data.antifona_entrada} type="Antífona de Entrada" />

          <ReadingSection reading={primeiraLeitura} type="Primeira Leitura" icon={BookOpen} colorClass="bg-emerald-600" />

          {salmo && (
            <article className="bg-slate-900 text-white rounded-[2.5rem] p-8 md:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
               <div className="absolute -bottom-10 -right-10 opacity-5 pointer-events-none">
                <Flame size={200} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-emerald-400">
                    <Flame size={20} />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-white/30 uppercase tracking-widest">Salmo Responsorial</h4>
                    <p className="text-emerald-400 font-bold">{salmo.referencia}</p>
                  </div>
                </div>
                
                {salmo.refrao && (
                  <div className="bg-white/5 p-6 rounded-2xl border border-white/10 mb-8">
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest block mb-2">Resposta</span>
                    <p className="text-lg md:text-xl font-black text-white italic leading-snug">{salmo.refrao}</p>
                  </div>
                )}
                
                <p className="whitespace-pre-line text-slate-300 leading-relaxed text-lg font-medium italic">
                  {salmo.texto}
                </p>
              </div>
            </article>
          )}

          <ReadingSection reading={segundaLeitura} type="Segunda Leitura" icon={BookOpen} colorClass="bg-emerald-700" />

          <ReadingSection reading={evangelho} type="Santo Evangelho" icon={Sparkles} colorClass="bg-emerald-600" isGospel />

          <AntifonSection text={data.antifona_comunhao} type="Antífona de Comunhão" />
          
          <div className="py-10 text-center">
             <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.4em]">Fonte: Liturgia Diária</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Liturgy;
