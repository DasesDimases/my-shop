import random
from datetime import datetime, timedelta
from pymongo import MongoClient

# --- 1. Подключение к базе ---
MONGO_URL = "mongodb+srv://USERNAME:PASSWORD@shop.smdqa6p.mongodb.net/shop"
client = MongoClient(MONGO_URL)
orders = client.shop.orders

# --- 2. Список клиентов ---
names = ["Иван", "Олег", "Вася", "Катя", "Аня", "Петр", "Светлана", "Алексей", "Мария", "Сергей"]
emails = [f"user{i}@mail.ru" for i in range(1, 21)]
phones = [f"+79{random.randint(100000000,999999999)}" for _ in range(20)]

# --- 3. Пример товаров (замени id и названия на реальные!) ---
products = [
    {
        "id": "683861f700033809f5b77606",
        "name": "Диск сцепления LuK",
        "category": "Диски",
        "models": ["Logan 2", "Duster"],
        "price": 6600
    },
    {
        "id": "68363b778bde9ec6ab21fadb",
        "name": "ГРМ",
        "category": "Двигатель",
        "models": ["Duster"],
        "price": 7990
    },
    {
        "id": "6684781256",
        "name": "Фильтр воздушный",
        "category": "Фильтры",
        "models": ["Logan 2"],
        "price": 590
    },
    # ...добавь свои товары
]

# --- 4. Генерация заказов ---
N_ORDERS = 100

for _ in range(N_ORDERS):
    customer = {
        "name": random.choice(names),
        "email": random.choice(emails),
        "phone": random.choice(phones)
    }

    n_items = random.randint(1, 4)
    items = []
    total = 0

    # Случайные товары в заказе
    for _ in range(n_items):
        prod = random.choice(products)
        qty = random.randint(1, 3)
        item = {
            "id": prod["id"],
            "name": prod["name"],
            "category": prod["category"],
            "models": prod.get("models", []),
            "qty": qty,
            "price": prod["price"]
        }
        items.append(item)
        total += prod["price"] * qty

    # Случайная дата за год назад
    days_ago = random.randint(0, 365)
    order_date = datetime.now() - timedelta(days=days_ago)
    createdAt = order_date.isoformat()

    order = {
        "customer": customer,
        "items": items,
        "total": total,
        "createdAt": createdAt
    }

    orders.insert_one(order)

print(f"Сгенерировано и добавлено {N_ORDERS} заказов.")
