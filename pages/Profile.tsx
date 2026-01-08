
import React from 'react';
import { Calendar, Shield, Award, Clock, LogOut, Edit3 } from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileProps {
  user: UserProfile;
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onLogout }) => {
  if (!user) return null;

  return (
    <div className="space-y-6 animate-in fade-in duration-700 max-w-2xl mx-auto">
      {/* Profile Header */}
      <section className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center">
        <div className="relative mb-4">
          <img 
            src={user.photoUrl || 'https://picsum.photos/seed/default/200/200'} 
            alt={user.name} 
            className="w-24 h-24 rounded-3xl object-cover shadow-lg border-2 border-white"
          />
          <div className="absolute -bottom-2 -right-2 bg-emerald-600 text-white p-1.5 rounded-xl shadow-md">
            <Shield size={16} />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-slate-800">{user.name}</h2>
        <div className="flex items-center gap-2 mt-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100 uppercase tracking-wider">
            {user.role}
          </span>
          <span className="text-slate-400 text-xs font-medium">•</span>
          <span className="text-slate-500 text-xs font-semibold">{user.currentTeam}</span>
        </div>
        <p className="text-slate-400 text-xs mt-2 italic">"{user.nickname}"</p>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
          <Award className="text-amber-500 mb-2" size={24} />
          <span className="text-xl font-bold text-slate-800">{user.relics?.length || 0}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Relíquias</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center">
          <Clock className="text-sky-500 mb-2" size={24} />
          <span className="text-xl font-bold text-slate-800">{user.points}</span>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pontos Totais</span>
        </div>
      </div>

      {/* History */}
      {user.history && user.history.length > 0 && (
        <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Calendar size={18} className="text-slate-400" /> Histórico de Serviço
          </h3>
          
          <div className="space-y-6 relative before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {user.history.map((item, idx) => (
              <div key={idx} className="flex items-start gap-4 relative pl-8">
                <div className="absolute left-1.5 top-2 w-2.5 h-2.5 rounded-full bg-emerald-600 border-2 border-white ring-2 ring-emerald-100"></div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800 text-sm">{item.team}</h4>
                  <p className="text-xs text-slate-500 font-medium">Equipe do Encontro {item.year}</p>
                </div>
                <span className="text-xs font-black text-slate-300">{item.year}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Ações do Usuário */}
      <div className="flex flex-col gap-3 pb-8">
        <button className="w-full py-4 flex items-center justify-center gap-2 text-slate-600 text-sm font-bold uppercase tracking-widest border border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors">
          <Edit3 size={18} /> Editar Perfil
        </button>
        
        <button 
          onClick={onLogout}
          className="w-full py-4 flex items-center justify-center gap-2 text-rose-500 text-sm font-bold uppercase tracking-widest border border-rose-100 rounded-2xl hover:bg-rose-50 transition-colors"
        >
          <LogOut size={18} /> Sair do Aplicativo
        </button>
      </div>
    </div>
  );
};

export default Profile;
