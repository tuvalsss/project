from typing import Optional
from uuid import UUID
from sqlmodel import Field, SQLModel
from pydantic import EmailStr

class UserBase(SQLModel):
    email: Optional[EmailStr] = None
    is_active: Optional[bool] = True
    is_superuser: bool = False
    full_name: Optional[str] = None
    firebase_uid: Optional[str] = None
    auth_provider: str = "email"

class UserCreate(UserBase):
    email: EmailStr
    password: str
    full_name: Optional[str] = None
    firebase_token: Optional[str] = None

class UserUpdate(UserBase):
    password: Optional[str] = None

class User(UserBase, table=True):
    id: Optional[UUID] = Field(default=None, primary_key=True)
    hashed_password: str 