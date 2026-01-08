
import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { Home, Trophy, BookOpen, User, Flame, GraduationCap, BookMarked } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/liturgia', icon: BookMarked, label: 'Liturgia' },
    { path: '/listao', icon: BookOpen, label: 'Listão' },
    { path: '/gamificacao', icon: Trophy, label: 'Conquistas' },
    { path: '/oracoes', icon: Flame, label: 'Orações' },
    { path: '/formacao', icon: GraduationCap, label: 'Formação' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-4 py-3 max-w-5xl mx-auto">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-md flex items-center justify-center text-white font-bold text-lg">
              E
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">
              EJC <span className="text-emerald-600">Digital</span>
            </h1>
          </Link>
          
          <NavLink 
            to="/perfil"
            className={({ isActive }) => 
              `p-2 rounded-xl transition-all ${
                isActive ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
              }`
            }
          >
            <User size={22} />
          </NavLink>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto p-4 pb-24 md:pb-8">
        {children}
      </main>

      {/* Bottom Nav (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 flex justify-around items-center px-1 py-3 md:hidden">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center space-y-1 transition-colors flex-1 ${
                isActive ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              <item.icon size={20} />
              <span className="text-[8px] font-bold uppercase tracking-wider text-center">{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Sidebar Nav (Desktop) */}
      <nav className="hidden md:flex fixed left-0 top-16 bottom-0 w-20 bg-white border-r border-slate-200 flex-col items-center py-8 space-y-6">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              title={item.label}
              className={`p-3 rounded-xl transition-all ${
                isActive ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
              }`}
            >
              <item.icon size={24} />
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
};

export default Layout;
