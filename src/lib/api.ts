const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'extreme';
  stars: number;
  deadline: string | Date;
  completed?: boolean;
  createdBy?: string;
  isAI?: boolean;
  isGlobal?: boolean;
  participantsCount?: number;
  completedCount?: number;
  createdAt?: string;
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

export interface AIGenerateRequest {
  difficulty?: string;
  category?: string;
}

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      });

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const error = await response.json();
          errorMessage = error.detail || error.message || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        
        console.error(`API Error [${response.status}]: ${url}`, errorMessage);
        throw new Error(errorMessage);
      }

      // Handle empty responses
      const text = await response.text();
      if (!text) {
        return {} as T;
      }
      
      return JSON.parse(text);
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error(`Network error: Cannot connect to ${url}`);
        throw new Error(`Не удалось подключиться к серверу. Проверьте, что бэкенд запущен на ${this.baseUrl}`);
      }
      throw error;
    }
  }

  // Challenges
  async getChallenges(userId?: string, filterType?: string): Promise<Challenge[]> {
    const params = new URLSearchParams();
    if (userId) params.append('user_id', userId);
    if (filterType) params.append('filter_type', filterType);
    
    return this.request<Challenge[]>(`/api/challenges/?${params.toString()}`);
  }

  async getGlobalChallenges(userId?: string): Promise<Challenge[]> {
    const params = new URLSearchParams();
    params.append('global_only', 'true');
    if (userId) {
      params.append('user_id', userId);
    }
    
    return this.request<Challenge[]>(`/api/challenges/?${params.toString()}`);
  }

  async getChallenge(challengeId: string): Promise<Challenge> {
    return this.request<Challenge>(`/api/challenges/${challengeId}`);
  }

  async createChallenge(challenge: Omit<Challenge, 'id' | 'completed'>): Promise<Challenge> {
    return this.request<Challenge>('/api/challenges/', {
      method: 'POST',
      body: JSON.stringify({
        title: challenge.title,
        description: challenge.description,
        difficulty: challenge.difficulty,
        stars: challenge.stars,
        deadline: challenge.deadline,
        created_by: challenge.createdBy,
        is_ai: challenge.isAI || false,
        is_global: challenge.isGlobal || false,
      }),
    });
  }

  async assignChallenge(challengeId: string, userId: string): Promise<void> {
    await this.request(`/api/challenges/${challengeId}/assign?user_id=${userId}`, {
      method: 'POST',
    });
  }

  async toggleChallenge(challengeId: string, userId: string): Promise<{
    completed: boolean;
    user_stats: {
      completed_challenges: number;
      total_stars: number;
      can_publish: boolean;
    };
  }> {
    return this.request(`/api/challenges/${challengeId}/toggle?user_id=${userId}`, {
      method: 'PUT',
    });
  }

  // Users
  async getUser(userId: string): Promise<UserProfile> {
    return this.request<UserProfile>(`/api/users/${userId}`);
  }

  async createUser(user: { id: string; name: string }): Promise<UserProfile> {
    return this.request<UserProfile>('/api/users/', {
      method: 'POST',
      body: JSON.stringify(user),
    });
  }

  async updateUser(userId: string, name?: string): Promise<UserProfile> {
    const params = new URLSearchParams();
    if (name) params.append('name', name);
    
    return this.request<UserProfile>(`/api/users/${userId}?${params.toString()}`, {
      method: 'PUT',
    });
  }

  // Leaderboard
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    return this.request<LeaderboardEntry[]>('/api/leaderboard/');
  }

  // AI
  async generateChallenge(request: AIGenerateRequest = {}): Promise<{
    title: string;
    description: string;
    difficulty: string;
    stars: number;
  }> {
    return this.request('/api/ai/generate-challenge', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

