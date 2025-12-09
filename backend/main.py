from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import uvicorn
import os

from app.database import init_db
from app.routers import challenges, users, leaderboard, ai

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    init_db()
    # Initialize test data if needed
    try:
        from app.init_data import init_test_data
        init_test_data()
    except Exception as e:
        print(f"Не удалось инициализировать тестовые данные: {e}")
    yield
    # Shutdown
    pass

app = FastAPI(
    title="Win Place Arena API",
    description="API для приложения челленджей",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware
allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Add production frontend URL if set
frontend_url = os.getenv("FRONTEND_URL")
if frontend_url:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(challenges.router, prefix="/api/challenges", tags=["challenges"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(leaderboard.router, prefix="/api/leaderboard", tags=["leaderboard"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

@app.get("/")
async def root():
    return {"message": "Win Place Arena API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

