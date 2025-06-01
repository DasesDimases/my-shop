from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = "mongodb://localhost:27017"  # Или MongoDB Atlas URL

client = AsyncIOMotorClient(MONGO_URL)
db = client["shop"]
product_collection = db["products"]
