print("Importing app.main...")
try:
    from app.main import app
    print("Import success!")
except Exception as e:
    print(f"Import failed: {e}")
    import traceback
    traceback.print_exc()

print("Testing DB connection...")
import asyncio
from app.database import db
async def test():
    await db.connect()
    print("DB connection test done.")
    await db.close()

if __name__ == "__main__":
    asyncio.run(test())
    print("Test script finished successfully.")
