from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load environment variables early with explicit path
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), ".env")
print(f"DEBUG: env_path={env_path}")
load_dotenv(dotenv_path=env_path)
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

# UNIVERSAL CORS Configuration for multi-system access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static Files
import os
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
static_dir = os.path.join(BASE_DIR, "static")
if not os.path.exists(static_dir):
    os.makedirs(static_dir)
app.mount("/static", StaticFiles(directory=static_dir), name="static")

app.include_router(chat_router, prefix="/chat", tags=["chat"])
app.include_router(reminder_router, prefix="/reminder", tags=["reminder"])
app.include_router(emotion_router, prefix="/emotion", tags=["emotion"])
app.include_router(auth_router, prefix="/auth", tags=["auth"])
app.include_router(journal_router, prefix="/journal", tags=["journal"])
app.include_router(voice_router, prefix="/voice", tags=["voice"])
app.include_router(emergency_router, prefix="/emergency", tags=["emergency"])
app.include_router(profile_router, prefix="/profile", tags=["profile"])

@app.on_event("startup")
async def startup_db_client():
    await init_db()

@app.get("/")
async def root():
    return {"message": "Mental Health AI Backend is running"}
