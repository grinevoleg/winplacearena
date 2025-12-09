from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from datetime import datetime

from app.database import get_db
from app.models import Challenge, UserChallenge, User
from app.schemas import ChallengeCreate, ChallengeResponse, UserChallengeResponse, UserChallengeToggle

router = APIRouter()

@router.get("/", response_model=List[ChallengeResponse])
async def get_challenges(
    user_id: Optional[str] = None,
    filter_type: Optional[str] = None,  # all, active, completed
    global_only: Optional[bool] = False,
    db: Session = Depends(get_db)
):
    """Get all challenges or user-specific challenges"""
    query = db.query(Challenge)
    
    if global_only:
        query = query.filter(Challenge.is_global == True)
    
    if user_id:
        # Get user's challenges
        user_challenges = db.query(UserChallenge).filter(
            UserChallenge.user_id == user_id
        ).all()
        
        # For global challenges, show all even if not assigned
        if global_only:
            challenges = query.all()
            challenge_ids = [uc.challenge_id for uc in user_challenges]
            user_challenge_map = {uc.challenge_id: uc for uc in user_challenges}
        else:
            challenge_ids = [uc.challenge_id for uc in user_challenges]
            query = query.filter(Challenge.id.in_(challenge_ids))
            challenges = query.all()
            user_challenge_map = {uc.challenge_id: uc for uc in user_challenges}
        
        result = []
        
        for challenge in challenges:
            uc = user_challenge_map.get(challenge.id)
            completed = uc.completed if uc else False
            
            if filter_type == "active" and completed:
                continue
            if filter_type == "completed" and not completed:
                continue
            
            challenge_dict = {
                "id": challenge.id,
                "title": challenge.title,
                "description": challenge.description,
                "difficulty": challenge.difficulty,
                "stars": challenge.stars,
                "deadline": challenge.deadline.isoformat() if hasattr(challenge.deadline, 'isoformat') else challenge.deadline,
                "created_by": challenge.created_by,
                "is_ai": challenge.is_ai,
                "is_global": challenge.is_global,
                "participants_count": challenge.participants_count,
                "completed_count": challenge.completed_count,
                "created_at": challenge.created_at.isoformat() if challenge.created_at and hasattr(challenge.created_at, 'isoformat') else challenge.created_at,
                "completed": completed,  # Add completion status
            }
            result.append(challenge_dict)
        
        return result
    else:
        # Get all challenges (without user context)
        challenges = query.all()
        result = []
        for challenge in challenges:
            challenge_dict = {
                "id": challenge.id,
                "title": challenge.title,
                "description": challenge.description,
                "difficulty": challenge.difficulty,
                "stars": challenge.stars,
                "deadline": challenge.deadline.isoformat() if hasattr(challenge.deadline, 'isoformat') else challenge.deadline,
                "created_by": challenge.created_by,
                "is_ai": challenge.is_ai,
                "is_global": challenge.is_global,
                "participants_count": challenge.participants_count,
                "completed_count": challenge.completed_count,
                "created_at": challenge.created_at.isoformat() if challenge.created_at and hasattr(challenge.created_at, 'isoformat') else challenge.created_at,
                "completed": False,
            }
            result.append(challenge_dict)
        return result

@router.get("/{challenge_id}", response_model=ChallengeResponse)
async def get_challenge(challenge_id: str, db: Session = Depends(get_db)):
    """Get a specific challenge"""
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    return challenge

@router.post("/", response_model=ChallengeResponse)
async def create_challenge(challenge: ChallengeCreate, db: Session = Depends(get_db)):
    """Create a new challenge"""
    import uuid
    
    challenge_id = str(uuid.uuid4())
    db_challenge = Challenge(
        id=challenge_id,
        title=challenge.title,
        description=challenge.description,
        difficulty=challenge.difficulty,
        stars=challenge.stars,
        deadline=challenge.deadline,
        created_by=challenge.created_by,
        is_ai=challenge.is_ai,
        is_global=challenge.is_global,
    )
    
    db.add(db_challenge)
    db.commit()
    db.refresh(db_challenge)
    
    return db_challenge

@router.post("/{challenge_id}/assign")
async def assign_challenge_to_user(
    challenge_id: str,
    user_id: str,
    db: Session = Depends(get_db)
):
    """Assign a challenge to a user"""
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    # Check if already assigned
    existing = db.query(UserChallenge).filter(
        and_(
            UserChallenge.user_id == user_id,
            UserChallenge.challenge_id == challenge_id
        )
    ).first()
    
    if existing:
        raise HTTPException(status_code=400, detail="Challenge already assigned to user")
    
    user_challenge = UserChallenge(
        user_id=user_id,
        challenge_id=challenge_id,
        completed=False
    )
    
    db.add(user_challenge)
    
    # Update global challenge participants count
    if challenge.is_global:
        challenge.participants_count = (challenge.participants_count or 0) + 1
    
    db.commit()
    db.refresh(user_challenge)
    
    return {"message": "Challenge assigned successfully", "user_challenge_id": user_challenge.id}

@router.put("/{challenge_id}/toggle")
async def toggle_challenge(
    challenge_id: str,
    user_id: str,
    db: Session = Depends(get_db)
):
    """Toggle challenge completion status"""
    user_challenge = db.query(UserChallenge).filter(
        and_(
            UserChallenge.user_id == user_id,
            UserChallenge.challenge_id == challenge_id
        )
    ).first()
    
    if not user_challenge:
        raise HTTPException(status_code=404, detail="Challenge not found for user")
    
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    user = db.query(User).filter(User.id == user_id).first()
    
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Toggle completion
    new_completed = not user_challenge.completed
    user_challenge.completed = new_completed
    user_challenge.completed_at = datetime.now() if new_completed else None
    
    # Update user stats
    if new_completed:
        user.completed_challenges += 1
        user.total_stars += challenge.stars
    else:
        user.completed_challenges = max(0, user.completed_challenges - 1)
        user.total_stars = max(0, user.total_stars - challenge.stars)
    
    user.can_publish = user.completed_challenges >= 5
    
    # Update global challenge stats
    if challenge.is_global:
        if new_completed:
            challenge.completed_count = (challenge.completed_count or 0) + 1
        else:
            challenge.completed_count = max(0, (challenge.completed_count or 0) - 1)
    
    db.commit()
    db.refresh(user_challenge)
    db.refresh(user)
    
    return {
        "completed": user_challenge.completed,
        "user_stats": {
            "completed_challenges": user.completed_challenges,
            "total_stars": user.total_stars,
            "can_publish": user.can_publish
        }
    }

@router.delete("/{challenge_id}")
async def delete_challenge(challenge_id: str, db: Session = Depends(get_db)):
    """Delete a challenge"""
    challenge = db.query(Challenge).filter(Challenge.id == challenge_id).first()
    if not challenge:
        raise HTTPException(status_code=404, detail="Challenge not found")
    
    db.delete(challenge)
    db.commit()
    
    return {"message": "Challenge deleted successfully"}

