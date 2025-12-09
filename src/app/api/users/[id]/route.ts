import { NextRequest, NextResponse } from 'next/server';

declare global {
  var users: any[];
}

if (!global.users) {
  global.users = [];
}

const users = global.users;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = params.id;
    
    let user = users.find(u => u.id === userId);
    
    if (!user) {
      // Создаем пользователя по умолчанию
      user = {
        id: userId,
        name: 'Challenger',
        completed_challenges: 0,
        total_stars: 0,
        can_publish: false,
      };
      users.push(user);
    }
    
    return NextResponse.json({
      id: user.id,
      name: user.name,
      completedChallenges: user.completed_challenges || 0,
      totalStars: user.total_stars || 0,
      canPublish: user.can_publish || false,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const user = {
      id: body.id,
      name: body.name,
      completed_challenges: 0,
      total_stars: 0,
      can_publish: false,
    };
    
    users.push(user);
    
    return NextResponse.json({
      id: user.id,
      name: user.name,
      completedChallenges: 0,
      totalStars: 0,
      canPublish: false,
    });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}

