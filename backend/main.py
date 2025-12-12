from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from contextlib import asynccontextmanager
import uvicorn
import os
from pathlib import Path

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

# CORS middleware - разрешаем все для упрощения
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(challenges.router, prefix="/api/challenges", tags=["challenges"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(leaderboard.router, prefix="/api/leaderboard", tags=["leaderboard"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

# Статические файлы фронтенда
# Ищем фронтенд в родительской директории или в текущей
frontend_path = Path(__file__).parent.parent / "frontend"
if not frontend_path.exists():
    frontend_path = Path(__file__).parent / "frontend"
if frontend_path.exists():
    # Раздаем статические файлы (CSS, JS, изображения)
    # Используем общий путь /static для всех файлов из frontend
    app.mount("/static", StaticFiles(directory=str(frontend_path)), name="static")
    
    # Главная страница - отдаем index.html
    @app.get("/")
    async def root():
        index_path = frontend_path / "index.html"
        if index_path.exists():
            return FileResponse(str(index_path))
        return {"message": "Win Place Arena API", "version": "1.0.0"}
else:
    @app.get("/")
    async def root():
        return {"message": "Win Place Arena API", "version": "1.0.0"}

@app.get("/health")
async def health():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

