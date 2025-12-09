# Win Place Arena

Приложение для создания и выполнения челленджей с геймификацией и AI-генерацией.

## Архитектура

Приложение состоит из двух независимых сервисов:

### 🔧 Backend API (`/backend`)
- **FastAPI** - REST API сервер
- **PostgreSQL** - база данных
- **OpenAI** - генерация челленджей (опционально)
- Порт: `8000`

### 🌐 Frontend Web (`/src`)
- **Next.js 15** - React фреймворк
- **TypeScript** - типизация
- **Tailwind CSS** - стилизация
- Порт: `8080` (production) / `3000` (dev)

## Как это работает

1. **Frontend** загружается в браузере пользователя
2. **Frontend** делает HTTP запросы к **Backend API**
3. **Backend API** обрабатывает запросы и работает с базой данных
4. **Backend API** возвращает JSON ответы
5. **Frontend** отображает данные пользователю

## Быстрый старт

### Локальная разработка

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python main.py
# API доступен на http://localhost:8000
```

**Frontend:**
```bash
npm install
# Создайте .env.local с NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
# Приложение доступно на http://localhost:3000
```

## Деплой на DigitalOcean

Подробная инструкция: [DEPLOY.md](./DEPLOY.md)

Краткая версия: [QUICK_DEPLOY.md](./QUICK_DEPLOY.md)

## Структура проекта

```
.
├── backend/              # Backend API (FastAPI)
│   ├── app/
│   │   ├── routers/      # API endpoints
│   │   ├── models.py     # База данных модели
│   │   └── schemas.py    # Pydantic схемы
│   └── main.py           # Точка входа
│
├── src/                  # Frontend Web (Next.js)
│   ├── app/              # Страницы
│   ├── components/       # React компоненты
│   ├── hooks/            # React хуки
│   └── lib/
│       └── api.ts        # API клиент для обращения к backend
│
└── .do/
    └── app.yaml          # Конфигурация DigitalOcean
```

## API Документация

После запуска backend:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Переменные окружения

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### Backend (.env)
```
DATABASE_URL=sqlite:///./arena.db
OPENAI_API_KEY=your_key_here  # опционально
FRONTEND_URL=http://localhost:3000
```

## Технологии

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.11, SQLAlchemy
- **База данных**: SQLite (локально) / PostgreSQL (production)
- **AI**: OpenAI API (опционально)

## Лицензия

MIT
