from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Dict
from datetime import datetime
from bson import ObjectId

from pydantic_core import CoreSchema, core_schema
from pydantic import GetCoreSchemaHandler

class PyObjectId(str):
    @classmethod
    def __get_pydantic_core_schema__(
        cls, _source_type: any, _handler: GetCoreSchemaHandler
    ) -> CoreSchema:
        return core_schema.json_or_python_schema(
            json_schema=core_schema.str_schema(),
            python_schema=core_schema.union_schema([
                core_schema.is_instance_schema(ObjectId),
                core_schema.str_schema(),
            ]),
            serialization=core_schema.plain_serializer_function_ser_schema(
                lambda x: str(x)
            ),
        )

class Message(BaseModel):
    role: str # 'user' or 'assistant'
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    emotions: Optional[Dict[str, float]] = None

class ChatSession(BaseModel):
    id: Optional[PyObjectId] = Field(None, alias="_id")
    user_id: str
    start_time: datetime = Field(default_factory=datetime.utcnow)
    messages: List[Message] = []
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class User(BaseModel):
    id: Optional[PyObjectId] = Field(None, alias="_id")
    email: EmailStr
    hashed_password: str
    full_name: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    emergency_contact: Optional[str] = None
    profile_photo: Optional[str] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class JournalEntry(BaseModel):
    id: Optional[PyObjectId] = Field(None, alias="_id")
    user_id: str
    content: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    ai_insight: Optional[str] = None

    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class MoodHistory(BaseModel):
    id: Optional[PyObjectId] = Field(None, alias="_id")
    user_id: str
    date: str # YYYY-MM-DD
    aggregate_emotions: Dict[str, float]
    summary: Optional[str] = None
    sentiment_score: Optional[int] = None
    top_triggers: Optional[List[str]] = None
    actionable_suggestions: Optional[List[str]] = None
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class Reminder(BaseModel):
    id: Optional[PyObjectId] = Field(None, alias="_id")
    user_id: str
    text: str
    due_date: datetime
    is_completed: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True

class UserMemory(BaseModel):
    id: Optional[PyObjectId] = Field(None, alias="_id")
    user_id: str
    fact: str
    category: str # e.g., 'event', 'preference', 'people'
    importance: int = 1 # 1-5
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    
    class Config:
        populate_by_name = True
        arbitrary_types_allowed = True
