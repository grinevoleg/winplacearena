import { NextResponse } from 'next/server';

declare global {
  var users: any[];
  var userChallenges: any[];
}

if (!global.users) {
  global.users = [];
}
if (!global.userChallenges) {
  global.userChallenges = [];
}

const users = global.users;
const userChallenges = global.userChallenges;

export async function GET() {
  try {
    // Подсчитываем выполненные челленджи для каждого пользователя
    const completedCounts: Record<string, number> = {};
    
    userChallenges.forEach(uc => {
      if (uc.completed) {
        completedCounts[uc.userId] = (completedCounts[uc.userId] || 0) + 1;
      }
    });
    
    // Создаем записи лидерборда
    const leaderboard = Object.entries(completedCounts)
      .map(([userId, count], index) => {
        const user = users.find(u => u.id === userId) || {
          id: userId,
          name: 'User',
        };
        
        return {
          id: userId,
          name: user.name,
          completedCount: count,
          rank: index + 1,
          avatar: null,
        };
      })
      .sort((a, b) => b.completedCount - a.completedCount)
      .map((entry, index) => ({
        ...entry,
        rank: index + 1,
      }));
    
    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json([]);
  }
}

