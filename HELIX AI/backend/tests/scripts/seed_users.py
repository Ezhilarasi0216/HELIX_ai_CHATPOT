import asyncio
import os
import sys

# Add the backend directory to the sys.path to allow imports from app
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.database import db
from app.auth.utils import get_password_hash
from app.models import User
from datetime import datetime

async def seed_users():
    print("Connecting to database...")
    await db.connect()
    
    if db.db is None:
        print("Failed to connect to database.")
        return

    users_to_create = []
    password = "password123"
    hashed_password = get_password_hash(password)

    for i in range(1, 11):
        email = f"testuser{i}@example.com"
        full_name = f"Test User {i}"
        
        # Check if user already exists
        existing_user = await db.db.users.find_one({"email": email})
        if existing_user:
            print(f"User {email} already exists, skipping.")
            continue
            
        new_user = User(
            email=email,
            hashed_password=hashed_password,
            full_name=full_name,
            created_at=datetime.utcnow()
        )
        
        users_to_create.append(new_user.dict(by_alias=True, exclude={"id"}))

    if users_to_create:
        result = await db.db.users.insert_many(users_to_create)
        print(f"Successfully created {len(result.inserted_ids)} new test users.")
    else:
        print("No new users were created.")

    await db.close()

if __name__ == "__main__":
    asyncio.run(seed_users())
