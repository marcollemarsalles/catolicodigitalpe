
export enum UserRole {
  PARTICIPANT = 'Participante',
  SERVER = 'Servidor',
  COORDINATOR = 'Coordenador'
}

export enum RelicRarity {
  COMMON = 'Comum',
  RARE = 'Rara',
  EPIC = 'Épica',
  LEGENDARY = 'Lendária'
}

export type CircleColor = 'Vermelho' | 'Verde' | 'Amarelo' | 'Azul';

export interface Member {
  id: string;
  name: string;
  nickname: string;
  year: number;
  contact: string;
  category: 'Encontrista' | 'Equipe';
  team: string; 
  instagram: string;
  photoUrl: string;
}

export interface Relic {
  id: string;
  name: string;
  description: string;
  rarity: RelicRarity | string;
  icon: string;
  unlockedAt?: string;
}

export interface Challenge {
  id: string;
  title: string;
  points: number;
  category: 'Spiritual' | 'Service' | 'Community';
  completed: boolean;
}

export interface EJCEvent {
  id: string;
  theme: string;
  date: string;
  time: string;
  type: 'Reunião' | 'Formação' | 'Encontro' | 'Social';
  location: string;
  visibility: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  isMe: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  nickname: string;
  role: UserRole;
  currentTeam: string;
  history: { team: string; year: number }[];
  points: number;
  relics: { id: string; unlockedAt: string }[];
  photoUrl: string;
}

export interface PrayerActivity {
  id: string;
  userName: string;
  userPhoto: string;
  timestamp: string;
  prayer?: string;
  prayerName: string;
  gratitude?: string;
  userMessage?: string;
  message?: string;
  amenCount: number;
  hasAmened: boolean;
  userGloria?: string; 
  myGloria?: string | null;
  glorias?: Record<string, string>; 
}

export interface LiturgyData {
  data: string;
  liturgia: string;
  cor: string;
  dia: string;
  primeiraLeitura: {
    referencia: string;
    titulo: string;
    texto: string;
  };
  segundaLeitura?: {
    referencia: string;
    titulo: string;
    texto: string;
  };
  salmo: {
    referencia: string;
    refrao: string;
    texto: string;
  };
  evangelho: {
    referencia: string;
    titulo: string;
    texto: string;
  };
}