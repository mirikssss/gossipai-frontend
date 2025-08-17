# GossipAI Backend

Backend API для приложения анализа эмоций и коммуникации GossipAI.

## Технологии

- **FastAPI** - веб-фреймворк для Python
- **Supabase** - база данных PostgreSQL и аутентификация
- **Google Vertex AI** - ИИ-модели (Gemini 2.5 Pro)
- **Google Cloud Vision API** - OCR для изображений
- **Google Speech-to-Text** - транскрипция аудио

## Установка

1. Создайте виртуальное окружение:
```bash
python -m venv venv_clean
venv_clean\Scripts\activate  # Windows
```

2. Установите зависимости:
```bash
pip install -r requirements.txt
```

3. Создайте файл `.env` в папке `backend`:
```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
BACKEND_CORS_ORIGINS=["http://localhost:3000"]
GOOGLE_APPLICATION_CREDENTIALS=path/to/your/service-account-key.json
VERTEX_AI_PROJECT=your_project_id
VERTEX_AI_LOCATION=us-central1
```

4. Запустите сервер:
```bash
uvicorn app.main:app --reload
```

## API Endpoints

### Аутентификация

- `POST /api/v1/auth/register` - Регистрация пользователя
- `POST /api/v1/auth/login` - Вход в систему
- `GET /api/v1/auth/user` - Получение данных текущего пользователя

### Анализ

- `POST /api/v1/analysis/text` - Анализ текста
- `POST /api/v1/analysis/upload` - Анализ загруженного файла (текст, изображение, аудио)
- `POST /api/v1/analysis/chat` - Чат с ИИ о результатах анализа
- `POST /api/v1/analysis/suggested-responses` - Получение подходящих ответов

## Функциональность

### 1. Анализ эмоций
- Анализ текстовых разговоров
- Извлечение текста из изображений (OCR)
- Транскрипция аудио файлов
- Детекция эмоций и тона
- Анализ скрытых смыслов

### 2. ИИ-чатбот
- Контекстные ответы на основе анализа
- Память последних 10 сообщений
- Ответы на русском языке
- Интеграция с Gemini 2.5 Pro

### 3. Подходящие ответы
- Автоматическая генерация 3 подходящих ответов
- Основаны на анализе эмоций и тона
- Объяснение причин выбора каждого ответа
- Персонализация на основе контекста

## Структура проекта

```
backend/
├── app/
│   ├── api/
│   │   └── api_v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py
│   │       │   └── analysis.py
│   │       └── api.py
│   ├── core/
│   │   └── config.py
│   ├── db/
│   │   └── supabase.py
│   ├── models/
│   │   └── user.py
│   ├── services/
│   │   ├── ai_service.py
│   │   ├── auth.py
│   │   ├── ocr_service.py
│   │   ├── speech_service.py
│   │   └── storage_service.py
│   └── main.py
├── requirements.txt
└── .env
```

## Настройка Google Cloud

1. Создайте проект в Google Cloud Console
2. Включите Vertex AI API
3. Создайте сервисный аккаунт с ролями:
   - Vertex AI User
   - Vertex AI Administrator
4. Скачайте JSON ключ и укажите путь в `.env`

## Разработка

Для разработки используйте:
```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API документация доступна по адресу: `http://localhost:8000/docs`
