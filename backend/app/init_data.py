"""
Скрипт для инициализации тестовых данных в базе данных
"""
from app.database import SessionLocal
from app.models import Challenge
from datetime import datetime, timedelta

def init_test_data():
    """Создать тестовые глобальные челленджи"""
    db = SessionLocal()
    
    try:
        # Проверяем, есть ли уже глобальные челленджи
        existing = db.query(Challenge).filter(Challenge.is_global == True).first()
        if existing:
            print("Глобальные челленджи уже существуют, пропускаем инициализацию")
            return
        
        # Создаем глобальные челленджи
        global_challenges = [
            {
                "id": "g1",
                "title": "30-Day Fitness Challenge",
                "description": "Exercise for at least 30 minutes every day for a month",
                "difficulty": "hard",
                "stars": 10,
                "deadline": datetime.now() + timedelta(days=30),
                "is_global": True,
                "participants_count": 1247,
                "completed_count": 523,
            },
            {
                "id": "g2",
                "title": "Read 5 Books This Month",
                "description": "Finish reading 5 books of any genre by end of month",
                "difficulty": "medium",
                "stars": 7,
                "deadline": datetime.now() + timedelta(days=20),
                "is_global": True,
                "participants_count": 892,
                "completed_count": 234,
            },
            {
                "id": "g3",
                "title": "Zero Waste Week",
                "description": "Produce no waste for 7 consecutive days",
                "difficulty": "extreme",
                "stars": 15,
                "deadline": datetime.now() + timedelta(days=10),
                "is_global": True,
                "participants_count": 456,
                "completed_count": 89,
            },
            {
                "id": "g4",
                "title": "Learn a New Language",
                "description": "Study a new language for 20 minutes daily for 2 weeks",
                "difficulty": "medium",
                "stars": 6,
                "deadline": datetime.now() + timedelta(days=14),
                "is_global": True,
                "participants_count": 2103,
                "completed_count": 876,
            },
            {
                "id": "g5",
                "title": "Cold Shower Challenge",
                "description": "Take cold showers every day for a week",
                "difficulty": "easy",
                "stars": 4,
                "deadline": datetime.now() + timedelta(days=7),
                "is_global": True,
                "participants_count": 3421,
                "completed_count": 1876,
            },
        ]
        
        for challenge_data in global_challenges:
            challenge = Challenge(**challenge_data)
            db.add(challenge)
        
        db.commit()
        print(f"Создано {len(global_challenges)} глобальных челленджей")
        
    except Exception as e:
        print(f"Ошибка при создании тестовых данных: {e}")
        db.rollback()
    finally:
        db.close()


