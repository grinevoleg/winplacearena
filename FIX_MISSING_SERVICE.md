# Проблема: Отсутствует Backend сервис

## Проблема

На скриншоте виден только один компонент `winplacearena2` (Web Service), но должно быть два:
1. **api** - Backend API (FastAPI)
2. **web** - Frontend Web (Next.js)

## Решение

### Вариант 1: Обновить конфигурацию в DigitalOcean (Рекомендуется)

1. Зайдите в настройки приложения в DigitalOcean
2. Перейдите на вкладку **"Settings"**
3. Найдите раздел **"App Spec"** или **"Edit Configuration"**
4. Скопируйте содержимое файла `.do/app.yaml` из репозитория
5. Вставьте в редактор конфигурации в DigitalOcean
6. Сохраните и перезапустите приложение

### Вариант 2: Добавить сервис вручную

1. В настройках приложения нажмите **"Edit Components"** или **"Add Component"**
2. Добавьте новый сервис:
   - **Name**: `api`
   - **Type**: `Web Service`
   - **Source**: GitHub → `grinevoleg/winplacearena` → `main`
   - **Source Directory**: `backend`
   - **Dockerfile Path**: `backend/Dockerfile`
   - **HTTP Port**: `8000`
   - **Health Check Path**: `/health`
3. Добавьте переменные окружения для `api`:
   - `DATABASE_URL` = `${arena-db.DATABASE_URL}`
   - `FRONTEND_URL` = `${web.PUBLIC_URL}`
   - `OPENAI_API_KEY` (опционально, тип SECRET)
4. Сохраните изменения

### Вариант 3: Пересоздать приложение

Если ничего не помогает:
1. Создайте новое приложение в DigitalOcean
2. При создании выберите **"Edit App Spec"**
3. Вставьте содержимое `.do/app.yaml`
4. DigitalOcean автоматически создаст оба сервиса

## Проверка

После добавления второго сервиса в разделе **"Components"** должно быть:
- ✅ **api** - Backend API Service
- ✅ **web** - Frontend Web Service
- ✅ **arena-db** - PostgreSQL Database

## Важно

Убедитесь, что:
- Оба сервиса используют один и тот же репозиторий `grinevoleg/winplacearena`
- Оба сервиса используют ветку `main`
- Backend использует `source_dir: backend`
- Frontend использует `source_dir: .` (корень)


