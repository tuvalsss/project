import uuid
from typing import Optional
from pydantic import EmailStr
from sqlmodel import Field, Relationship, SQLModel
from datetime import datetime
from sqlalchemy import Index, text
from sqlalchemy.dialects.postgresql import JSONB


# Shared properties
class UserBase(SQLModel):
    email: EmailStr = Field(unique=True, index=True, max_length=255)
    is_active: bool = True
    is_superuser: bool = False
    full_name: str | None = Field(default=None, max_length=255)
    firebase_uid: str | None = Field(default=None, max_length=128)


# Properties to receive via API on creation
class UserCreate(UserBase):
    password: str | None = Field(default=None, min_length=8, max_length=40)
    firebase_token: str | None = Field(default=None)


class UserRegister(SQLModel):
    email: EmailStr = Field(max_length=255)
    password: str = Field(min_length=8, max_length=40)
    full_name: str | None = Field(default=None, max_length=255)


# Properties to receive via API on update, all are optional
class UserUpdate(UserBase):
    email: EmailStr | None = Field(default=None, max_length=255)  # type: ignore
    password: str | None = Field(default=None, min_length=8, max_length=40)


class UserUpdateMe(SQLModel):
    full_name: str | None = Field(default=None, max_length=255)
    email: EmailStr | None = Field(default=None, max_length=255)


class UpdatePassword(SQLModel):
    current_password: str = Field(min_length=8, max_length=40)
    new_password: str = Field(min_length=8, max_length=40)


# Database model, database table inferred from class name
class User(UserBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    hashed_password: str | None = Field(default=None)
    items: list["Item"] = Relationship(back_populates="owner", cascade_delete=True)
    auth_provider: str = Field(default="email", max_length=20)


# Properties to return via API, id is always required
class UserPublic(UserBase):
    id: uuid.UUID


class UsersPublic(SQLModel):
    data: list[UserPublic]
    count: int


# Shared properties
class ItemBase(SQLModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = Field(default=None, max_length=255)


# Properties to receive on item creation
class ItemCreate(ItemBase):
    pass


# Properties to receive on item update
class ItemUpdate(ItemBase):
    title: str | None = Field(default=None, min_length=1, max_length=255)  # type: ignore


# Database model, database table inferred from class name
class Item(ItemBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    title: str = Field(max_length=255)
    owner_id: uuid.UUID = Field(
        foreign_key="user.id", nullable=False, ondelete="CASCADE"
    )
    owner: User | None = Relationship(back_populates="items")


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
    sub: str | None = None


class NewPassword(SQLModel):
    token: str
    new_password: str = Field(min_length=8, max_length=40)


# מודלים עבור מערכת השותפים
class AffiliateBase(SQLModel):
    name: str = Field(max_length=255)
    commission_rate: float = Field(default=0.1)  # אחוז העמלה
    status: str = Field(default="active", max_length=20)
    payment_info: str | None = Field(default=None, max_length=500)


class AffiliateCreate(AffiliateBase):
    pass


class AffiliateUpdate(AffiliateBase):
    name: str | None = Field(default=None, max_length=255)
    commission_rate: float | None = None
    status: str | None = Field(default=None, max_length=20)


class Affiliate(AffiliateBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    total_earnings: float = Field(default=0.0)
    referral_code: str = Field(unique=True, max_length=50)
    campaigns: list["Campaign"] = Relationship(back_populates="affiliate")


# מודלים עבור קמפיינים
class CampaignBase(SQLModel):
    name: str = Field(max_length=255)
    description: str | None = Field(default=None, max_length=1000)
    budget: float
    status: str = Field(default="draft", max_length=20)
    platform: str = Field(max_length=50)  # facebook/instagram/google
    target_audience: str | None = Field(default=None, max_length=500)
    start_date: str | None = None
    end_date: str | None = None


class CampaignCreate(CampaignBase):
    pass


class CampaignUpdate(CampaignBase):
    name: str | None = Field(default=None, max_length=255)
    budget: float | None = None
    status: str | None = Field(default=None, max_length=20)


class Campaign(CampaignBase, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    affiliate_id: uuid.UUID = Field(foreign_key="affiliate.id", nullable=False)
    affiliate: Affiliate = Relationship(back_populates="campaigns")
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    performance_metrics: dict | None = Field(default=None)  # מטריקות ביצועים מה-API

    __tablename__ = "campaigns"
    
    __table_args__ = (
        Index('idx_campaign_user', 'user_id'),
        Index('idx_campaign_status', 'status'),
        Index('idx_campaign_platform', 'platform'),
        Index('idx_campaign_performance', 'performance_score'),
        {'postgresql_partition_by': 'LIST (platform)'}
    )


# מודלים עבור תוצאות AI
class CampaignAnalysis(SQLModel, table=True):
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    campaign_id: uuid.UUID = Field(foreign_key="campaign.id", nullable=False)
    analysis_date: str = Field(default_factory=lambda: datetime.now().isoformat())
    insights: dict
    recommendations: list[str]
    performance_score: float
    improvement_areas: list[str]


class Transaction(SQLModel, table=True):
    __tablename__ = "transactions"
    
    __table_args__ = (
        Index('idx_transaction_user', 'user_id'),
        Index('idx_transaction_type', 'type'),
        Index('idx_transaction_status', 'status'),
        {'postgresql_partition_by': 'RANGE (created_at)'}
    )
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    amount: float = Field(nullable=False)
    currency: str = Field(max_length=3, nullable=False)
    type: str = Field(max_length=20, nullable=False)  # payment, commission, refund
    status: str = Field(max_length=20, nullable=False)  # pending, completed, failed
    metadata: dict = Field(default={})
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now().isoformat())


class Notification(SQLModel, table=True):
    __tablename__ = "notifications"
    
    __table_args__ = (
        Index('idx_notification_user', 'user_id'),
        Index('idx_notification_type', 'type'),
        Index('idx_notification_read', 'read'),
        {'postgresql_partition_by': 'RANGE (created_at)'}
    )
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="user.id", nullable=False)
    type: str = Field(max_length=50, nullable=False)  # campaign, payment, system
    title: str = Field(max_length=255, nullable=False)
    message: str = Field(nullable=False)
    read: bool = Field(default=False)
    metadata: dict = Field(default={})
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    updated_at: str = Field(default_factory=lambda: datetime.now().isoformat())
