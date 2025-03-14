import uuid
from typing import Optional, Union, List, Any, Dict
from pydantic import EmailStr, validator # type: ignore
from sqlmodel import Field, Relationship, SQLModel # type: ignore
from datetime import datetime
from sqlalchemy import Index, text # type: ignore
from sqlalchemy.dialects.postgresql import JSONB # type: ignore
from sqlalchemy import Column # type: ignore

from .models.campaign import Campaign, CampaignAnalysis

# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True)
    is_active: bool = True
    is_superuser: bool = False
    full_name: Optional[str] = Field(None, max_length=255)
    firebase_uid: Optional[str] = Field(None, max_length=128)

    @validator('full_name')
    def validate_full_name(cls, v):
        if v is not None and len(v) > 255:
            raise ValueError('full_name must be less than 255 characters')
        return v

    @validator('firebase_uid')
    def validate_firebase_uid(cls, v):
        if v is not None and len(v) > 128:
            raise ValueError('firebase_uid must be less than 128 characters')
        return v


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: Optional[str] = None
    firebase_token: Optional[str] = None

    @validator('password')
    def validate_password(cls, v):
        if v is not None:
            if len(v) < 8:
                raise ValueError('password must be at least 8 characters')
            if len(v) > 40:
                raise ValueError('password must be less than 40 characters')
        return v


class UserRegister(SQLModel):
    email: EmailStr
    password: str = Field(min_length=8, max_length=40)
    full_name: Optional[str] = Field(None, max_length=255)

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('password must be at least 8 characters')
        if len(v) > 40:
            raise ValueError('password must be less than 40 characters')
        return v

    @validator('full_name')
    def validate_full_name(cls, v):
        if v is not None and len(v) > 255:
            raise ValueError('full_name must be less than 255 characters')
        return v


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: Optional[EmailStr] = None
    password: Optional[str] = Field(None, min_length=8, max_length=40)

    @validator('password')
    def validate_password(cls, v):
        if v is not None:
            if len(v) < 8:
                raise ValueError('password must be at least 8 characters')
            if len(v) > 40:
                raise ValueError('password must be less than 40 characters')
        return v


class UserUpdateMe(SQLModel):
    full_name: Optional[str] = Field(None, max_length=255)
    email: Optional[EmailStr] = None

    @validator('full_name')
    def validate_full_name(cls, v):
        if v is not None and len(v) > 255:
            raise ValueError('full_name must be less than 255 characters')
        return v


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)

    @validator('current_password', 'new_password')
    def validate_password(cls, v):
        if len(v) < 8:
            raise ValueError('password must be at least 8 characters')
        if len(v) > 40:
            raise ValueError('password must be less than 40 characters')
        return v


# Database model, database table inferred from class name
class User(SQLModel, table=True):
    __tablename__ = "users"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    is_active: bool = True
    is_superuser: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    full_name: Optional[str] = Field(None, max_length=255)
    firebase_uid: Optional[str] = Field(None, max_length=128)
    items: list["Item"] = Relationship(back_populates="owner", sa_relationship_kwargs={"cascade": "all, delete"})
    auth_provider: str = Field(default="email")


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str
    description: Optional[str] = None

    @validator('title')
    def validate_title(cls, v):
        if len(v) < 1:
            raise ValueError('title must not be empty')
        if len(v) > 255:
            raise ValueError('title must be less than 255 characters')
        return v

    @validator('description')
    def validate_description(cls, v):
        if v is not None and len(v) > 255:
            raise ValueError('description must be less than 255 characters')
        return v


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: Optional[str] = Field(None, min_length=1, max_length=255)


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    __tablename__ = "items"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)
    owner: Optional[User] = Relationship(back_populates="items", sa_relationship_kwargs={"cascade": "all, delete", "passive_deletes": True})


# Properties to return via API, id is always required
class ItemPublic(ItemBase):
    id: uuid.UUID
    owner_id: uuid.UUID


class ItemsPublic(SQLModel):
    data: list[ItemPublic]
    count: int


# Generic message
class Message(SQLModel):
    message: str


# JSON payload containing access token
class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"


# Contents of JWT token
class TokenPayload(SQLModel):
    sub: Optional[str] = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


# מודלים עבור מערכת השותפים
class AffiliateBase(SQLModel):
    name: str = Field(max_length=255)
    commission_rate: float = Field(default=0.1)  # אחוז העמלה
    status: str = Field(default="active", max_length=20)
    payment_info: Optional[str] = Field(None, max_length=500)

    @validator('name')
    def validate_name(cls, v):
        if len(v) > 255:
            raise ValueError('name must be less than 255 characters')
        return v

    @validator('status')
    def validate_status(cls, v):
        if len(v) > 20:
            raise ValueError('status must be less than 20 characters')
        return v

    @validator('payment_info')
    def validate_payment_info(cls, v):
        if v is not None and len(v) > 500:
            raise ValueError('payment_info must be less than 500 characters')
        return v


class AffiliateCreate(AffiliateBase):
    pass


class AffiliateUpdate(AffiliateBase):
    name: Optional[str] = Field(None, max_length=255)
    commission_rate: Optional[float] = None
    status: Optional[str] = Field(None, max_length=20)


