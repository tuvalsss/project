from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session
from typing import List
import uuid
import random
import string

from app.api import deps
from app.crud import crud_affiliate
from app.models import (
    Affiliate,
    AffiliateCreate,
    AffiliateUpdate,
    User,
    Campaign,
    CampaignCreate
)

router = APIRouter()

def generate_referral_code(length: int = 8) -> str:
    """יצירת קוד הפניה ייחודי"""
    chars = string.ascii_uppercase + string.digits
    return ''.join(random.choice(chars) for _ in range(length))

@router.post("/", response_model=Affiliate)
def create_affiliate(
    *,
    db: Session = Depends(deps.get_db),
    affiliate_in: AffiliateCreate,
    current_user: User = Depends(deps.get_current_user)
) -> Affiliate:
    """
    יצירת חשבון שותף חדש
    """
    # בדיקה אם כבר קיים חשבון שותף למשתמש
    existing_affiliate = crud_affiliate.get_by_user_id(db, user_id=current_user.id)
    if existing_affiliate:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User already has an affiliate account"
        )
    
    # יצירת קוד הפניה ייחודי
    while True:
        referral_code = generate_referral_code()
        if not crud_affiliate.get_by_referral_code(db, referral_code=referral_code):
            break
    
    # יצירת חשבון שותף חדש
    affiliate = crud_affiliate.create_with_user(
        db=db,
        obj_in=affiliate_in,
        user_id=current_user.id,
        referral_code=referral_code
    )
    return affiliate

@router.get("/me", response_model=Affiliate)
def get_my_affiliate(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> Affiliate:
    """
    קבלת פרטי חשבון השותף של המשתמש המחובר
    """
    affiliate = crud_affiliate.get_by_user_id(db, user_id=current_user.id)
    if not affiliate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Affiliate account not found"
        )
    return affiliate

@router.put("/me", response_model=Affiliate)
def update_my_affiliate(
    *,
    db: Session = Depends(deps.get_db),
    affiliate_in: AffiliateUpdate,
    current_user: User = Depends(deps.get_current_user)
) -> Affiliate:
    """
    עדכון פרטי חשבון השותף
    """
    affiliate = crud_affiliate.get_by_user_id(db, user_id=current_user.id)
    if not affiliate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Affiliate account not found"
        )
    affiliate = crud_affiliate.update(db, db_obj=affiliate, obj_in=affiliate_in)
    return affiliate

@router.get("/campaigns", response_model=List[Campaign])
def get_my_campaigns(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user)
) -> List[Campaign]:
    """
    קבלת רשימת הקמפיינים של השותף
    """
    affiliate = crud_affiliate.get_by_user_id(db, user_id=current_user.id)
    if not affiliate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Affiliate account not found"
        )
    return affiliate.campaigns

@router.post("/campaigns", response_model=Campaign)
def create_campaign(
    *,
    db: Session = Depends(deps.get_db),
    campaign_in: CampaignCreate,
    current_user: User = Depends(deps.get_current_user)
) -> Campaign:
    """
    יצירת קמפיין חדש
    """
    affiliate = crud_affiliate.get_by_user_id(db, user_id=current_user.id)
    if not affiliate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Affiliate account not found"
        )
    campaign = crud_affiliate.create_campaign(
        db=db,
        obj_in=campaign_in,
        affiliate_id=affiliate.id
    )
    return campaign 