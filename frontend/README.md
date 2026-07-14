# Delivery Orders — Frontend

Клиентская часть приложения **Delivery Orders** для управления заказами доставки.

Frontend предоставляет интерфейс для:

- регистрации пользователей;
- авторизации через JWT;
- создания заказов;
- просмотра заказов;
- работы с ролями пользователей;
- взаимодействия с ASP.NET Core Web API.

---

# 🛠 Технологии

## Frontend

- **React**
- **TypeScript**
- **Vite**
- **Fetch API**
- **CSS**

---

# 📋 Требования

Перед запуском убедитесь, что установлены:

- Node.js 24+
- npm 24+

Проверить версии:

```bash
node -v
npm -v
```

---

# 📦 Install

Перейдите в папку frontend:

```bash
cd frontend
```

Установите зависимости:

```bash
npm install
```

---

# ▶️ Запуск

Запуск development-сервера:

```bash
npm run dev
```

После запуска приложение будет доступно:

```text
http://localhost:5173
```

---

# 🔗 Backend

Frontend работает совместно с ASP.NET Core Web API.

Перед запуском frontend необходимо запустить backend:

```bash
cd backend

docker compose up -d

dotnet ef database update

dotnet run
```

Backend API:

```text
http://localhost:5056
```

Swagger:

```text
http://localhost:5056/swagger
```

---

# 🔐 Authentication

В приложении используется JWT Authentication.

После успешного входа:

```
POST /api/auth/login
```

Frontend получает JWT token:

```json
{
  "token": "jwt_token"
}
```

Токен используется для доступа к защищенным endpoint.

Передача токена:

```http
Authorization: Bearer YOUR_TOKEN
```

---

# 👥 User Roles

Frontend отображает функциональность в зависимости от роли пользователя.

---

# ✨ Основные характеристики

## Аунтификация

- регистрация пользователя;
- авторизация;
- сохранение JWT token;
- обработка ошибок входа.

---

## Заказы

- создание нового заказа;
- просмотр списка заказов;
- просмотр информации о заказе;
- отображение ошибок валидации.

---

## Валидация

Frontend поддерживает:

- проверку обязательных полей;
- проверку форматов данных;
- отображение серверных ошибок;
- обработку стандартных API ответов:

```json
{
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "CargoWeight": [
      "The Cargo's weight must be between 0.01 and 100000 kg"
    ]
  }
}
```

---

# 🌐 Backend API

Frontend взаимодействует с REST API.

## Authentication

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Регистрация пользователя |
| POST | `/api/auth/login` | Авторизация |

---

## Orders

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/orders` | User, Admin |
| POST | `/api/orders` | User, Admin |

---

## Admin

| Method | Endpoint | Access |
|---|---|---|
| GET | `/api/admin/users` | Admin |
| POST | `/api/admin/users` | Admin |
| DELETE | `/api/admin/users/{id}` | Admin |

---

# Info

После изменения исходного кода приложение автоматически обновляется благодаря:

```
Vite Hot Module Replacement (HMR)
```

Для production рекомендуется использовать:

```bash
npm run build
```

---