class Affiliate(AffiliateBase, table=True):
    __tablename__ = "affiliates"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)
    total_earnings: float = Field(default=0.0)
    referral_code: str = Field(max_length=50, unique=True)
    campaigns: list[Campaign] = Relationship(back_populates="affiliate", sa_relationship_kwargs={"cascade": "all, delete", "passive_deletes": True})


# מודלים עבור קמפיינים
class CampaignBase(SQLModel):
    name: str = Field(max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    budget: float
    status: str = Field(default="draft", max_length=20)
    platform: str = Field(max_length=50)
    target_audience: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSONB))
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None

    @validator('name')
    def validate_name(cls, v):
        if len(v) > 255:
            raise ValueError('name must be less than 255 characters')
        return v

    @validator('description')
    def validate_description(cls, v):
        if v is not None and len(v) > 1000:
            raise ValueError('description must be less than 1000 characters')
        return v

    @validator('status')
    def validate_status(cls, v):
        if len(v) > 20:
            raise ValueError('status must be less than 20 characters')
        return v

    @validator('platform')
    def validate_platform(cls, v):
        if len(v) > 50:
            raise ValueError('platform must be less than 50 characters')
        return v


class CampaignCreate(CampaignBase):
    pass


class CampaignUpdate(CampaignBase):
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    budget: Optional[float] = None
    status: Optional[str] = Field(None, max_length=20)
    platform: Optional[str] = Field(None, max_length=50)
    target_audience: Optional[Dict[str, Any]] = None


class Campaign(CampaignBase, table=True):
    __tablename__ = "campaigns"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    affiliate_id: uuid.UUID = Field(foreign_key="affiliates.id", nullable=False)
    affiliate: Optional[Affiliate] = Relationship(back_populates="campaigns")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    analytics: list[CampaignAnalysis] = Relationship(back_populates="campaign", sa_relationship_kwargs={"cascade": "all, delete", "passive_deletes": True})


class CampaignPublic(CampaignBase):
    id: uuid.UUID
    affiliate_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class CampaignsPublic(SQLModel):
    data: list[CampaignPublic]
    count: int


# מודלים עבור ניתוח קמפיינים
class CampaignAnalysisBase(SQLModel):
    impressions: int = Field(default=0)
    clicks: int = Field(default=0)
    conversions: int = Field(default=0)
    spend: float = Field(default=0.0)
    revenue: float = Field(default=0.0)
    date: datetime = Field(default_factory=datetime.utcnow)
    metrics: Optional[Dict[str, Any]] = Field(default=None, sa_column=Column(JSONB))


class CampaignAnalysisCreate(CampaignAnalysisBase):
    pass


class CampaignAnalysisUpdate(CampaignAnalysisBase):
    impressions: Optional[int] = None
    clicks: Optional[int] = None
    conversions: Optional[int] = None
    spend: Optional[float] = None
    revenue: Optional[float] = None
    date: Optional[datetime] = None
    metrics: Optional[Dict[str, Any]] = None


class CampaignAnalysis(CampaignAnalysisBase, table=True):
    __tablename__ = "campaign_analyses"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    campaign_id: uuid.UUID = Field(foreign_key="campaigns.id", nullable=False)
    campaign: Optional[Campaign] = Relationship(back_populates="analytics")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


class CampaignAnalysisPublic(CampaignAnalysisBase):
    id: uuid.UUID
    campaign_id: uuid.UUID
    created_at: datetime
    updated_at: datetime


class CampaignAnalysesPublic(SQLModel):
    data: list[CampaignAnalysisPublic]
    count: int


class Transaction(SQLModel, table=True):
    __tablename__ = "transactions"
    
    __table_args__ = (
        Index('idx_transaction_user', 'user_id'),
        Index('idx_transaction_type', 'type'),
        Index('idx_transaction_status', 'status'),
        {'postgresql_partition_by': 'RANGE (created_at)'}
    )
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)
    amount: float = Field(nullable=False)
    currency: str = Field(nullable=False, max_length=3)
    type: str = Field(nullable=False, max_length=20)  # payment, commission, refund
    status: str = Field(nullable=False, max_length=20)  # pending, completed, failed
    transaction_metadata: dict = Field(default={}, sa_column=Column(JSONB))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @validator('currency')
    def validate_currency(cls, v):
        if len(v) > 3:
            raise ValueError('currency must be less than 3 characters')
        return v

    @validator('type', 'status')
    def validate_type_status(cls, v):
        if len(v) > 20:
            raise ValueError('type and status must be less than 20 characters')
        return v


class Notification(SQLModel, table=True):
    __tablename__ = "notifications"
    
    __table_args__ = (
        Index('idx_notification_user', 'user_id'),
        Index('idx_notification_type', 'type'),
        Index('idx_notification_read', 'read'),
        {'postgresql_partition_by': 'RANGE (created_at)'}
    )
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", nullable=False)
    type: str = Field(nullable=False, max_length=50)  # campaign, payment, system
    title: str = Field(nullable=False, max_length=255)
    message: str = Field(nullable=False)
    read: bool = Field(default=False)
    notification_metadata: dict = Field(default={}, sa_column=Column(JSONB))
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    @validator('type')
    def validate_type(cls, v):
        if len(v) > 50:
            raise ValueError('type must be less than 50 characters')
        return v

    @validator('title')
    def validate_title(cls, v):
        if len(v) > 255:
            raise ValueError('title must be less than 255 characters')
        return v
