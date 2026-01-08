import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Loader2, 
  ChevronRight,
  Info
} from 'lucide-react';
import { EJCEvent } from '../types';
import { subscribeToEvents } from '../services/eventService';

const EventsList: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<EJCEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Escuta todos os eventos do Firebase em tempo real
    const unsubscribe = subscribeToEvents((data) => {
      // Ordena por data antes de salvar no estado (o service já faz, mas garantimos aqui)
      setEvents(data as EJCEvent[]);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const getEventTagColor = (type: string) => {
    switch (type) {
      case 'Reunião': return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'Formação': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Encontro': return 'bg-rose-50 text-rose-700 border-rose-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 space-y-4">
      <Loader2 className="animate-spin text-emerald-600" size={40} />
      <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest text-center">Buscando Agenda Completa...</p>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      {/* Header com botão voltar */}
      <section className="bg-white rounded-[2rem] p-5 md:p-6 border border-slate-100 shadow-sm flex items-center gap-4">
        <button 
          onClick={() => navigate('/')}
          className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all border border-slate-100"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight leading-none">Agenda Geral</h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Todos os compromissos do EJC</p>
        </div>
        <div className="bg-emerald-50 p-2.5 rounded-xl text-emerald-600">
          <CalendarIcon size={20} />
        </div>
      </section>

      {/* Grid de Cards de Eventos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.length > 0 ? (
          events.map((event) => {
            const dateObj = new Date(event.date + 'T00:00:00');
            const day = dateObj.getDate();
            const month = dateObj.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '');
            const year = dateObj.getFullYear();

            return (
              <div 
                key={event.id} 
                className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-emerald-200 transition-all group relative overflow-hidden"
              >
                {/* Badge Decorativo Lateral */}
                <div className="absolute top-0 right-0 w-24 h-24 -mr-8 -mt-8 bg-slate-50 rounded-full group-hover:bg-emerald-50 transition-colors pointer-events-none" />

                <div className="flex items-start gap-5 relative z-10">
                  <div className="bg-slate-50 w-16 h-16 rounded-2xl flex flex-col items-center justify-center border border-slate-100 shadow-sm group-hover:bg-emerald-50 group-hover:border-emerald-100 transition-all">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{month}</span>
                    <span className="text-2xl font-black text-slate-800 leading-none">{day}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-[8px] font-black px-2 py-0.5 rounded-full border uppercase tracking-widest ${getEventTagColor(event.type)}`}>
                        {event.type}
                      </span>
                      <span className="text-[10px] font-black text-slate-300">{year}</span>
                    </div>
                    
                    <h4 className="text-base font-black text-slate-800 group-hover:text-emerald-700 transition-colors leading-tight mb-3">
                      {event.theme}
                    </h4>

                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        <Clock size={12} className="text-slate-300" /> {event.time}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">
                        <MapPin size={12} className="text-slate-300" /> {event.location}
                      </div>
                    </div>
                  </div>

                  <div className="self-center">
                    <ChevronRight size={20} className="text-slate-200 group-hover:text-emerald-500 transition-all" />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white rounded-[2.5rem] p-16 text-center border border-dashed border-slate-200 flex flex-col items-center">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-4">
              <Info size={32} />
            </div>
            <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight">Agenda Vazia</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-xs leading-relaxed italic">
              Não encontramos eventos cadastrados. Fique atento às comunicações da coordenação!
            </p>
            <button 
              onClick={() => navigate('/')}
              className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-700 transition-all"
            >
              Voltar ao Início
            </button>
          </div>
        )}
      </div>

      {/* Informativo de Rodapé */}
      <section className="bg-emerald-600 rounded-[2rem] p-6 text-white text-center shadow-lg shadow-emerald-200/50">
        <p className="text-xs font-black uppercase tracking-widest leading-relaxed">
          "EJC é mesmo assim, foi Deus quem quis isso pra mim!"
        </p>
      </section>
    </div>
  );
};

export default EventsList;