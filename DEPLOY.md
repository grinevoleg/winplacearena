# Инструкция по деплою на DigitalOcean Apps Platform

## Подготовка репозитория

1. **Инициализируйте git репозиторий (если еще не сделано):**
```bash
git init
git add .
git commit -m "Initial commit"
```

2. **Добавьте remote репозиторий:**
```bash
git remote add origin https://github.com/grinevoleg/winplacearena.git
git branch -M main
git push -u origin main
```

## Настройка DigitalOcean Apps Platform

### 1. Создание приложения

1. Зайдите в [DigitalOcean Apps Platform](https://cloud.digitalocean.com/apps)
2. Нажмите "Create App"
3. Выберите "GitHub" как источник
4. Авторизуйтесь и выберите репозиторий `grinevoleg/winplacearena`
5. Выберите ветку `main`
6. Нажмите "Next"

### 2. Настройка компонентов

DigitalOcean автоматически обнаружит конфигурацию из `.do/app.yaml`, но вы можете настроить вручную:

#### Backend Service:
- **Source Directory**: `backend`
- **Dockerfile Path**: `backend/Dockerfile`
- **HTTP Port**: `8000`
- **Health Check Path**: `/health`

#### Frontend Service:
- **Source Directory**: `.` (корень)
- **Build Command**: `npm install && npm run build`
- **Run Command**: `npm start`
- **HTTP Port**: `3000`

### 3. Настройка переменных окружения

В настройках приложения добавьте следующие переменные:

#### Для Backend:
- `OPENAI_API_KEY` (тип: SECRET) - ваш OpenAI API ключ (опционально)
- `DATABASE_URL` (тип: SECRET) - будет автоматически создан при добавлении базы данных
- `FRONTEND_URL` - URL фронтенда (будет доступен после деплоя)

#### Для Frontend:
- `NEXT_PUBLIC_API_URL` - URL бэкенда (будет автоматически установлен через `${backend.PUBLIC_URL}`)

### 4. Настройка базы данных

1. В настройках приложения нажмите "Add Database"
2. Выберите PostgreSQL
3. Выберите план (можно начать с самого дешевого)
4. База данных будет автоматически создана и `DATABASE_URL` будет добавлен в переменные окружения

### 5. Деплой

1. Нажмите "Create Resources"
2. Дождитесь завершения деплоя (обычно 5-10 минут)
3. После успешного деплоя вы получите URL приложения

### 6. Обновление переменных окружения

После деплоя обновите переменные:

1. Зайдите в настройки Backend сервиса
2. Добавьте переменную `FRONTEND_URL` со значением URL вашего фронтенда (например: `https://your-app-name.ondigitalocean.app`)
3. Сохраните и перезапустите сервис

## Альтернативный способ (через App Spec)

Если автоматическое определение не работает, используйте файл `.do/app.yaml`:

1. Убедитесь, что файл `.do/app.yaml` находится в корне репозитория
2. В настройках приложения выберите "Edit App Spec"
3. Вставьте содержимое из `.do/app.yaml`
4. Сохраните и деплойте

## Проверка работы

После деплоя проверьте:

1. **Backend Health**: `https://your-backend-url.ondigitalocean.app/health`
2. **API Docs**: `https://your-backend-url.ondigitalocean.app/docs`
3. **Frontend**: `https://your-frontend-url.ondigitalocean.app`

## Обновление приложения

После каждого push в ветку `main` приложение автоматически передеплоится (если включен `deploy_on_push: true`).

Или можно запустить деплой вручную через панель DigitalOcean.

## Стоимость

Примерная стоимость на DigitalOcean Apps Platform:
- Backend (basic-xxs): ~$5/месяц
- Frontend (basic-xxs): ~$5/месяц  
- PostgreSQL (базовый план): ~$15/месяц
- **Итого**: ~$25/месяц

## Troubleshooting

### Проблемы с базой данных
- Убедитесь, что `DATABASE_URL` правильно установлен
- Проверьте, что база данных создана и доступна

### Проблемы с CORS
- Убедитесь, что `FRONTEND_URL` правильно установлен в backend
- Проверьте, что URL фронтенда добавлен в `allowed_origins`

### Проблемы с билдом
- Проверьте логи билда в панели DigitalOcean
- Убедитесь, что все зависимости указаны в `package.json` и `requirements.txt`

