from typing import Optional
from sqlmodel import Field, Relationship
from datetime import datetime
import uuid

from .base import CampaignBase, CampaignAnalysisBase

class Campaign(CampaignBase, table=True):
    __tablename__ = "campaigns"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    affiliate_id: uuid.UUID = Field(foreign_key="affiliates.id", nullable=False)
    affiliate: Optional["Affiliate"] = Relationship(back_populates="campaigns")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    analytics: list["CampaignAnalysis"] = Relationship(back_populates="campaign", sa_relationship_kwargs={"cascade": "all, delete", "passive_deletes": True})


class CampaignAnalysis(CampaignAnalysisBase, table=True):
    __tablename__ = "campaign_analyses"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    campaign_id: uuid.UUID = Field(foreign_key="campaigns.id", nullable=False)
    campaign: Optional[Campaign] = Relationship(back_populates="analytics")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow) 