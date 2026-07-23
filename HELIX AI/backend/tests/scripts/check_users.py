import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv

load_dotenv()
MONGODB_URL = os.getenv("MONGODB_URL")

async def check_users():
    client = AsyncIOMotorClient(MONGODB_URL)
    db = client.get_database("empathyai_db")
    count = await db.users.count_documents({})
    print(f"User count: {count}")
    if count > 0:
        user = await db.users.find_one({})
        print(f"Sample user email: {user['email']}")
    client.close()

if __name__ == "__main__":
    asyncio.run(check_users())
