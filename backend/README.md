# Win Place Arena Backend API

FastAPI бэкенд для приложения челленджей.

## Установка

```bash
# Создать виртуальное окружение
python -m venv venv

# Активировать виртуальное окружение
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Установить зависимости
pip install -r requirements.txt
```

## Настройка

### OpenAI API (опционально)

Для использования AI генерации челленджей, создайте файл `.env`:

```
OPENAI_API_KEY=your_openai_api_key_here
```

Если ключ не указан, будет использоваться набор предустановленных челленджей.

## Запуск

```bash
# Запуск сервера разработки
python main.py

# Или через uvicorn напрямую
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API будет доступен по адресу: http://localhost:8000

Документация API: http://localhost:8000/docs

## Структура проекта

```
backend/
├── main.py              # Точка входа приложения
├── app/
│   ├── __init__.py
│   ├── database.py      # Настройка базы данных SQLite
│   ├── models.py         # SQLAlchemy модели
│   ├── schemas.py        # Pydantic схемы
│   └── routers/
│       ├── __init__.py
│       ├── challenges.py # API для челленджей
│       ├── users.py       # API для пользователей
│       ├── leaderboard.py # API для таблицы лидеров
│       └── ai.py          # API для AI генерации
└── requirements.txt      # Зависимости Python
```

## API Endpoints

### Challenges
- `GET /api/challenges/` - Получить список челленджей
- `GET /api/challenges/{challenge_id}` - Получить конкретный челлендж
- `POST /api/challenges/` - Создать новый челлендж
- `POST /api/challenges/{challenge_id}/assign` - Назначить челлендж пользователю
- `PUT /api/challenges/{challenge_id}/toggle` - Переключить статус выполнения
- `DELETE /api/challenges/{challenge_id}` - Удалить челлендж

### Users
- `GET /api/users/{user_id}` - Получить профиль пользователя
- `POST /api/users/` - Создать нового пользователя
- `PUT /api/users/{user_id}` - Обновить профиль пользователя

### Leaderboard
- `GET /api/leaderboard/` - Получить таблицу лидеров

### AI
- `POST /api/ai/generate-challenge` - Сгенерировать челлендж с помощью AI

## База данных

Используется SQLite база данных `arena.db`, которая создается автоматически при первом запуске.

Таблицы:
- `users` - пользователи
- `challenges` - челленджи
- `user_challenges` - связь пользователей и челленджей

