import { NextRequest, NextResponse } from 'next/server';

declare global {
  var challenges: any[];
  var userChallenges: any[];
}

if (!global.challenges) {
  global.challenges = [];
}
if (!global.userChallenges) {
  global.userChallenges = [];
}

const challenges = global.challenges;
const userChallenges = global.userChallenges;

// Инициализируем глобальные челленджи при первом запросе
const initGlobalChallenges = () => {
  if (challenges.length === 0) {
    const now = Date.now();
    challenges.push(...[
      {
        id: 'g1',
        title: '30-Day Fitness Challenge',
        description: 'Exercise for at least 30 minutes every day for a month',
        difficulty: 'hard',
        stars: 10,
        deadline: new Date(now + 30 * 24 * 60 * 60 * 1000).toISOString(),
        is_global: true,
        participants_count: 1247,
        completed_count: 523,
        created_at: new Date().toISOString(),
      },
      {
        id: 'g2',
        title: 'Read 5 Books This Month',
        description: 'Finish reading 5 books of any genre by end of month',
        difficulty: 'medium',
        stars: 7,
        deadline: new Date(now + 20 * 24 * 60 * 60 * 1000).toISOString(),
        is_global: true,
        participants_count: 892,
        completed_count: 234,
        created_at: new Date().toISOString(),
      },
      {
        id: 'g3',
        title: 'Zero Waste Week',
        description: 'Produce no waste for 7 consecutive days',
        difficulty: 'extreme',
        stars: 15,
        deadline: new Date(now + 10 * 24 * 60 * 60 * 1000).toISOString(),
        is_global: true,
        participants_count: 456,
        completed_count: 89,
        created_at: new Date().toISOString(),
      },
      {
        id: 'g4',
        title: 'Learn a New Language',
        description: 'Study a new language for 20 minutes daily for 2 weeks',
        difficulty: 'medium',
        stars: 6,
        deadline: new Date(now + 14 * 24 * 60 * 60 * 1000).toISOString(),
        is_global: true,
        participants_count: 2103,
        completed_count: 876,
        created_at: new Date().toISOString(),
      },
      {
        id: 'g5',
        title: 'Cold Shower Challenge',
        description: 'Take cold showers every day for a week',
        difficulty: 'easy',
        stars: 4,
        deadline: new Date(now + 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_global: true,
        participants_count: 3421,
        completed_count: 1876,
        created_at: new Date().toISOString(),
      },
    ]);
  }
};

export async function GET(request: NextRequest) {
  try {
    initGlobalChallenges();
    
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id') || 'user1';
    
    // Получаем только глобальные челленджи
    const globalChallengesList = challenges.filter(c => c.is_global);
    
    // Добавляем статус completed для пользователя
    const result = globalChallengesList.map(challenge => {
      const uc = userChallenges.find(
        u => u.userId === userId && u.challengeId === challenge.id
      );
      return {
        ...challenge,
        completed: uc?.completed || false,
      };
    });
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json([]);
  }
}

