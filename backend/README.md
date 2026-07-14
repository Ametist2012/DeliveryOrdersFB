# 🐘 Database

Проект использует:

- **PostgreSQL**
- **Docker Compose** для запуска базы данных
- **Entity Framework Core** для миграций и работы с БД

Конфигурация базы данных находится в:

```text
backend/docker-compose.yml
```

После запуска Docker автоматически создается контейнер PostgreSQL.

---

# 🐳 Running PostgreSQL

Перейдите в папку backend:

```bash
cd DeliveryOrders/backend
```

Запустите контейнер:

```bash
docker compose up -d
```

Проверьте, что контейнер запущен:

```bash
docker ps
```

Остановить контейнер:

```bash
docker compose down
```

> **Примечание**
>
> Если используется Docker Volume, данные базы данных сохраняются даже после выполнения `docker compose down`.

---

# ⚙️ Database Configuration

Строка подключения находится в:

```text
backend/appsettings.json
```

Пример:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5410;Database=deliveryorders;Username=admin;Password=admin"
  }
}
```

Параметры должны соответствовать настройкам в:

```text
backend/docker-compose.yml
```

---

# 🗄️ Database Migrations

После первого запуска PostgreSQL необходимо применить миграции:

```bash
dotnet ef database update
```

Entity Framework автоматически:

- создаст базу данных (если она отсутствует);
- применит все существующие миграции;
- создаст необходимые таблицы.

Создание новой миграции:

```bash
dotnet ef migrations add MigrationName
```

Применение миграций:

```bash
dotnet ef database update
```

---

# 💻 PostgreSQL CLI

Подключиться к базе данных внутри контейнера:

```bash
docker exec -it deliveryorders-postgres psql -U admin -d deliveryorders
```

Полезные команды PostgreSQL:

Список таблиц:

```sql
\dt
```

Описание таблицы:

```sql
\d "Orders"
```

Выход:

```sql
\q
```

---

# 🚀 Running the Project

После клонирования репозитория выполните:

```bash
cd DeliveryOrders/backend

docker compose up -d

dotnet restore

dotnet ef database update

dotnet run
```

После запуска:

- PostgreSQL будет доступен;
- все миграции будут применены;
- API будет готово к работе.

---

# 🔐 Authentication

Проект использует **JWT Bearer Authentication**.

Для получения токена:

```
POST /api/auth/login
```

Ответ:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

Для обращения к защищённым endpoint необходимо передавать заголовок:

```text
Authorization: Bearer YOUR_JWT_TOKEN
```

---

# 👥 Roles

Поддерживаются две роли пользователей:

- `User`
- `Admin`

Ограничение доступа реализовано через атрибуты:

```csharp
[Authorize(Roles = "Admin")]
```

или

```csharp
[Authorize(Roles = "User,Admin")]
```

---

# 📦 API

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Регистрация пользователя |
| POST | `/api/auth/login` | Авторизация |

---

## Orders

| Method | Endpoint | Access |
|---------|----------|--------|
| GET | `/api/orders` | User, Admin |
| POST | `/api/orders` | User, Admin |

Доступ требует авторизации.
---

## Admin

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/admin/users` | Получить список пользователей |
| POST | `/api/admin/users` | Создать пользователя |
| DELETE | `/api/admin/users/{id}` | Удалить пользователя |

Доступ только для роли **Admin**.

---

# ✅ Validation

Для всех DTO используется собственная система валидации.

Проверяются:

- обязательные поля;
- длина строк;
- Email;
- пароль;
- роли пользователей;
- данные заказа.

При ошибках API возвращает стандартный `ValidationProblemDetails`:

```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
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

# 🛡 Exception Handling

Добавлен глобальный middleware:

```
ExceptionHandlingMiddleware
```

Все необработанные исключения возвращаются в едином формате:

```json
{
  "title": "Internal server error",
  "status": 500,
  "detail": "An unexpected error occurred."
}
```

---

# 🌐 Swagger UI

После запуска приложения документация доступна по адресу:

```text
http://localhost:5056/swagger
```

или

```text
http://localhost:5056/swagger/index.html
```

В Swagger можно:

- просматривать все endpoints;
- выполнять запросы;
- получать JWT;
- авторизоваться через кнопку **Authorize**;
- тестировать защищённые методы.

Для авторизации необходимо ввести:

```text
Bearer YOUR_JWT_TOKEN
```

---
