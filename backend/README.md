
# **🐘 База данных**

В проекте используется:

- **PostgreSQL**
- запуск через **Docker Compose**

Конфигурация базы данных находится /backend/ в файле:

```text
docker-compose.yml
```

После запуска Docker автоматически создается контейнер PostgreSQL.

---

# **🐳 Запуск Docker**

Перейти в backend проекта:

```bash
cd DeliveryOrders/backend
```

Запустить PostgreSQL:

```bash
docker compose up -d
```

Проверить запущенные контейнеры:

```bash
docker ps
```

Остановка контейнеров:

```bash
docker compose down
```

---

# **⚙️ Настройка подключения к базе**

Строка подключения находится в:

```text
backend/appsettings.json
```

Пример:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": 
    "Host=localhost;Port=5410;Database=delivery_orders;Username=admin;Password=admin"
  }
}
```

Параметры должны совпадать с настройками в:

```text
docker-compose.yml
```

---