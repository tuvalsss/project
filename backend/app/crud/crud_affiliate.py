from typing import List, Optional
from uuid import UUID
from sqlmodel import Session, select

from app.crud.base import CRUDBase
from app.models import Affiliate, AffiliateCreate, AffiliateUpdate, Campaign, CampaignCreate

class CRUDAffiliate(CRUDBase[Affiliate, AffiliateCreate, AffiliateUpdate]):
    def get_by_user_id(self, db: Session, *, user_id: UUID) -> Optional[Affiliate]:
        """
        קבלת חשבון שותף לפי מזהה משתמש
        """
        return db.exec(
            select(Affiliate).where(Affiliate.user_id == user_id)
        ).first()
    
    def get_by_referral_code(self, db: Session, *, referral_code: str) -> Optional[Affiliate]:
        """
        קבלת חשבון שותף לפי קוד הפניה
        """
        return db.exec(
            select(Affiliate).where(Affiliate.referral_code == referral_code)
        ).first()
    
    def create_with_user(
        self,
        db: Session,
        *,
        obj_in: AffiliateCreate,
        user_id: UUID,
        referral_code: str
    ) -> Affiliate:
        """
        יצירת חשבון שותף חדש עם מזהה משתמש וקוד הפניה
        """
        db_obj = Affiliate(
            **obj_in.model_dump(),
            user_id=user_id,
            referral_code=referral_code
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def get_active_affiliates(
        self,
        db: Session,
        *,
        skip: int = 0,
        limit: int = 100
    ) -> List[Affiliate]:
        """
        קבלת רשימת שותפים פעילים
        """
        return db.exec(
            select(Affiliate)
            .where(Affiliate.status == "active")
            .offset(skip)
            .limit(limit)
        ).all()
    
    def create_campaign(
        self,
        db: Session,
        *,
        obj_in: CampaignCreate,
        affiliate_id: UUID
    ) -> Campaign:
        """
        יצירת קמפיין חדש עבור שותף
        """
        db_obj = Campaign(
            **obj_in.model_dump(),
            affiliate_id=affiliate_id
        )
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    def get_affiliate_campaigns(
        self,
        db: Session,
        *,
        affiliate_id: UUID,
        skip: int = 0,
        limit: int = 100
    ) -> List[Campaign]:
        """
        קבלת רשימת קמפיינים של שותף
        """
        return db.exec(
            select(Campaign)
            .where(Campaign.affiliate_id == affiliate_id)
            .offset(skip)
            .limit(limit)
        ).all()
    
    def update_earnings(
        self,
        db: Session,
        *,
        affiliate_id: UUID,
        amount: float
    ) -> Affiliate:
        """
        עדכון הרווחים של שותף
        """
        affiliate = self.get(db=db, id=affiliate_id)
        if affiliate:
            affiliate.total_earnings += amount
            db.add(affiliate)
            db.commit()
            db.refresh(affiliate)
        return affiliate


crud_affiliate = CRUDAffiliate(Affiliate) 