export type Difficulty = 'easy' | 'medium' | 'hard' | 'extreme';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  stars: number;
  deadline: Date;
  completed: boolean;
  createdBy?: string;
  isAI?: boolean;
  isGlobal?: boolean;
}

export interface UserProfile {
  id: string;
  name: string;
  completedChallenges: number;
  totalStars: number;
  canPublish: boolean;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  completedCount: number;
  rank: number;
  avatar?: string;
}

export interface GlobalChallenge extends Challenge {
  isGlobal: true;
  participantsCount: number;
  completedCount: number;
}