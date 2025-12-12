import { NextRequest, NextResponse } from 'next/server';

const fallbackChallenges = [
  {
    title: "Read a book for 30 minutes daily",
    description: "Dedicate 30 minutes each day to reading. Choose any book you like and track your progress.",
    difficulty: "easy",
    stars: 3,
  },
  {
    title: "Learn a new skill online",
    description: "Take an online course or watch tutorials to learn something new. Complete at least one module per day.",
    difficulty: "medium",
    stars: 5,
  },
  {
    title: "30-day fitness challenge",
    description: "Exercise for at least 45 minutes daily. Mix cardio, strength training, and flexibility exercises.",
    difficulty: "hard",
    stars: 8,
  },
  {
    title: "Digital detox weekend",
    description: "Spend an entire weekend without using social media or unnecessary digital devices.",
    difficulty: "medium",
    stars: 5,
  },
  {
    title: "Cook a new recipe every day",
    description: "Challenge yourself to cook a different recipe each day. Try cuisines you've never attempted before.",
    difficulty: "hard",
    stars: 7,
  },
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const difficulty = body.difficulty || 'medium';
    
    // Фильтруем по сложности если указана
    const filtered = difficulty 
      ? fallbackChallenges.filter(c => c.difficulty === difficulty)
      : fallbackChallenges;
    
    const challenge = filtered[Math.floor(Math.random() * filtered.length)] || fallbackChallenges[0];
    
    return NextResponse.json(challenge);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(fallbackChallenges[0]);
  }
}


