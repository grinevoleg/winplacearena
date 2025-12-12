# Где найти URL бэкенда и фронтенда на DigitalOcean

## После деплоя приложения

### 1. Зайдите в панель DigitalOcean Apps

1. Откройте https://cloud.digitalocean.com/apps
2. Найдите ваше приложение `winplacearena`
3. Нажмите на него, чтобы открыть детали

### 2. Найдите URL сервисов

В разделе **"Components"** или **"Services"** вы увидите:

#### Frontend URL:
- Название: `frontend`
- URL будет выглядеть примерно так: `https://winplacearena-frontend-xxxxx.ondigitalocean.app`
- Это **PUBLIC URL** фронтенда

#### Backend URL:
- Название: `backend`  
- URL будет выглядеть примерно так: `https://winplacearena-backend-xxxxx.ondigitalocean.app`
- Это **PUBLIC URL** бэкенда

### 3. Где скопировать URL

1. В карточке каждого сервиса есть кнопка **"Copy URL"** или просто кликните на URL
2. Или в разделе **"Settings"** → **"Domains"** вы увидите все URL

## Настройка переменных окружения

### Для Frontend:
1. Зайдите в настройки сервиса `frontend`
2. Раздел **"Environment Variables"**
3. Найдите переменную `NEXT_PUBLIC_API_URL`
4. Она должна автоматически установиться в `${backend.PUBLIC_URL}`

### Для Backend:
1. Зайдите в настройки сервиса `backend`
2. Раздел **"Environment Variables"**
3. Добавьте переменную `FRONTEND_URL`:
   - **Key**: `FRONTEND_URL`
   - **Value**: URL вашего фронтенда (скопируйте из карточки frontend сервиса)
   - **Scope**: `RUN_TIME`

## Пример

Если ваши URL такие:
- Frontend: `https://winplacearena-frontend-abc123.ondigitalocean.app`
- Backend: `https://winplacearena-backend-xyz789.ondigitalocean.app`

Тогда:
- `NEXT_PUBLIC_API_URL` (в frontend) = `https://winplacearena-backend-xyz789.ondigitalocean.app`
- `FRONTEND_URL` (в backend) = `https://winplacearena-frontend-abc123.ondigitalocean.app`

## Проверка работы

### Проверьте Backend:
```bash
curl https://your-backend-url.ondigitalocean.app/health
```
Должно вернуть: `{"status":"ok"}`

### Проверьте Frontend:
Просто откройте URL фронтенда в браузере

## Если URL не видно

1. Убедитесь, что деплой завершился успешно
2. Проверьте статус сервисов (должны быть "Running")
3. Если сервис еще деплоится, подождите завершения
4. Проверьте логи, если есть ошибки


