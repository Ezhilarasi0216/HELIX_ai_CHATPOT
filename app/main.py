from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()
print(f"DEBUG: OPENROUTER_API_KEY found: {'Yes' if os.getenv('OPENROUTER_API_KEY') else 'No'}")

from app.chat.routes import router as chat_router
from app.reminder.routes import router as reminder_router
from app.emotion.routes import router as emotion_router
from app.auth.routes import router as auth_router
from app.journal.routes import router as journal_router
from app.voice.voice_controller import router as voice_router
from app.safety.emergency_contacts import router as emergency_router
from app.profile.routes import router as profile_router
from app.database_sql import init_db

app = FastAPI(title="Healix AI API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_db_client():
    await init_db()

@app.get("/")
async def root():
    return {"message": "Mental Health AI Backend is running"}
