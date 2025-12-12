import { NextRequest, NextResponse } from 'next/server';

declare global {
  var userChallenges: any[];
}

if (!global.userChallenges) {
  global.userChallenges = [];
}

const userChallenges = global.userChallenges;

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const challengeId = params.id;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id') || 'user1';
    
    // Check if already assigned
    const exists = userChallenges.find(
      u => u.userId === userId && u.challengeId === challengeId
    );
    
    if (exists) {
      return NextResponse.json(
        { error: 'Challenge already assigned' },
        { status: 400 }
      );
    }
    
    // Assign challenge
    userChallenges.push({
      userId,
      challengeId,
      completed: false,
    });
    
    return NextResponse.json({ message: 'Challenge assigned successfully' });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

