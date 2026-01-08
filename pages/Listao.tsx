
import React, { useState, useMemo, useEffect } from 'react';
import { COLORS } from '../constants';
import { Member } from '../types';
import { Search, Instagram, Phone, BookOpen, Loader2, Users, Filter } from 'lucide-react';

const Listao: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState<'Todos' | 'Encontrista' | 'Equipe'>('Todos');
  const [selectedSubFilter, setSelectedSubFilter] = useState<string>('Todos');

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const response = await fetch('/members.json');
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error("Erro ao carregar listão:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadMembers();
  }, []);

  // Reset subfilter when category changes
  useEffect(() => {
    setSelectedSubFilter('Todos');
  }, [category]);

  const circles = ['Vermelho', 'Verde', 'Amarelo', 'Azul'];
  
  const teams = useMemo(() => {
    const allTeams = members
      .filter(m => m.category === 'Equipe')
      .map(m => m.team);
    return Array.from(new Set(allTeams)).sort();
  }, [members]);

  const filteredMembers = useMemo(() => {
    return members.filter(member => {
      const matchesSearch = 
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        member.nickname.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = category === 'Todos' || member.category === category;
      const matchesSubFilter = selectedSubFilter === 'Todos' || member.team === selectedSubFilter;
      
      return matchesSearch && matchesCategory && matchesSubFilter;
    });
  }, [members, searchTerm, category, selectedSubFilter]);

  const getTeamBadgeClasses = (member: Member) => {
    if (member.category === 'Encontrista') {
      switch (member.team) {
        case 'Verde': return COLORS.green;
        case 'Amarelo': return COLORS.yellow;
        case 'Vermelho': return COLORS.red;
        case 'Azul': return COLORS.blue;
        default: return COLORS.neutral;
      }
    }
    return 'text-slate-700 bg-slate-100 border-slate-200';
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <Loader2 className="text-emerald-600 animate-spin mb-4" size={40} />
        <p className="text-slate-500 font-medium italic">Preparando o Listão...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search & Main Category Filter */}
      <section className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm space-y-4">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Listão EJC</h2>
            <p className="text-slate-500 text-sm">Diretório de membros e equipes do encontro.</p>
          </div>
          <div className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-widest">{filteredMembers.length} Pessoas</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nome ou apelido..."
              className="w-full pl-11 pr-4 py-3 bg-slate-900 text-white placeholder-slate-500 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex bg-slate-50 p-1 rounded-2xl border border-slate-100">
          {(['Todos', 'Encontrista', 'Equipe'] as const).map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                category === cat 
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-100' 
                : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {cat === 'Encontrista' ? 'Encontristas' : cat === 'Equipe' ? 'Equipes' : 'Todos'}
            </button>
          ))}
        </div>

        {/* Sub-Filters */}
        {category !== 'Todos' && (
          <div className="pt-2 animate-in fade-in slide-in-from-top-2 duration-300">
            {category === 'Encontrista' ? (
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                <button 
                  onClick={() => setSelectedSubFilter('Todos')}
                  className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border transition-all ${selectedSubFilter === 'Todos' ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-500 border-slate-200'}`}
                >
                  Todos
                </button>
                {circles.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedSubFilter(c)}
                    className={`flex-shrink-0 px-4 py-1.5 rounded-full text-[10px] font-bold uppercase border transition-all ${
                      selectedSubFilter === c 
                      ? 'bg-slate-800 text-white border-slate-800' 
                      : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Filter size={14} className="text-slate-400" />
                <select 
                  className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-600 focus:outline-none"
                  value={selectedSubFilter}
                  onChange={(e) => setSelectedSubFilter(e.target.value)}
                >
                  <option value="Todos">Todas as Equipes de Trabalho</option>
                  {teams.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            )}
          </div>
        )}
      </section>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredMembers.length > 0 ? (
          filteredMembers.map(member => (
            <div key={member.id} className="bg-white rounded-3xl p-5 border border-slate-100 shadow-sm flex items-start gap-4 group">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border-2 shadow-sm flex-shrink-0 overflow-hidden ${getTeamBadgeClasses(member)}`}>
                <img 
                  src={member.photoUrl} 
                  alt={member.nickname}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-800 truncate pr-2 group-hover:text-emerald-700 transition-colors">
                    {member.name}
                  </h4>
                  <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider whitespace-nowrap ${getTeamBadgeClasses(member)}`}>
                    {member.team}
                  </span>
                </div>
                
                <p className="text-xs text-slate-400 font-medium mb-3">
                  "{member.nickname}" • {member.category} {member.year}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  <a 
                    href={`https://instagram.com/${member.instagram}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-rose-50 hover:text-rose-600 transition-colors border border-transparent hover:border-rose-100"
                  >
                    <Instagram size={12} /> @{member.instagram}
                  </a>
                  <a 
                    href={`https://wa.me/${member.contact}`} 
                    target="_blank" 
                    rel="noreferrer"
                    className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-emerald-50 hover:text-emerald-600 transition-colors border border-transparent hover:border-emerald-100"
                  >
                    <Phone size={12} /> Contato
                  </a>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-400 font-medium italic">Nenhum membro encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Listao;
