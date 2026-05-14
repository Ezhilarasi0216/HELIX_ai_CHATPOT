from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

load_dotenv()
print(f"DEBUG: OPENROUTER_API_KEY found: {'Yes' if os.getenv('OPENROUTER_API_KEY') else 'No'}")

from chat.routes import router as chat_router
from reminder.routes import router as reminder_router
from emotion.routes import router as emotion_router
from auth.routes import router as auth_router
from journal.routes import router as journal_router
from voice.voice_controller import router as voice_router
from safety.emergency_contacts import router as emergency_router
from profile.routes import router as profile_router
from database_sql import init_db

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

@app.on_event
app.include_router(chat_router, prefix="/chat", tags=["chat"])
app.include_router(reminder_router, prefix="/reminder", tags=["reminder"])
app.include_router(emotion_router, prefix="/emotion", tags=["emotion"])
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(journal_router, prefix="/journal", tags=["journal"])
app.include_router(voice_router, prefix="/voice", tags=["voice"])
app.include_router(emergency_router, prefix="/emergency", tags=["emergency"])
app.include_router(profile_router, prefix="/profile", tags=["profile"])
