# Архитектура приложения

## Структура

Приложение состоит из двух независимых сервисов:

### 1. Backend API (FastAPI)
- **Путь**: `backend/`
- **Порт**: `8000`
- **Технологии**: Python, FastAPI, SQLAlchemy, PostgreSQL
- **Функции**:
  - REST API для работы с данными
  - База данных (PostgreSQL)
  - AI генерация челленджей
  - Бизнес-логика приложения

### 2. Frontend Web (Next.js)
- **Путь**: `src/`
- **Порт**: `8080` (на DigitalOcean)
- **Технологии**: Next.js, React, TypeScript, Tailwind CSS
- **Функции**:
  - Пользовательский интерфейс
  - Обращение к API через HTTP запросы
  - Клиентская логика

## Взаимодействие

```
┌─────────────┐         HTTP/REST         ┌─────────────┐
│   Frontend  │ ────────────────────────> │   Backend   │
│  (Next.js)  │ <──────────────────────── │   (FastAPI) │
└─────────────┘         JSON Response      └─────────────┘
                                                        │
                                                        ▼
                                                ┌─────────────┐
                                                │  PostgreSQL │
                                                │  Database   │
                                                └─────────────┘
```

## API Endpoints

Все запросы идут на `${NEXT_PUBLIC_API_URL}/api/...`

- `GET /api/challenges/` - получить челленджи
- `POST /api/challenges/` - создать челлендж
- `GET /api/users/{id}` - получить профиль
- `GET /api/leaderboard/` - таблица лидеров
- `POST /api/ai/generate-challenge` - AI генерация

## Переменные окружения

### Frontend:
- `NEXT_PUBLIC_API_URL` - URL бэкенда (автоматически из `${backend.PUBLIC_URL}`)
- `PORT` - порт для запуска (8080)

### Backend:
- `DATABASE_URL` - строка подключения к PostgreSQL
- `FRONTEND_URL` - URL фронтенда (для CORS)
- `OPENAI_API_KEY` - ключ OpenAI (опционально)

## Деплой

Оба сервиса деплоятся отдельно на DigitalOcean Apps Platform:
- Каждый сервис имеет свой URL
- Сервисы общаются через публичные URL
- CORS настроен для безопасного взаимодействия


