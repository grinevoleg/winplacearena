from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ChallengeBase(BaseModel):
    title: str
    description: str
    difficulty: str  # easy, medium, hard, extreme
    stars: int
    deadline: datetime

class ChallengeCreate(ChallengeBase):
    created_by: Optional[str] = None
    is_ai: bool = False
    is_global: bool = False

class ChallengeResponse(ChallengeBase):
    id: str
    created_by: Optional[str] = None
    is_ai: bool = False
    is_global: bool = False
    participants_count: Optional[int] = None
    completed_count: Optional[int] = None
    created_at: datetime
    completed: Optional[bool] = False
    
    class Config:
        from_attributes = True

class UserChallengeResponse(BaseModel):
    challenge: ChallengeResponse
    completed: bool
    completed_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    name: str

class UserCreate(UserBase):
    id: str

class UserResponse(UserBase):
    id: str
    completed_challenges: int
    total_stars: int
    can_publish: bool
    
    class Config:
        from_attributes = True

class UserChallengeToggle(BaseModel):
    challenge_id: str
    completed: bool

class LeaderboardEntry(BaseModel):
    id: str
    name: str
    completed_count: int
    rank: int
    avatar: Optional[str] = None
    
    class Config:
        from_attributes = True

class AIGenerateRequest(BaseModel):
    difficulty: Optional[str] = None
    category: Optional[str] = None

class AIGenerateResponse(BaseModel):
    title: str
    description: str
    difficulty: str
    stars: int

