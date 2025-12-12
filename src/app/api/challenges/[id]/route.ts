import { NextRequest, NextResponse } from 'next/server';

declare global {
  var challenges: any[];
}

if (!global.challenges) {
  global.challenges = [];
}

const challenges = global.challenges;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const challengeId = params.id;
    const challenge = challenges.find(c => c.id === challengeId);
    
    if (!challenge) {
      return NextResponse.json(
        { error: 'Challenge not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}


