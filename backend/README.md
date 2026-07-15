# Delivery Orders API

Backend-приложение для управления заказами доставки.

Проект реализован на:

- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- Docker Compose
- JWT Authentication
- Role Based Authorization

---

# 🐘 База данных

Проект использует:

- PostgreSQL
- Docker Compose для запуска базы данных
- Entity Framework Core для работы с миграциями

Конфигурация базы данных:

```
backend/docker-compose.yml
```

---

# 🐳 Запуск PostgreSQL

Перейдите в папку backend:

```bash
cd DeliveryOrders/backend
```

Запуск контейнера:

```bash
docker compose up -d
```

Проверка запущенных контейнеров:

```bash
docker ps
```

Остановка:

```bash
docker compose down
```

> При использовании Docker Volume данные PostgreSQL сохраняются после остановки контейнера.

---

# ⚙️ Настройка базы данных

Строка подключения находится:

```
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

Параметры должны совпадать с:

```
docker-compose.yml
```

---

# 🗄 Миграции Entity Framework Core

После первого запуска базы необходимо применить миграции:

```bash
dotnet ef database update
```

EF Core автоматически:

- создаст необходимые таблицы;
- применит миграции;
- настроит связи между таблицами.

Создание новой миграции:

```bash
dotnet ef migrations add MigrationName
```

Применение миграций:

```bash
dotnet ef database update
```

---

# 💻 Работа с PostgreSQL CLI

Подключение к базе:

```bash
docker exec -it deliveryorders-postgres psql -U admin -d deliveryorders
```

Полезные команды:

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

# 🚀 Запуск проекта

После клонирования проекта:

```bash
cd DeliveryOrders/backend

docker compose up -d

dotnet restore

dotnet ef database update

