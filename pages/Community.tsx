
import React from 'react';
import { MessageSquareOff, Rocket, Construction, Sparkles } from 'lucide-react';

const Community: React.FC = () => {
  return (
    <div className="h-[calc(100vh-180px)] flex items-center justify-center p-4 animate-in fade-in duration-700">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 p-8 text-center relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Sparkles size={120} />
        </div>
        
        <div className="relative z-10">
          <div className="w-24 h-24 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce duration-[3000ms]">
            <Construction className="text-emerald-600" size={48} />
          </div>

          <h2 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">
            Em Construção
          </h2>
          
          <div className="space-y-4">
            <p className="text-slate-500 leading-relaxed">
              O módulo de <span className="font-bold text-emerald-600">Comunidade</span> não está disponível no momento.
            </p>
            
            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <p className="text-sm text-slate-600 leading-relaxed italic">
                "Nossa equipe de TI está trabalhando intensamente para entregar novas funcionalidades e ferramentas de interação para melhor atender ao nosso encontro e fortalecer nossa união."
              </p>
            </div>

            <div className="flex items-center justify-center gap-2 py-4">
              <Rocket size={18} className="text-amber-500" />
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Novidades chegando em breve</span>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
              "EJC é mesmo assim, foi Deus quem quis isso pra mim!"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Community;
