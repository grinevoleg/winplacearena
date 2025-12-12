import { NextRequest, NextResponse } from 'next/server';

declare global {
  var userChallenges: any[];
  var users: any[];
  var challenges: any[];
}

if (!global.userChallenges) {
  global.userChallenges = [];
}
if (!global.users) {
  global.users = [{ id: 'user1', name: 'Challenger', completedChallenges: 0, totalStars: 0, canPublish: false }];
}
if (!global.challenges) {
  global.challenges = [];
}

const userChallenges = global.userChallenges;
const users = global.users;
const challenges = global.challenges;

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Initialize global challenges if needed
    initGlobalChallengesIfNeeded();
    
    const challengeId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id') || 'user1';
    
    // Find or create userChallenge
    let uc = userChallenges.find(
      u => u.userId === userId && u.challengeId === challengeId
    );
    
    if (!uc) {
      uc = { userId, challengeId, completed: false };
      userChallenges.push(uc);
    }
    
    // Toggle status
    uc.completed = !uc.completed;
    
    // Update user statistics
    let user = users.find(u => u.id === userId);
    if (!user) {
      user = { id: userId, name: 'Challenger', completedChallenges: 0, totalStars: 0, canPublish: false };
      users.push(user);
    }
    
    // Get stars from challenge
    const challenge = challenges.find(c => c.id === challengeId);
    const stars = challenge?.stars || 5;
    
    if (uc.completed) {
      user.completedChallenges += 1;
      user.totalStars += stars;
    } else {
      user.completedChallenges = Math.max(0, user.completedChallenges - 1);
      user.totalStars = Math.max(0, user.totalStars - stars);
    }
    
    user.canPublish = user.completedChallenges >= 5;
    
    return NextResponse.json({
      completed: uc.completed,
      user_stats: {
        completed_challenges: user.completedChallenges,
        total_stars: user.totalStars,
        can_publish: user.canPublish,
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

