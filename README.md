# **Delivery Orders**

Веб-приложение для создания и просмотра заказов на доставку.

Проект состоит из:

- **Backend** — ASP.NET Core Web API
- **Frontend** — React + TypeScript
- **Database** — PostgreSQL в Docker-контейнере

---

# **Технологии**

## **Backend**

- ASP.NET Core Web API
- Entity Framework Core
- PostgreSQL
- Docker Compose
- Swagger && OpenAPI

## **Frontend**

- React 19
- TypeScript
- Vite
- Fetch API
- Modern CSS (CSS Variables, Flexbox, Grid)

---

# **Требования**

Перед запуском необходимо установить:

- .NET SDK 9
- Node.js 24+
- npm 24+
- Docker Desktop

Проверка версий:

```bash
dotnet --version
node -v
npm -v
docker --version
```

---

# **Запуск проекта**

## **1. Запуск PostgreSQL**

Перейдите в папку backend:

```bash
cd backend
```

Запустите контейнер базы данных:

```bash
docker compose up -d
```

Проверить состояние контейнера:

```bash
docker ps
```

Остановить контейнер:

```bash
docker compose down
```

---

# **2. Настройка Backend**

Перейдите в папку backend:

```bash
cd backend
```

Установите зависимости:

```bash
dotnet restore
```

Примените миграции базы данных:

```bash
dotnet ef database update
```

Запустите API:

```bash
dotnet run
```

После запуска Backend будет доступен:

```
http://localhost:5056
```

Swagger UI:

```
http://localhost:5056/swagger
```

---

# **3. Запуск Frontend**

Откройте новый терминал.

Перейдите в папку frontend:

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

# **Основной функционал**

Приложение позволяет:

- создавать новые заказы доставки;
- автоматически получать номер заказа от сервера;
- просматривать список созданных заказов;
- открывать детальную информацию о заказе;
- выполнять клиентскую и серверную валидацию данных;
- отображать ошибки заполнения формы.

---

# **API**

Основные REST endpoints:

|**Метод**|**Endpoint**|**Назначение**|
|---|---|---|
|GET|`/api/orders`|Получение списка заказов|
|POST|`/api/orders`|Создание нового заказа|

---

# **Команды разработки**

## **Backend**

Запуск:

```bash
dotnet run
```

Создание миграции:

```bash
dotnet ef migrations add MigrationName
```

Применение миграций:

```bash
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

Предпросмотр production:

```bash
npm run preview
```

Проверка качества кода:

```bash
npm run lint
```

---

# **Подключение к PostgreSQL**

Настройки подключения находятся в:

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

Параметры должны совпадать с настройками:

```
backend/docker-compose.yml
```

---

# **Проверка базы данных**

Подключение к PostgreSQL внутри контейнера:

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

# **Полный порядок первого запуска**

После клонирования проекта:

```bash
cd DeliveryOrders/backend

docker compose up -d

dotnet restore

dotnet ef database update

dotnet run
```

В новом терминале:

```bash
cd DeliveryOrders/frontend

npm install

npm run dev
```

После выполнения этих шагов приложение готово к работе.
