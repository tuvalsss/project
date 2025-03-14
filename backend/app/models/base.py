from typing import Optional
from sqlmodel import Field, SQLModel
from pydantic import validator
from datetime import datetime

class CampaignBase(SQLModel):
    name: str = Field(max_length=255)
    description: Optional[str] = Field(None, max_length=1000)
    start_date: Optional[datetime] = None
    end_date: Optional[datetime] = None
    budget: Optional[float] = None
    status: str = Field(default="draft", max_length=20)

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


class CampaignAnalysisBase(SQLModel):
    impressions: int = Field(default=0)
    clicks: int = Field(default=0)
    conversions: int = Field(default=0)
    revenue: float = Field(default=0.0)
    cost: float = Field(default=0.0)
    roi: float = Field(default=0.0)
    ctr: float = Field(default=0.0)
    conversion_rate: float = Field(default=0.0)
    average_order_value: float = Field(default=0.0)
    notes: Optional[str] = Field(None, max_length=1000)

    @validator('notes')
    def validate_notes(cls, v):
        if v is not None and len(v) > 1000:
            raise ValueError('notes must be less than 1000 characters')
        return v 