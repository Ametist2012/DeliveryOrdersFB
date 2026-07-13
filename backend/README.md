# **🐘 База данных PostgreSQL**

В проекте используется:

- **PostgreSQL**
- **Docker Compose** для запуска базы данных в контейнере
- **Entity Framework Core** для работы с базой данных и миграциями

Конфигурация PostgreSQL находится в файле:

```text
backend/docker-compose.yml
```

После запуска Docker автоматически создается контейнер PostgreSQL.

---

# **🐳 Запуск PostgreSQL**

Перейдите в папку backend:

```bash
cd DeliveryOrders/backend
```

Запустите контейнер:

```bash
docker compose up -d
```

Проверьте, что контейнер успешно запущен:

```bash
docker ps
```

Остановить контейнеры:

```bash
docker compose down
```

**Примечание:** если используется Docker Volume, данные базы сохранятся даже после выполнения `docker compose down`.

---

# **⚙️ Настройка подключения**

Строка подключения находится в файле:

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

Параметры строки подключения должны соответствовать настройкам, указанным в:

```text
backend/docker-compose.yml
```

Например:

- Host
- Port
- Database
- Username
- Password

---

# **🗄️ Применение миграций**

После первого запуска PostgreSQL необходимо создать структуру базы данных.

Выполните команду:

```bash
dotnet ef database update
```

Entity Framework Core автоматически:

- создаст базу данных (если она отсутствует);
- применит все существующие миграции;
- создаст необходимые таблицы.

При изменении моделей данных создайте новую миграцию:

```bash
dotnet ef migrations add MigrationName
```

После этого снова примените изменения:

```bash
dotnet ef database update
```

---

# **💻 Подключение к PostgreSQL через терминал**

Подключиться к базе данных внутри контейнера можно командой:

```bash
docker exec -it deliveryorders-postgres psql -U admin -d deliveryorders
```

После подключения становятся доступны стандартные команды PostgreSQL.

Например:

Показать список таблиц:

```sql
\dt
```

Описание таблицы:

```sql
\d Orders
```

Выход из консоли PostgreSQL:

```sql
\q
```

---

# **🚀 Первый запуск проекта**

После клонирования репозитория выполните следующие команды:

```bash
cd DeliveryOrders/backend

docker compose up -d

dotnet restore

dotnet ef database update

dotnet run
```

После этого:

- PostgreSQL будет запущен;
- структура базы данных будет создана;
- API станет доступно для работы.  

---

# **🌐 Swagger UI**

После запуска приложения Swagger UI будет доступен по адресу:

```text
http://localhost:5056/swagger/index.html
```

Или просто:

```text
http://localhost:5056/swagger
```

В Swagger можно:

- просмотреть все доступные API-эндпоинты;
- протестировать запросы прямо из браузера;
- посмотреть модели запросов и ответов;
- проверить коды ответов сервера.

**Примечание:** если в `launchSettings.json` изменится порт, адрес Swagger также изменится.

---

