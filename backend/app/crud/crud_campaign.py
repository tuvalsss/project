from typing import List, Optional, Dict
from uuid import UUID
from sqlmodel import Session, select
from datetime import datetime

from app.crud.base import CRUDBase
from app.models import Campaign, CampaignCreate, CampaignUpdate, CampaignAnalysis

class CRUDCampaign(CRUDBase[Campaign, CampaignCreate, CampaignUpdate]):
    def get_by_affiliate(
        self,
        db: Session,
        *,
        affiliate_id: UUID,
        skip: int = 0,
        limit: int = 100
    ) -> List[Campaign]:
        """
        קבלת רשימת קמפיינים של שותף מסוים
        """
        return db.exec(
            select(Campaign)
            .where(Campaign.affiliate_id == affiliate_id)
            .offset(skip)
            .limit(limit)
        ).all()
    
    def get_active_campaigns(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100
    ) -> List[Campaign]:
        """
        קבלת רשימת קמפיינים פעילים
        """
        return db.exec(
            select(Campaign)
            .where(Campaign.status == "active")
            .offset(skip)
            .limit(limit)
        ).all()
    
    def update_performance_metrics(
        self,
        db: Session,
        *,
        campaign_id: UUID,
        metrics: Dict
    ) -> Campaign:
        """
        עדכון מדדי ביצוע של קמפיין
        """
        campaign = self.get(db=db, id=campaign_id)
        if campaign:
            campaign.performance_metrics = metrics
            campaign.updated_at = datetime.now().isoformat()
            db.add(campaign)
            db.commit()
            db.refresh(campaign)
        return campaign
    
    def get_campaign_analysis(
        self,
        db: Session,
        *,
        campaign_id: UUID
    ) -> Optional[CampaignAnalysis]:
        """
        קבלת ניתוח AI אחרון של קמפיין
        """
        return db.exec(
            select(CampaignAnalysis)
            .where(CampaignAnalysis.campaign_id == campaign_id)
            .order_by(CampaignAnalysis.analysis_date.desc())
        ).first()
    
    def create_analysis(
        self,
        db: Session,
        *,
        campaign_id: UUID,
        insights: Dict,
        recommendations: List[str],
        performance_score: float,
        improvement_areas: List[str]
    ) -> CampaignAnalysis:
        """
        יצירת ניתוח AI חדש לקמפיין
        """
        analysis = CampaignAnalysis(
            campaign_id=campaign_id,
            analysis_date=datetime.now().isoformat(),
            insights=insights,
            recommendations=recommendations,
            performance_score=performance_score,
            improvement_areas=improvement_areas
        )
        db.add(analysis)
        db.commit()
        db.refresh(analysis)
        return analysis
    
    def get_campaigns_by_platform(
        self,
        db: Session,
        *,
        platform: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[Campaign]:
        """
        קבלת רשימת קמפיינים לפי פלטפורמה
        """
        return db.exec(
            select(Campaign)
            .where(Campaign.platform == platform)
            .offset(skip)
            .limit(limit)
        ).all()
    
    def get_campaigns_by_date_range(
        self,
        db: Session,
        *,
        start_date: str,
        end_date: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[Campaign]:
        """
        קבלת רשימת קמפיינים לפי טווח תאריכים
        """
        return db.exec(
            select(Campaign)
            .where(Campaign.start_date >= start_date)
            .where(Campaign.end_date <= end_date)
            .offset(skip)
            .limit(limit)
        ).all()


crud_campaign = CRUDCampaign(Campaign) 