dotnet run
```

После запуска:

API доступен:

```
http://localhost:5056
```

Swagger:

```
http://localhost:5056/swagger
```

---

# 🔐 Аутентификация

Используется JWT Bearer Authentication.

Получение токена:

```
POST /api/auth/login
```

Пример ответа:

```json
{
  "token": "eyJhbGciOiJIUzI1Ni..."
}
```

Для защищённых запросов необходимо передавать:

```
Authorization: Bearer TOKEN
```

В Swagger:

1. Нажать кнопку **Authorize**
2. Ввести:

```
Bearer YOUR_TOKEN
```

---

# 👥 Роли пользователей

Поддерживаются роли:

- User
- Admin


Ограничение доступа:

```csharp
[Authorize(Roles = "Admin")]
```

или:

```csharp
[Authorize(Roles = "User,Admin")]
```

---

# 📦 API

## Authentication

| Метод | Endpoint             | Описание                 |
| ----- | -------------------- | ------------------------ |
| POST  | `/api/auth/register` | Регистрация пользователя |
| POST  | `/api/auth/login`    | Авторизация              |

---

# 🔐 Регистрация и авторизация пользователей

## 📝 Регистрация пользователя

Endpoint: `POST /api/auth/register`
Используется для создания нового пользователя в системе.

При регистрации необходимо передать:
- имя пользователя;
- email;
- пароль;

Пример запроса:

```json
{
  "name": "Александр Иванов",
  "email": "user@example.com",
  "password": "Password123!"
}
```

---

## **🔑 Авторизация пользователя**

Endpoint: `POST /api/auth/login`

Используется для входа пользователя в систему.

В запрос передаются:
- email;
- пароль.

Пример:
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

При успешной проверке данных API возвращает JWT токен:

```JSON
{
  "token": "eyJhbGciOiJIUzI1Ni..."
}
```

---
# 📦 Orders

| Метод | Endpoint | Доступ | Описание |
|-|-|-|-|
| GET | `/api/orders` | User, Admin | Получение списка заказов |
| GET | `/api/orders/{orderNumber}` | User, Admin | Получение заказа по номеру |
| POST | `/api/orders` | User, Admin | Создание заказа |
| DELETE | `/api/orders/{orderNumber}` | User, Admin | Удаление заказа |

---

# 📋 Получение заказов

Endpoint:

```
GET /api/orders
```

Поддерживается:

- пагинация;
- сортировка;
- получение email владельца заказа.

Пример:

```
GET /api/orders?page=1&pageSize=10&sortBy=CreatedAt&direction=Desc
```

---

## Параметры запроса

| Параметр | Описание |
|-|-|
| page | Номер страницы |
| pageSize | Количество элементов |
| sortBy | Поле сортировки |
| direction | Направление сортировки |

---

# 🔄 Сортировка заказов

Доступные поля:

```
CreatedAt
OrderNumber
SenderCity
SenderAddress
ReceiverCity
ReceiverAddress
CargoWeight
CargoPickupDate
```

Направления:

```
Asc
Desc
```

Пример:

```
GET /api/orders?sortBy=CargoWeight&direction=Asc
```

---

# 📄 Пагинация

Ответ содержит:

```json
{
  "items": [],
  "page": 1,
  "pageSize": 10,
  "totalItems": 100,
  "totalPages": 10,
  "hasNextPage": true
}
```

Описание:

| Поле | Значение |
|-|-|
| items | Список заказов |
| page | Текущая страница |
| pageSize | Размер страницы |
| totalItems | Количество записей |
| totalPages | Количество страниц |
| hasNextPage | Есть ли следующая страница |

---

# 🔎 Получение заказа по номеру

Endpoint:

```
GET /api/orders/{orderNumber}
```

Пример:

```
GET /api/orders/DLV-20260715-000001
```

---

# 🗑 Удаление заказа

Endpoint:

```
DELETE /api/orders/{orderNumber}
```

Пример:

```
DELETE /api/orders/DLV-20260715-000001
```

Правила:

- User не может ничего удалить.
- Admin может удалить любой заказ.

Успешный ответ:

```json
{
  "message": "Order deleted successfully",
  "orderNumber": "DLV-20260715-000001"
}
```

Если заказ отсутствует:

```json
{
  "title": "Order not found",
  "status": 404,
  "detail": "Order does not exist."
}
```

---

# 👤 Связь Users и Orders

Связь:

```
User 1 ---- * Order
```

В таблице Orders хранится:

```csharp
UserId
```

Связь реализована через Entity Framework:

```csharp
modelBuilder.Entity<Order>()
    .HasOne(x => x.User)
    .WithMany(x => x.Orders)
    .HasForeignKey(x => x.UserId);
```

Получение пользователя вместе с заказом:

```csharp
.Include(x => x.User)
```

После этого можно получить:

```csharp
order.User.Email
```

---

# 🔢 Генерация номера заказа

Номер заказа создаётся автоматически.

Формат:

```
DLV-{Дата}-{Номер}
```

Пример:

```
DLV-20260715-000001
```

Логика:

- уникальный номер;
- ежедневная нумерация;
- хранение счётчика в таблице OrderCounters.

Пример:

```
2026-07-15

000001
000002
000003
```

---

# ✅ Валидация

Все DTO проходят собственную валидацию.

Проверяются:

- обязательные поля;
- длина строк;
- Email;
- пароль;
- роль пользователя;
- вес груза;
- дата забора груза.

Пример ошибки:

```json
{
  "errors": {
    "CargoWeight": [
      "The Cargo's weight must be between 0.01 and 100000 kg"
    ]
  },
  "status":400
}
```

---

# 🛡 Обработка исключений

Добавлен глобальный middleware:

```
ExceptionHandlingMiddleware
```

Все необработанные ошибки возвращаются в едином формате:

```json
{
  "title": "Internal server error",
  "status":500,
  "detail":"An unexpected error occurred."
}
```

---

# Swagger

Документация API:

```
http://localhost:5056/swagger
```

Swagger позволяет:

- просматривать endpoints;
- выполнять запросы;
- получать JWT;
- тестировать роли;
- проверять ответы API.
