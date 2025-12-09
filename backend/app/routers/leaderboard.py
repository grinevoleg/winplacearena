from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List

from app.database import get_db
from app.models import User, UserChallenge
from app.schemas import LeaderboardEntry

router = APIRouter()

@router.get("/", response_model=List[LeaderboardEntry])
async def get_leaderboard(db: Session = Depends(get_db)):
    """Get leaderboard sorted by completed challenges"""
    # Get users with their completed challenge counts
    results = db.query(
        User.id,
        User.name,
        func.count(UserChallenge.id).label('completed_count')
    ).join(
        UserChallenge, User.id == UserChallenge.user_id
    ).filter(
        UserChallenge.completed == True
    ).group_by(
        User.id, User.name
    ).order_by(
        desc('completed_count')
    ).all()
    
    # Build leaderboard entries
    leaderboard = []
    for rank, (user_id, name, completed_count) in enumerate(results, start=1):
        leaderboard.append({
            "id": user_id,
            "name": name,
            "completed_count": completed_count,
            "rank": rank,
            "avatar": None
        })
    
    # Add users with 0 completed challenges at the end
    users_with_challenges = {r[0] for r in results}
    all_users = db.query(User).all()
    
    for user in all_users:
        if user.id not in users_with_challenges:
            leaderboard.append({
                "id": user.id,
                "name": user.name,
                "completed_count": 0,
                "rank": len(leaderboard) + 1,
                "avatar": None
            })
    
    return leaderboard

