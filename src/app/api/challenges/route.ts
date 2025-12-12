import { NextRequest, NextResponse } from 'next/server';

declare global {
  var challenges: any[];
  var users: any[];
  var userChallenges: any[];
}

if (!global.challenges) {
  global.challenges = [];
}
if (!global.users) {
  global.users = [];
}
if (!global.userChallenges) {
  global.userChallenges = [];
}

const challenges = global.challenges;
const users = global.users;
const userChallenges = global.userChallenges;

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id') || 'user1';
    const filterType = searchParams.get('filter_type');
    
    // Get user challenges
    const userChallengeIds = userChallenges
      .filter(uc => uc.userId === userId)
      .map(uc => uc.challengeId);
    
    let result = challenges
      .filter(c => userChallengeIds.includes(c.id))
      .map(challenge => {
        const uc = userChallenges.find(u => 
          u.userId === userId && u.challengeId === challenge.id
        );
        return {
          ...challenge,
          completed: uc?.completed || false,
        };
      });
    
    // Filtering
    if (filterType === 'active') {
      result = result.filter(c => !c.completed);
    } else if (filterType === 'completed') {
      result = result.filter(c => c.completed);
    }
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json([]);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const id = Date.now().toString();
    
    const newChallenge = {
      id,
      title: body.title,
      description: body.description,
      difficulty: body.difficulty,
      stars: body.stars,
      deadline: body.deadline,
      created_by: body.created_by || null,
      is_ai: body.is_ai || false,
      is_global: body.is_global || false,
      participants_count: 0,
      completed_count: 0,
      created_at: new Date().toISOString(),
      completed: false,
    };
    
    challenges.push(newChallenge);
    
    return NextResponse.json(newChallenge);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

