# **Delivery Orders**

Веб-приложение для управления заказами доставки.

Проект представляет собой full-stack приложение, состоящее из:

- **Backend** — ASP.NET Core Web API
- **Frontend** — React + TypeScript
- **Database** — PostgreSQL в Docker-контейнере

Приложение позволяет пользователям регистрироваться, выполнять JWT-аутентификацию, создавать и просматривать заказы доставки, а также использовать функциональность в зависимости от роли пользователя.

---

# **Используемые технологии**

## **Backend**

Используются:
- ASP.NET Core Web API (.NET 9)
- Entity Framework Core
- PostgreSQL
- Docker Compose
- JWT Bearer Authentication
- Role Based Authorization
- Swagger / OpenAPI
- Global Exception Handling Middleware

---

## **Frontend**

Используются:
- React
- TypeScript
- Vite
- Fetch API
- CSS Variables
- Flexbox / Grid
- History API Router
- JWT Authentication

---

# **Требования**

Перед запуском необходимо установить:

- .NET SDK 9
- Node.js 24+
- npm 24+
- Docker Desktop

Проверка установленных версий:

```bash
dotnet --version
node -v
npm -v
docker --version
```

---

# **Запуск проекта**

## **1. Запуск базы данных**

Перейдите в папку backend:

```bash
cd backend
```

Запустите PostgreSQL:

```bash
docker compose up -d
```

Проверка контейнера:

```bash
docker ps
```

Остановка:

```bash
docker compose down
```

Данные базы сохраняются благодаря Docker Volume.

---

# **2. Запуск Backend**

Установите зависимости:

```bash
dotnet restore
```

Примените миграции:

```bash
dotnet ef database update
```

Запустите API:

```bash
dotnet run
```

После запуска:

API:

```
http://localhost:5056
```

Swagger:

```
http://localhost:5056/swagger
```

---

# **3. Запуск Frontend**

Откройте новый терминал.

Перейдите в frontend:

```bash
cd frontend
```

Установите зависимости:

```bash
npm install
```

Запустите приложение:

```bash
npm run dev
```

Frontend будет доступен:

```
http://localhost:5173
```

---

# **База данных**

Используется PostgreSQL.

Конфигурация подключения:

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
backend/docker-compose.yml
```

---

# **Entity Framework Core**

Основные команды:

Создание миграции:

```bash
dotnet ef migrations add MigrationName
```

Применение миграций:

```bash
dotnet ef database update
```

---

# **Подключение к PostgreSQL**

Подключение внутри контейнера:

```bash
docker exec -it deliveryorders-postgres psql -U admin -d deliveryorders
```

Список таблиц:

```sql
\dt
```

Выход:

```sql
\q
```

---

# **Аутентификация**

В приложении используется JWT Authentication.

## **Регистрация**

Endpoint:

```
POST /api/auth/register
```

Пример запроса:

```json
{
  "name": "Александр Иванов",
  "email": "user@example.com",
  "password": "Password123!"
}
```

---

## **Авторизация**

Endpoint:

```
POST /api/auth/login
```

Пример запроса:

```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

Ответ:

```json
{
  "token": "jwt_token"
}
```

После получения токена необходимо передавать его в защищённых запросах:

```http
Authorization: Bearer TOKEN
```

---

# **Пользовательские роли**

В приложении реализована ролевая модель:

- User
- Admin

---

## **User**

Пользователь может:
- зарегистрироваться;
- авторизоваться;
- создавать заказы;
- просматривать список заказов;
- открывать детали заказа.

---

## **Admin**

Администратор дополнительно может:
- просматривать пользователей;
- создавать пользователей;
- управлять пользователями;
- удалять заказы;
- использовать административный раздел.

---

# **API**

## **Authentication**

|**Метод**|**Endpoint**|**Описание**|
|---|---|---|
|POST|`/api/auth/register`|Регистрация пользователя|
|POST|`/api/auth/login`|Авторизация|

---

# **Orders**

|**Метод**|**Endpoint**|**Доступ**|
|---|---|---|
|GET|`/api/orders`|User, Admin|
|GET|`/api/orders/{orderNumber}`|User, Admin|
|POST|`/api/orders`|User, Admin|
|DELETE|`/api/orders/{orderNumber}`|Admin|

---

# **Получение списка заказов**

Endpoint:

```
GET /api/orders
```

Поддерживаются:

- пагинация;
- сортировка;
- получение email владельца заказа.

Пример:

```
GET /api/orders?page=1&pageSize=10&sortBy=CreatedAt&direction=Desc
```

---

## **Параметры сортировки**

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

---

# **Пагинация**

Пример ответа:

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

---

# **Создание заказа**

Endpoint:

```
POST /api/orders
```

После создания номер заказа генерируется автоматически.

Формат:

```
DLV-{Дата}-{Номер}
```

Пример:

```
DLV-20260715-000001
```

Особенности:

- уникальный номер заказа;
- ежедневная нумерация;
- хранение счётчика в таблице OrderCounters.

---

# **Получение заказа**

Endpoint:

```
GET /api/orders/{orderNumber}
```

Пример:

```
GET /api/orders/DLV-20260715-000001
```

---

# **Удаление заказа**

Endpoint:

```
DELETE /api/orders/{orderNumber}
```

Доступ:

- Admin.

Ответ:

```json
{
  "message": "Order deleted successfully",
  "orderNumber": "DLV-20260715-000001"
}
```

---

# **Admin API**

|**Метод**|**Endpoint**|**Описание**|
|---|---|---|
|GET|`/api/admin/users`|Получение пользователей|
|POST|`/api/admin/users`|Создание пользователя|
|DELETE|`/api/admin/users/{id}`|Удаление пользователя|

---

# **Валидация**

Реализована клиентская и серверная валидация.

Проверяются:

- обязательные поля;
- формат email;
- пароль;
- длина строк;
- диапазоны числовых значений;
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

Ошибки API отображаются пользователю в интерфейсе.

---

# **Обработка исключений**

Добавлен глобальный middleware:

```
ExceptionHandlingMiddleware
```

Все необработанные ошибки возвращаются в едином формате:

```json
{
  "title": "Internal server error",
  "status": 500,
  "detail": "An unexpected error occurred."
}
```

---

# **Frontend маршруты**

Используется собственный роутер на основе History API.

Доступные маршруты:

```
/orders
```

Список заказов.

```
/orders/new
```

Создание заказа.

```
/orders/{orderNumber}
```

Детальная информация заказа.

```
/admin
```

Административный раздел.

```
/admin/new
```

Создание пользователя администратором.

---

# **Команды разработки**

## **Backend**

Запуск:

```bash
dotnet run
```

Миграции:

```bash
dotnet ef migrations add MigrationName

dotnet ef database update
```

---

## **Frontend**

Запуск:

```bash
npm run dev
```

Production сборка:

```bash
npm run build
```

Предпросмотр:

```bash
npm run preview
```

---

# **Production**

Создание production версии frontend:

```bash
npm run build
```

Результат сборки:

---

# **Итог**

**Delivery Orders** — полнофункциональное веб-приложение для управления заказами доставки.

Реализовано:
- JWT Authentication;
- регистрация и авторизация пользователей;
- роли User/Admin;
- создание заказов;
- просмотр заказов;
- поиск заказа по номеру;
- сортировка и пагинация;
- административный раздел;
- управление пользователями;
- клиентская и серверная валидация;
- обработка ошибок API;
- интеграция React + ASP.NET Core Web API + PostgreSQL.
