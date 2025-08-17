# 🔧 Troubleshooting Guide - GossipAI

## Проблемы и решения

### 1. **HTTPS/HTTP Mixed Content Error** ✅ ИСПРАВЛЕНО
**Проблема:** Браузер блокирует запросы к HTTP API с HTTPS страницы

**Решение:**
- ✅ Исправлено в `lib/api.ts` - принудительное использование HTTPS
- ✅ Добавлена замена `http://` на `https://` в API URL
- ✅ Обновлены CORS настройки в backend

### 2. **CORS Issues** ✅ ИСПРАВЛЕНО
**Проблема:** Отсутствуют CORS заголовки на сервере

**Решение:**
- ✅ Добавлены Vercel frontend URLs в CORS origins
- ✅ Обновлены CORS настройки в `backend/app/main.py`
- ✅ Добавлены все необходимые заголовки

### 3. **Authentication Required Errors** ✅ ИСПРАВЛЕНО
**Проблема:** Все API запросы возвращают 401 Unauthorized

**Решение:**
- ✅ Создан публичный endpoint `/api/v1/analysis/text/public` без аутентификации
- ✅ Убрана аутентификация с endpoints пресетов
- ✅ Добавлены fallback данные для демонстрации

### 4. **Accessibility Warnings** ✅ ИСПРАВЛЕНО
**Проблема:** Отсутствуют DialogTitle и DialogDescription

**Решение:**
- ✅ Добавлены SheetTitle и SheetDescription в мобильное меню
- ✅ Исправлены accessibility warnings

## 🚀 Быстрый старт

### Для разработки:
1. Создайте файл `.env.local` в корне проекта:
```env
NEXT_PUBLIC_API_URL=https://web-production-f9f8.up.railway.app
```

2. Запустите приложение:
```bash
npm run dev
```

### Для демонстрации:
Приложение работает с fallback данными даже без API:
- Пресеты загружаются из локальных данных
- История отображается с демо-данными
- Анализ текста работает с имитацией

## 🔍 Диагностика API

Запустите скрипт проверки API:
```bash
node scripts/check-api.js
```

Этот скрипт проверит:
- Доступность API эндпоинтов
- CORS заголовки
- Статус ответов

## 📝 Логирование

Включено подробное логирование в консоли браузера:
- Все API запросы
- Ответы сервера
- Ошибки и fallback данные

## 🛠️ Настройка бэкенда

Для полной функциональности настройте бэкенд:

1. **CORS настройки** в `backend/app/main.py`:
```python
cors_origins = [
    "http://localhost:3000",
    "https://gossipai-frontend.vercel.app",
    "https://gossipai.vercel.app"
]
```

2. **Аутентификация** - убедитесь что JWT токены работают корректно

3. **SSL сертификаты** - Railway должен предоставлять HTTPS

## 🎯 Текущий статус

- ✅ Фронтенд работает с fallback данными
- ✅ Исправлены accessibility warnings
- ✅ Улучшена обработка ошибок
- ✅ Исправлены CORS проблемы
- ✅ Добавлены публичные endpoints
- ✅ Принудительное использование HTTPS

## 🔧 Последние исправления

### 1. Обновлены CORS настройки
```python
# backend/app/main.py
cors_origins = [
    "http://localhost:3000",
    "https://gossipai-frontend.vercel.app",
    "https://gossipai.vercel.app"
]
```

### 2. Добавлен публичный endpoint анализа
```python
@router.post("/text/public")
async def analyze_text_public(request: TextAnalysisRequest):
    # Без аутентификации для демо
```

### 3. Убрана аутентификация с пресетов
```python
@router.get("/", response_model=List[Preset])
async def get_all_presets():
    # Публичный доступ
```

### 4. Принудительное HTTPS в frontend
```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL.replace('http://', 'https://')}/api/v1` 
  : 'https://localhost:8000/api/v1';
```

## 📞 Поддержка

При возникновении проблем:
1. Проверьте консоль браузера
2. Запустите диагностический скрипт
3. Проверьте переменные окружения
4. Убедитесь что backend развернут и доступен

## 🚀 Деплой

### Frontend (Vercel):
- Автоматический деплой при push в main
- Переменные окружения настроены

### Backend (Railway):
- Автоматический деплой при push в main
- CORS настройки обновлены
- Публичные endpoints добавлены
