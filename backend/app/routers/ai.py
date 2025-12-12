from fastapi import APIRouter, HTTPException
from openai import OpenAI
import os
from typing import Optional

from app.schemas import AIGenerateRequest, AIGenerateResponse

router = APIRouter()

# Initialize OpenAI client (will use environment variable OPENAI_API_KEY)
client = None
try:
    api_key = os.getenv("OPENAI_API_KEY")
    if api_key:
        client = OpenAI(api_key=api_key)
except:
    pass

def get_stars_by_difficulty(difficulty: str) -> int:
    """Map difficulty to stars"""
    mapping = {
        "easy": 3,
        "medium": 5,
        "hard": 8,
        "extreme": 10
    }
    return mapping.get(difficulty, 5)

@router.post("/generate-challenge", response_model=AIGenerateResponse)
async def generate_challenge(request: AIGenerateRequest):
    """Generate a challenge using AI"""
    
    # Fallback challenges if OpenAI is not configured
    fallback_challenges = [
        {
            "title": "Read a book for 30 minutes daily",
            "description": "Dedicate 30 minutes each day to reading. Choose any book you like and track your progress.",
            "difficulty": "easy",
            "stars": 3,
        },
        {
            "title": "Learn a new skill online",
            "description": "Take an online course or watch tutorials to learn something new. Complete at least one module per day.",
            "difficulty": "medium",
            "stars": 5,
        },
        {
            "title": "30-day fitness challenge",
            "description": "Exercise for at least 45 minutes daily. Mix cardio, strength training, and flexibility exercises.",
            "difficulty": "hard",
            "stars": 8,
        },
        {
            "title": "Digital detox weekend",
            "description": "Spend an entire weekend without using social media or unnecessary digital devices.",
            "difficulty": "medium",
            "stars": 5,
        },
        {
            "title": "Cook a new recipe every day",
            "description": "Challenge yourself to cook a different recipe each day. Try cuisines you've never attempted before.",
            "difficulty": "hard",
            "stars": 7,
        },
        {
            "title": "Meditation and mindfulness",
            "description": "Practice meditation for 15 minutes every morning. Focus on breathing and mindfulness techniques.",
            "difficulty": "easy",
            "stars": 3,
        },
        {
            "title": "No sugar challenge",
            "description": "Avoid all added sugars and sugary foods for 7 days. Read labels carefully and choose natural alternatives.",
            "difficulty": "medium",
            "stars": 5,
        },
        {
            "title": "Morning routine mastery",
            "description": "Wake up at the same time every day and complete a 1-hour morning routine including exercise, planning, and self-care.",
            "difficulty": "hard",
            "stars": 8,
        },
    ]
    
    # If OpenAI is not configured, use fallback
    if not client:
        import random
        challenge = random.choice(fallback_challenges)
        if request.difficulty:
            # Filter by difficulty if specified
            filtered = [c for c in fallback_challenges if c["difficulty"] == request.difficulty]
            if filtered:
                challenge = random.choice(filtered)
        
        return AIGenerateResponse(
            title=challenge["title"],
            description=challenge["description"],
            difficulty=challenge["difficulty"],
            stars=challenge["stars"]
        )
    
    # Use OpenAI to generate challenge
    try:
        difficulty = request.difficulty or "medium"
        category = request.category or "general"
        
        prompt = f"""Generate a creative and engaging personal challenge. 
        
Requirements:
- Difficulty level: {difficulty}
- Category: {category}
- The challenge should be specific, measurable, and achievable
- Make it inspiring and motivating
- Return ONLY a JSON object with these exact fields: title, description, difficulty, stars

Example format:
{{
    "title": "30-Day Fitness Challenge",
    "description": "Exercise for at least 45 minutes daily. Mix cardio, strength training, and flexibility exercises.",
    "difficulty": "hard",
    "stars": 8
}}

Generate the challenge now:"""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a creative challenge generator. Always respond with valid JSON only."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.8,
            max_tokens=200
        )
        
        import json
        content = response.choices[0].message.content.strip()
        
        # Try to extract JSON from response
        if content.startswith("```json"):
            content = content.replace("```json", "").replace("```", "").strip()
        elif content.startswith("```"):
            content = content.replace("```", "").strip()
        
        challenge_data = json.loads(content)
        
        # Ensure stars match difficulty
        challenge_data["stars"] = get_stars_by_difficulty(challenge_data.get("difficulty", difficulty))
        challenge_data["difficulty"] = challenge_data.get("difficulty", difficulty)
        
        return AIGenerateResponse(**challenge_data)
        
    except Exception as e:
        # Fallback to predefined challenges on error
        import random
        challenge = random.choice(fallback_challenges)
        if request.difficulty:
            filtered = [c for c in fallback_challenges if c["difficulty"] == request.difficulty]
            if filtered:
                challenge = random.choice(filtered)
        
        return AIGenerateResponse(
            title=challenge["title"],
            description=challenge["description"],
            difficulty=challenge["difficulty"],
            stars=challenge["stars"]
        )


