
import React from 'react';
import { 
  Leaf, 
  Flame, 
  Crown, 
  ShieldCheck, 
  Heart, 
  Compass, 
  Anchor, 
  Star,
  BookOpen,
  Droplet,
  Mic,
  Church,
  Footprints,
  Sun,
  Zap,
  Eye,
  Wind,
  RefreshCw,
  DoorOpen,
  Plus,
  CloudRain,
  VolumeX,
  Navigation,
  TrendingUp,
  Activity,
  Shield,
  Infinity,
  Users,
  Hand,
  Gift,
  Coffee,
  Package,
  CheckCircle,
  HeartPulse,
  Lock,
  PhoneIncoming,
  Clock,
  Target,
  Sprout,
  Smile,
  HeartHandshake,
  Hammer,
  Home as HomeIcon,
  GripVertical,
  Mic2,
  UserCheck,
  Scale,
  HandMetal,
  Lightbulb,
  Briefcase,
  Stamp,
  Map,
  Brain,
  Sparkles,
  Dna,
  Columns,
  Binoculars,
  Gem,
  Key,
  History,
  Trees
} from 'lucide-react';
import { Relic, RelicRarity, EJCEvent, Challenge } from './types';

export const COLORS = {
  green: 'text-emerald-700 bg-emerald-50 border-emerald-100',
  yellow: 'text-amber-700 bg-amber-50 border-amber-100',
  red: 'text-rose-700 bg-rose-50 border-rose-100',
  blue: 'text-sky-700 bg-sky-50 border-sky-100',
  neutral: 'text-slate-700 bg-slate-50 border-slate-100'
};

export const PRAYERS_TEXTS = {
  PAI_NOSSO: "Pai nosso que estais no céu, santificado seja o vosso nome, venha a nós o vosso reino, seja feita a vossa vontade assim na terra como no céu. O pão nosso de cada dia nos dai hoje, perdoai as nossas ofensas assim como nós perdoamos a quem nos tem ofendido, e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.",
  AVE_MARIA: "Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.",
  SANTO_ANJO: "Santo Anjo do Senhor, meu zeloso guardador, se a ti me confiou a piedade divina, sempre me rege, me guarde, me governe, me ilumine. Amém.",
  SANTO_TERCO: "Iniciamos o Santo Terço. Creio em Deus Pai Todo-Poderoso, Criador do céu e da terra. Pai Nosso, Ave Maria. Meditamos os mistérios da nossa salvação, pedindo a intercessão da Virgem Maria sobre toda a juventude do EJC. Rainha da Paz, rogai por nós."
};

export const MOCK_CHALLENGES: Challenge[] = [
  { id: 'c1', title: 'Participar da Missa do Domingo', points: 50, category: 'Spiritual', completed: true },
  { id: 'c2', title: 'Ajudar na limpeza do salão', points: 30, category: 'Service', completed: false },
  { id: 'c3', title: 'Responder Quiz sobre os Evangelhos', points: 40, category: 'Spiritual', completed: false },
  { id: 'c4', title: 'Convidar um amigo para o encontro', points: 100, category: 'Community', completed: false }
];

export const MOCK_EVENTS: EJCEvent[] = [
  { 
    id: 'e1', 
    theme: 'Missa de Envio', 
    date: '2025-06-01', 
    time: '19:00', 
    type: 'Social', 
    location: 'Igreja Matriz' 
  },
  { 
    id: 'e2', 
    theme: 'Reunião Geral de Equipes', 
    date: '2025-06-05', 
    time: '20:00', 
    type: 'Reunião', 
    location: 'Salão Paroquial' 
  },
  { 
    id: 'e3', 
    theme: 'Formação: O Papel do Jovem na Igreja', 
    date: '2025-06-12', 
    time: '19:30', 
    type: 'Formação', 
    location: 'Auditório' 
  }
];

export const getRelicIcon = (iconName: string, size = 24) => {
  if (!iconName) return <Star size={size} />;
  const isImage = iconName.match(/\.(jpeg|jpg|gif|png|webp|svg)$/i) || iconName.startsWith('http');
  if (isImage) {
    return (
      <img 
        src={iconName} 
        alt="Ícone" 
        className="object-contain rounded-lg"
        style={{ width: size, height: size }}
        onError={(e) => {
          (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/2618/2618111.png';
        }}
      />
    );
  }
  const icons: Record<string, React.ReactNode> = {
    'Leaf': <Leaf size={size} />,
    'Flame': <Flame size={size} />,
    'Crown': <Crown size={size} />,
    'ShieldCheck': <ShieldCheck size={size} />,
    'Heart': <Heart size={size} />,
    'Compass': <Compass size={size} />,
    'Anchor': <Anchor size={size} />,
    'BookOpen': <BookOpen size={size} />,
    'Droplet': <Droplet size={size} />,
    'Mic': <Mic size={size} />,
    'Church': <Church size={size} />,
    'Footprints': <Footprints size={size} />,
    'Sun': <Sun size={size} />,
    'Zap': <Zap size={size} />,
    'Eye': <Eye size={size} />,
    'Wind': <Wind size={size} />,
    'RefreshCw': <RefreshCw size={size} />,
    'DoorOpen': <DoorOpen size={size} />,
    'Plus': <Plus size={size} />,
    'CloudRain': <CloudRain size={size} />,
    'VolumeX': <VolumeX size={size} />,
    'Navigation': <Navigation size={size} />,
    'TrendingUp': <TrendingUp size={size} />,
    'Activity': <Activity size={size} />,
    'Shield': <Shield size={size} />,
    'Infinity': <Infinity size={size} />,
    'Users': <Users size={size} />,
    'Hand': <Hand size={size} />,
    'Gift': <Gift size={size} />,
    'Coffee': <Coffee size={size} />,
    'Package': <Package size={size} />,
    'CheckCircle': <CheckCircle size={size} />,
    'HeartPulse': <HeartPulse size={size} />,
    'Lock': <Lock size={size} />,
    'PhoneIncoming': <PhoneIncoming size={size} />,
    'Clock': <Clock size={size} />,
    'Target': <Target size={size} />,
    'Sprout': <Sprout size={size} />,
    'Smile': <Smile size={size} />,
    'HeartHandshake': <HeartHandshake size={size} />,
    'Hammer': <Hammer size={size} />,
    'Home': <HomeIcon size={size} />,
    'GripVertical': <GripVertical size={size} />,
    'Mic2': <Mic2 size={size} />,
    'UserCheck': <UserCheck size={size} />,
    'Scale': <Scale size={size} />,
    'HandMetal': <HandMetal size={size} />,
    'Lightbulb': <Lightbulb size={size} />,
    'Briefcase': <Briefcase size={size} />,
    'Stamp': <Stamp size={size} />,
    'Map': <Map size={size} />,
    'Brain': <Brain size={size} />,
    'Sparkles': <Sparkles size={size} />,
    'Dna': <Dna size={size} />,
    'Columns': <Columns size={size} />,
    'Binoculars': <Binoculars size={size} />,
    'Gem': <Gem size={size} />,
    'Key': <Key size={size} />,
    'History': <History size={size} />,
    'Trees': <Trees size={size} />
  };
  return icons[iconName] || <Star size={size} />;
};
