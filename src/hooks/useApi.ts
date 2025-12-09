import { useState, useEffect, useCallback } from 'react';
import { apiClient, Challenge, UserProfile, LeaderboardEntry } from '@/lib/api';
import { toast } from 'sonner';

const DEFAULT_USER_ID = 'user1';
const DEFAULT_USER_NAME = 'Challenger';

export function useApi() {
  const [loading, setLoading] = useState(false);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [globalChallenges, setGlobalChallenges] = useState<Challenge[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [completedGlobalChallenges, setCompletedGlobalChallenges] = useState<string[]>([]);

  // Initialize user
  const initializeUser = useCallback(async () => {
    try {
      let user = await apiClient.getUser(DEFAULT_USER_ID).catch(() => null);
      if (!user) {
        user = await apiClient.createUser({ id: DEFAULT_USER_ID, name: DEFAULT_USER_NAME });
      }
      setProfile(user);
    } catch (error) {
      console.error('Failed to initialize user:', error);
      toast.error('Не удалось загрузить профиль');
    }
  }, []);

  // Load challenges
  const loadChallenges = useCallback(async (filterType?: string) => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const data = await apiClient.getChallenges(DEFAULT_USER_ID, filterType);
      setChallenges(data.map(c => ({
        ...c,
        deadline: typeof c.deadline === 'string' ? new Date(c.deadline) : c.deadline,
        completed: c.completed || false,
      })));
    } catch (error) {
      console.error('Failed to load challenges:', error);
      toast.error('Не удалось загрузить челленджи');
    } finally {
      setLoading(false);
    }
  }, [profile]);

  // Load global challenges
  const loadGlobalChallenges = useCallback(async () => {
    if (!profile) return;
    
    setLoading(true);
    try {
      const data = await apiClient.getGlobalChallenges(DEFAULT_USER_ID);
      const mapped = data.map(c => ({
        ...c,
        deadline: typeof c.deadline === 'string' ? new Date(c.deadline) : c.deadline,
        completed: c.completed || false,
      }));
      setGlobalChallenges(mapped);
      
      // Track completed global challenges
      const completed = mapped
        .filter(c => c.completed)
        .map(c => c.id);
      setCompletedGlobalChallenges(completed);
    } catch (error) {
      console.error('Failed to load global challenges:', error);
      toast.error('Не удалось загрузить глобальные челленджи');
    } finally {
      setLoading(false);
    }
  }, [profile]);

  // Load leaderboard
  const loadLeaderboard = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiClient.getLeaderboard();
      setLeaderboard(data);
    } catch (error) {
      console.error('Failed to load leaderboard:', error);
      toast.error('Не удалось загрузить таблицу лидеров');
    } finally {
      setLoading(false);
    }
  }, []);

  // Toggle challenge
  const toggleChallenge = useCallback(async (challengeId: string) => {
    if (!profile) return;
    
    try {
      const result = await apiClient.toggleChallenge(challengeId, DEFAULT_USER_ID);
      setProfile(prev => prev ? {
        ...prev,
        completedChallenges: result.user_stats.completed_challenges,
        totalStars: result.user_stats.total_stars,
        canPublish: result.user_stats.can_publish,
      } : null);
      
      // Update local state
      setChallenges(prev => prev.map(c => 
        c.id === challengeId ? { ...c, completed: result.completed } : c
      ));
      
      toast.success(result.completed ? 'Челлендж выполнен! ⭐' : 'Челлендж отменен');
    } catch (error) {
      console.error('Failed to toggle challenge:', error);
      toast.error('Не удалось обновить статус челленджа');
    }
  }, [profile]);

  // Toggle global challenge
  const toggleGlobalChallenge = useCallback(async (challengeId: string) => {
    if (!profile) return;
    
    try {
      // First assign if not assigned
      try {
        await apiClient.assignChallenge(challengeId, DEFAULT_USER_ID);
      } catch (error: any) {
        // Ignore if already assigned
        if (!error.message?.includes('already assigned')) {
          throw error;
        }
      }
      
      const result = await apiClient.toggleChallenge(challengeId, DEFAULT_USER_ID);
      setProfile(prev => prev ? {
        ...prev,
        completedChallenges: result.user_stats.completed_challenges,
        totalStars: result.user_stats.total_stars,
        canPublish: result.user_stats.can_publish,
      } : null);
      
      // Update completed global challenges
      if (result.completed) {
        setCompletedGlobalChallenges(prev => [...prev, challengeId]);
      } else {
        setCompletedGlobalChallenges(prev => prev.filter(id => id !== challengeId));
      }
      
      // Reload global challenges to get updated stats
      await loadGlobalChallenges();
      
      toast.success(result.completed ? 'Глобальный челлендж выполнен! ⭐' : 'Челлендж отменен');
    } catch (error) {
      console.error('Failed to toggle global challenge:', error);
      toast.error('Не удалось обновить статус челленджа');
    }
  }, [profile, loadGlobalChallenges]);

  // Create challenge
  const createChallenge = useCallback(async (challenge: Omit<Challenge, 'id' | 'completed'>) => {
    if (!profile) return;
    
    try {
      const newChallenge = await apiClient.createChallenge(challenge);
      
      // Assign to user
      await apiClient.assignChallenge(newChallenge.id, DEFAULT_USER_ID);
      
      // Reload challenges
      await loadChallenges();
      
      toast.success('Челлендж создан! 🎉');
      return newChallenge;
    } catch (error) {
      console.error('Failed to create challenge:', error);
      toast.error('Не удалось создать челлендж');
      throw error;
    }
  }, [profile, loadChallenges]);

  // Initialize on mount
  useEffect(() => {
    initializeUser();
  }, [initializeUser]);

  // Load data when profile is ready
  useEffect(() => {
    if (profile) {
      loadChallenges();
      loadGlobalChallenges();
      loadLeaderboard();
    }
  }, [profile, loadChallenges, loadGlobalChallenges, loadLeaderboard]);

  return {
    loading,
    challenges,
    globalChallenges,
    profile,
    leaderboard,
    completedGlobalChallenges,
    toggleChallenge,
    toggleGlobalChallenge,
    createChallenge,
    loadChallenges,
    loadGlobalChallenges,
    loadLeaderboard,
  };
}

