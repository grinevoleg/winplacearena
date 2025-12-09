# Решение проблем (Troubleshooting)

## Ошибка 404

### Проблема: API возвращает 404

**Возможные причины и решения:**

1. **Бэкенд не запущен (локально)**
   ```bash
   cd backend
   python main.py
   ```
   Проверьте, что бэкенд доступен: http://localhost:8000/health

2. **Неправильный URL API**
   - Проверьте переменную окружения `NEXT_PUBLIC_API_URL`
   - Локально должно быть: `http://localhost:8000`
   - На DigitalOcean: URL вашего backend сервиса

3. **Проблема с маршрутами на DigitalOcean**
   - Убедитесь, что в `.do/app.yaml` правильно указан `http_port: 8000`
   - Проверьте health check endpoint: `/health`

4. **CORS ошибки**
   - Убедитесь, что `FRONTEND_URL` правильно установлен в backend
   - Проверьте логи бэкенда на наличие CORS ошибок

### Проверка работы API

**Локально:**
```bash
# Проверка health endpoint
curl http://localhost:8000/health

# Проверка API документации
open http://localhost:8000/docs
```

**На DigitalOcean:**
1. Зайдите в логи Backend сервиса
2. Проверьте, что приложение запустилось без ошибок
3. Проверьте URL backend сервиса в настройках

## Ошибка подключения к базе данных

### Проблема: DATABASE_URL не найден

**Решение:**
1. На DigitalOcean: убедитесь, что база данных создана
2. Проверьте, что `DATABASE_URL` добавлен в переменные окружения Backend
3. Формат должен быть: `postgresql://user:password@host:port/dbname`

## Проблемы с деплоем

### Билд падает

1. **Проверьте логи билда** в DigitalOcean
2. **Убедитесь, что все зависимости указаны:**
   - `package.json` для фронтенда
   - `requirements.txt` для бэкенда

3. **Проверьте Dockerfile:**
   - Пути к файлам правильные
   - Порты указаны корректно

### Приложение не запускается

1. Проверьте логи runtime в DigitalOcean
2. Убедитесь, что все переменные окружения установлены
3. Проверьте health check endpoint

## Частые ошибки

### "Cannot connect to server"
- Бэкенд не запущен
- Неправильный `NEXT_PUBLIC_API_URL`
- Firewall блокирует соединение

### "User not found"
- Пользователь не создан в базе данных
- Проверьте, что `user1` существует или создайте его через API

### "Challenge not found"
- Челлендж не назначен пользователю
- Используйте `/api/challenges/{id}/assign` для назначения

## Отладка

### Включить подробные логи

**Backend:**
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

**Frontend:**
Проверьте консоль браузера (F12) для ошибок API запросов

### Проверка переменных окружения

На DigitalOcean:
1. Зайдите в настройки сервиса
2. Проверьте раздел "Environment Variables"
3. Убедитесь, что все переменные установлены

