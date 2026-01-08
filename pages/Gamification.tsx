
import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_CHALLENGES, getRelicIcon, COLORS } from '../constants';
import { UserProfile, Relic } from '../types';
import { CheckCircle2, Circle, Loader2, Sparkles, Lock } from 'lucide-react';

interface GamificationProps {
  user: UserProfile;
}

const Gamification: React.FC<GamificationProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState<'relics' | 'challenges'>('relics');
  const [relics, setRelics] = useState<Relic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelics = async () => {
      try {
        const response = await fetch('/relics.json');
        const data = await response.json();
        setRelics(data);
      } catch (err) {
        console.error("Erro ao carregar relíquias:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRelics();
  }, []);

  // Ordenação: Conquistadas primeiro, depois por ID
  const sortedRelics = useMemo(() => {
    return [...relics].sort((a, b) => {
      const isAUnlocked = (user.relics || []).some(ur => ur.id === a.id);
      const isBUnlocked = (user.relics || []).some(ur => ur.id === b.id);
      
      if (isAUnlocked && !isBUnlocked) return -1;
      if (!isAUnlocked && isBUnlocked) return 1;
      
      return parseInt(a.id) - parseInt(b.id);
    });
  }, [relics, user.relics]);

  const getRarityStyles = (rarity: string) => {
    switch (rarity) {
      case 'Comum': return COLORS.green;
      case 'Rara': return COLORS.blue;
      case 'Épica': return COLORS.red;
      case 'Lendária': return 'text-purple-700 bg-purple-50 border-purple-100 ring-1 ring-purple-200';
      default: return COLORS.neutral;
    }
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500 pb-10">
      <section className="bg-emerald-600 rounded-3xl p-8 text-white shadow-xl flex flex-col justify-center">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-100 mb-6 text-center">Resumo de Atividades</h3>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <span className="block text-4xl font-black">{user?.points || 0}</span>
            <span className="text-[10px] font-bold uppercase text-emerald-200 tracking-widest">Pontos</span>
          </div>
          <div className="text-center border-x border-emerald-500/30">
            <span className="block text-4xl font-black">{user?.history?.length || 0}</span>
            <span className="text-[10px] font-bold uppercase text-emerald-200 tracking-widest">Equipes</span>
          </div>
          <div className="text-center">
            <span className="block text-4xl font-black">{user?.relics?.length || 0}</span>
            <span className="text-[10px] font-bold uppercase text-emerald-200 tracking-widest">Relíquias</span>
          </div>
        </div>
      </section>

      <div className="flex bg-white p-1 rounded-2xl border border-slate-100 shadow-sm">
        <button
          onClick={() => setActiveTab('relics')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'relics' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          Relíquias
        </button>
        <button
          onClick={() => setActiveTab('challenges')}
          className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'challenges' ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
          }`}
        >
          Desafios
        </button>
      </div>

      {activeTab === 'relics' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-400 italic flex items-center justify-center gap-2">
              <Loader2 size={20} className="animate-spin" /> Sincronizando conquistas...
            </div>
          ) : sortedRelics.map((relic) => {
            const userRelic = (user.relics || []).find(ur => ur.id === relic.id);
            const isUnlocked = !!userRelic;
            const rarityStyle = getRarityStyles(relic.rarity as string);
            
            return (
              <div 
                key={relic.id} 
                className={`bg-white rounded-3xl p-5 border shadow-sm transition-all relative overflow-hidden group ${
                  isUnlocked ? 'border-slate-100' : 'border-dashed border-slate-200 opacity-70 grayscale bg-slate-50/50'
                }`}
              >
                <div className="flex items-start gap-4 relative z-10">
                  <div className={`p-4 rounded-2xl flex items-center justify-center w-20 h-20 flex-shrink-0 transition-transform ${isUnlocked ? 'group-hover:scale-110' : ''} ${rarityStyle}`}>
                    {getRelicIcon(relic.icon, 48)}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`font-bold text-sm ${isUnlocked ? 'text-slate-800' : 'text-slate-400'}`}>
                        {relic.name}
                      </h4>
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${rarityStyle}`}>
                        {relic.rarity}
                      </span>
                    </div>
                    
                    <p className={`text-[11px] leading-relaxed mb-3 ${isUnlocked ? 'text-slate-500' : 'text-slate-400 italic'}`}>
                      {relic.description}
                    </p>
                    
                    {isUnlocked ? (
                      <div className="flex items-center text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50/50 w-fit px-2 py-1 rounded-lg">
                        <CheckCircle2 size={12} className="mr-1" /> Conquistada
                      </div>
                    ) : (
                      <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-slate-200/50 w-fit px-2 py-1 rounded-lg">
                        <Lock size={12} className="mr-1" /> Bloqueada
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="space-y-4">
          {MOCK_CHALLENGES.map((challenge) => (
            <div 
              key={challenge.id}
              className={`bg-white rounded-2xl p-4 border border-slate-100 shadow-sm flex items-center gap-4 transition-all ${
                challenge.completed ? 'bg-emerald-50/30' : ''
              }`}
            >
              <div className={challenge.completed ? 'text-emerald-500' : 'text-slate-300'}>
                {challenge.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </div>
              <div className="flex-1">
                <h4 className={`font-bold text-sm ${challenge.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                  {challenge.title}
                </h4>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-sm font-black text-slate-800">+{challenge.points}</span>
                <span className="text-[8px] font-bold text-slate-400 uppercase">Pontos</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Gamification;
