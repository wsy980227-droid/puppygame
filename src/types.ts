export interface Player {
  id: string;
  name: string;
  score: number;
  emoji: string;
}

export type GameType = 
  | 'CHARACTER_QUIZ'
  | 'MUSIC_QUIZ'
  | 'MEDIA_QUIZ'
  | 'LETTER_HUNT'
  | 'PROCREATE_GUESS'
  | 'MEMORY_CHALLENGE'
  | 'PET_FINDER';

export interface Game {
  id: GameType;
  title: string;
  description: string;
  icon: string;
}

export const GAMES: Game[] = [
  {
    id: 'CHARACTER_QUIZ',
    title: '人物Quiz',
    description: '倒计时3秒，说出照片中的人物名称！',
    icon: '👤'
  },
  {
    id: 'MUSIC_QUIZ',
    title: '听歌识曲',
    description: 'Spotify随机播放，率先抢答正确歌名！',
    icon: '🎵'
  },
  {
    id: 'MEDIA_QUIZ',
    title: '影视Quiz',
    description: '影视片段播放5秒后方可抢答！',
    icon: '🎬'
  },
  {
    id: 'LETTER_HUNT',
    title: '首字母找东西',
    description: '10秒内找出以随机字母开头的东西！',
    icon: '🔍'
  },
  {
    id: 'PROCREATE_GUESS',
    title: '五官猜人',
    description: 'PD在Procreate操作，此处仅负责记分。',
    icon: '🎨'
  },
  {
    id: 'MEMORY_CHALLENGE',
    title: '最强大脑记忆',
    description: '观察图片10秒后消失，回答细节问题！',
    icon: '🧠'
  },
  {
    id: 'PET_FINDER',
    title: '看图找自家宠物',
    description: '在一组照片中指出哪张是你的宠物！',
    icon: '🐶'
  }
];
