import os
from motor.motor_asyncio import AsyncIOMotorClient

MONGO_URL = os.environ.get("MONGODB_URI", "mongodb://localhost:27017")
client = AsyncIOMotorClient(MONGO_URL)
db = client.get_default_database()
product_collection = db["products"]

