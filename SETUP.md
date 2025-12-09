# Инструкция по запуску проекта

## Бэкенд (FastAPI)

### 1. Установка зависимостей

```bash
cd backend
python -m venv venv

# Активировать виртуальное окружение
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Установить зависимости
pip install -r requirements.txt
```

### 2. Настройка OpenAI (опционально)

Создайте файл `.env` в папке `backend`:

```bash
OPENAI_API_KEY=your_openai_api_key_here
```

Если ключ не указан, будет использоваться набор предустановленных челленджей.

### 3. Запуск сервера

```bash
python main.py
```

Или через uvicorn:

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

API будет доступен по адресу: http://localhost:8000
Документация API: http://localhost:8000/docs

## Фронтенд (Next.js)

### 1. Установка зависимостей

```bash
npm install
# или
yarn install
# или
bun install
```

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Запуск приложения

```bash
npm run dev
# или
yarn dev
# или
bun dev
```

Приложение будет доступно по адресу: http://localhost:3000

## Структура проекта

```
.
├── backend/                 # FastAPI бэкенд
│   ├── app/
│   │   ├── database.py     # Настройка БД
│   │   ├── models.py        # SQLAlchemy модели
│   │   ├── schemas.py       # Pydantic схемы
│   │   └── routers/          # API роутеры
│   ├── main.py              # Точка входа
│   └── requirements.txt      # Python зависимости
│
└── src/                     # Next.js фронтенд
    ├── app/                 # Страницы
    ├── components/          # React компоненты
    ├── hooks/              # React хуки
    └── lib/                 # Утилиты и API клиент
```

## База данных

SQLite база данных `arena.db` создается автоматически при первом запуске бэкенда в папке `backend/`.

Таблицы:
- `users` - пользователи
- `challenges` - челленджи
- `user_challenges` - связь пользователей и челленджей

При первом запуске автоматически создаются 5 тестовых глобальных челленджей для демонстрации функциональности.

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

## Примечания

- По умолчанию используется пользователь с ID `user1` и именем `Challenger`
- Для полноценной работы AI генерации требуется OpenAI API ключ
- Без OpenAI ключа используются предустановленные челленджи

