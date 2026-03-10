# ☑ CheckFlow — Система автоматизованого управління чеклістами

> Повнофункціональний веб-додаток для автоматизованого створення, призначення та відстеження чеклістів у стандартних бізнес-процесах компанії.

---

## 📸 Функціональність

| Функція | Опис |
|---|---|
| 🔐 Авторизація | JWT + bcrypt, 4 ролі: гість / співробітник / менеджер / адмін |
| 📋 Чеклісти | Створення з шаблонів, виконання пунктів, коментарі, прогрес |
| 🗂 Шаблони | Онбординг, реліз, QA, безпека, щоденні рутини |
| 👥 Користувачі | CRUD, зміна ролей, активація/блокування |
| 🏷 Категорії та теги | Кастомні з кольорами та іконками |
| 📊 Дашборд | Статистика, останні чеклісти, швидкі дії |
| 📝 Логування | Всі дії записуються в ActionLog |
| 📱 Адаптивний | Responsive layout для всіх пристроїв |

---

## 🏗 Архітектура

```
┌─────────────────────┐    ┌──────────────────────┐    ┌──────────────────┐
│  Клієнтська частина │    │  Серверна частина     │    │  База даних      │
│  React + Vite       │◄──►│  Node.js + Express    │◄──►│  MongoDB         │
│  React Router       │    │  JWT Auth             │    │  Mongoose ODM    │
│  Axios              │    │  REST API             │    │                  │
└─────────────────────┘    └──────────────────────┘    └──────────────────┘
```

### Сутності бази даних
- **User** — користувачі з ролями та профілями
- **Category** — категорії процесів (HR, Dev, QA, Security, Routine)
- **Tag** — теги для фільтрації
- **ChecklistTemplate** — шаблони з пунктами
- **ChecklistInstance** — екземпляри чеклістів з прогресом
- **ActionLog** — лог усіх дій

---

## 🚀 Запуск

### Варіант 1: Docker (рекомендовано)

```bash
docker-compose up -d
```

Після запуску:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

### Варіант 2: Локально

**Передумови:**
- Node.js 18+
- MongoDB (локально або Atlas)

**Backend:**
```bash
cd backend
cp .env.example .env          # налаштуйте змінні
npm install
npm run seed                  # завантажити демо-дані
npm run dev                   # запуск на :5000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev                   # запуск на :5173
```

---

## 🔑 Демо акаунти

| Роль | Email | Пароль |
|---|---|---|
| Адмін | admin@company.com | Admin123! |
| Менеджер | manager@company.com | Manager123! |
| Співробітник | ivan@company.com | Employee123! |
| Співробітник | olena@company.com | Employee123! |

---

## 📡 API Endpoints

### Auth
```
POST /api/auth/register    — реєстрація
POST /api/auth/login       — вхід → JWT
GET  /api/auth/me          — поточний користувач
```

### Checklists
```
GET    /api/checklists              — список (фільтри: status, mine)
GET    /api/checklists/stats        — статистика
GET    /api/checklists/:id          — деталі
POST   /api/checklists              — створити (з шаблону або вручну)
PATCH  /api/checklists/:id          — оновити
PATCH  /api/checklists/:id/items/:itemId — відмітити пункт
POST   /api/checklists/:id/comments — додати коментар
DELETE /api/checklists/:id          — видалити
```

### Templates
```
GET    /api/templates              — список
GET    /api/templates/:id          — деталі
POST   /api/templates              — створити (manager/admin)
PATCH  /api/templates/:id          — оновити (manager/admin)
DELETE /api/templates/:id          — видалити (admin)
```

### Users (admin/manager)
```
GET    /api/users                  — всі користувачі
PATCH  /api/users/:id/role         — змінити роль
PATCH  /api/users/:id/status       — активувати/блокувати
PATCH  /api/users/profile          — оновити свій профіль
```

### Categories & Tags
```
GET/POST/PATCH/DELETE /api/categories
GET/POST/DELETE       /api/tags
```

### Logs (admin)
```
GET /api/logs   — всі дії системи
```

---

## 🎨 Технічний стек

**Backend:**
- Node.js (ESM), Express 4
- MongoDB + Mongoose 8
- JWT (jsonwebtoken), bcryptjs
- Morgan (logging), CORS

**Frontend:**
- React 18, Vite 5
- React Router DOM 6
- Axios
- CSS Variables (дизайн-система без бібліотек)
- Google Fonts: Inter + Space Grotesk

---

## 📁 Структура проекту

```
checklist-app/
├── backend/
│   ├── models/           # Mongoose моделі
│   │   ├── User.js
│   │   ├── Category.js
│   │   ├── Tag.js
│   │   ├── ChecklistTemplate.js
│   │   ├── ChecklistInstance.js
│   │   └── ActionLog.js
│   ├── routes/           # Express роутери
│   ├── middleware/       # auth.js, logger.js
│   ├── utils/seed.js     # Демо-дані
│   ├── server.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/       # Spinner, Badge, Button, Input, Card, Modal...
│   │   │   └── layout/   # Layout з сайдбаром
│   │   ├── pages/        # Dashboard, Checklists, Templates, Admin, Profile
│   │   ├── context/      # AuthContext
│   │   ├── utils/api.js  # Axios інстанс + API методи
│   │   └── styles/       # Global CSS
│   └── vite.config.js
└── docker-compose.yml
```

---

## 🔐 Система ролей

| Дія | Гість | Співробітник | Менеджер | Адмін |
|---|:---:|:---:|:---:|:---:|
| Авторизація | ✓ | ✓ | ✓ | ✓ |
| Виконання чеклісту | | ✓ | ✓ | ✓ |
| Перегляд чеклістів | | ✓ | ✓ | ✓ |
| Перегляд шаблонів | | ✓ | ✓ | ✓ |
| Створення шаблонів | | | ✓ | ✓ |
| Призначення чеклістів | | | ✓ | ✓ |
| Управління користувачами | | | | ✓ |
| Налаштування системи | | | | ✓ |
| Перегляд логів | | | | ✓ |

---

## 📦 Типи чеклістів (вбудовані шаблони)

1. **👥 Онбординг нового співробітника** — 8 пунктів, ~8год
2. **🚀 Підготовка до релізу** — 8 пунктів, ~4год, критичний
3. **✅ Перевірка якості (QA)** — 5 пунктів, ~3год
4. **🔒 Аудит безпеки** — 7 пунктів, ~5год, критичний
5. **🔄 Щоденна рутина розробника** — 5 пунктів, ~1год
