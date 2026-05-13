from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import datetime, date
from bson import ObjectId

class UserProfile(BaseModel):
    id: Optional[str] = Field(None, alias="_id")
    user_id: str
    full_name: str
    email: str
    date_of_birth: Optional[date] = None
    gender: Optional[str] = None  # Male/Female/Other/Prefer not to say
    city: Optional[str] = None
    country: Optional[str] = None
    phone_number: Optional[str] = None
    emergency_contact_name: Optional[str] = None
    emergency_contact_phone: Optional[str] = None
    preferred_language: str = "en"  # en/ta
    timezone: str = "Asia/Kolkata"
    bio: Optional[str] = None
    avatar_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {
            ObjectId: str,
            datetime: lambda v: v.isoformat(),
            date: lambda v: v.isoformat()
        }

    @validator('gender')
    def validate_gender(cls, v):
        if v and v not in ['Male', 'Female', 'Other', 'Prefer not to say']:
            raise ValueError('Invalid gender value')
        return v

    @validator('preferred_language')
    def validate_language(cls, v):
        if v not in ['en', 'ta']:
            raise ValueError('Language must be en or ta')
        return v

    @validator('date_of_birth')
    def validate_age(cls, v):
        if v:
            today = date.today()
            age = today.year - v.year - ((today.month, today.day) < (v.month, v.day))
            if age < 13:
                raise ValueError('User must be at least 13 years old')
        return v
