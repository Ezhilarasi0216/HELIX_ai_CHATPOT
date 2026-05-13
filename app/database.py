import os
from motor.motor_asyncio import AsyncIOMotorClient

# MONGODB_URL will be picked up after load_dotenv() in main.py

class Database:
    client: AsyncIOMotorClient = None
    db = None

    async def connect(self):
        mongodb_url = os.getenv("MONGODB_URL")
        if not mongodb_url:
            print("Warning: MONGODB_URL not found in environment variables")
            return
        
        try:
            self.client = AsyncIOMotorClient(mongodb_url)
            self.db = self.client.get_database("empathyai_db")
            # Verify connection
            await self.client.admin.command('ping')
            print("Successfully connected to MongoDB Atlas!")
        except Exception as e:
            print(f"Error connecting to MongoDB: {e}")
            self.db = None

    async def close(self):
        if self.client:
            self.client.close()
            print("MongoDB connection closed.")

db = Database()
