# Win Place Arena

Приложение для создания и выполнения челленджей с геймификацией и AI-генерацией.

## Технологии

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend**: FastAPI, Python 3.11, SQLAlchemy
- **База данных**: SQLite (локально) / PostgreSQL (production)
- **AI**: OpenAI API (опционально)

## Быстрый старт

### Локальная разработка

1. **Клонируйте репозиторий:**
```bash
git clone https://github.com/grinevoleg/winplacearena.git
cd winplacearena
```

2. **Настройте бэкенд:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python main.py
```

3. **Настройте фронтенд:**
```bash
# В корне проекта
npm install
# Создайте .env.local с NEXT_PUBLIC_API_URL=http://localhost:8000
npm run dev
```

Подробные инструкции в [SETUP.md](./SETUP.md)

## Деплой на DigitalOcean

Инструкция по деплою на DigitalOcean Apps Platform: [DEPLOY.md](./DEPLOY.md)

## Структура проекта

```
.
├── backend/              # FastAPI бэкенд
│   ├── app/
│   │   ├── database.py   # Настройка БД
│   │   ├── models.py     # SQLAlchemy модели
│   │   ├── schemas.py    # Pydantic схемы
│   │   └── routers/      # API роутеры
│   ├── main.py           # Точка входа
│   └── Dockerfile        # Docker образ для бэкенда
├── src/                  # Next.js фронтенд
│   ├── app/              # Страницы
│   ├── components/       # React компоненты
│   ├── hooks/            # React хуки
│   └── lib/              # Утилиты и API клиент
├── .do/                  # DigitalOcean конфигурация
│   └── app.yaml          # App Spec для DO Apps
└── Dockerfile            # Docker образ для фронтенда
```

## Функции

- ✅ Создание и управление челленджами
- ✅ Глобальные челленджи с таблицей лидеров
- ✅ AI-генерация челленджей (OpenAI)
- ✅ Система звезд и достижений
- ✅ QR-коды для обмена челленджами
- ✅ Профили пользователей
- ✅ Таблица лидеров

## Лицензия

MIT
