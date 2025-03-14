from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from sqlmodel import Session
from typing import List
import uuid
from datetime import datetime

from app.api import deps
from app.core.social_media import (
    create_facebook_campaign,
    create_instagram_campaign,
    create_google_campaign
)
from app.core.ai_engine import analyze_campaign_performance
from app.crud import crud_campaign
from app.models import (
    Campaign,
    CampaignCreate,
    CampaignUpdate,
    CampaignAnalysis,
    User
)

router = APIRouter()

@router.get("/", response_model=List[Campaign])
def get_campaigns(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_user),
    skip: int = 0,
    limit: int = 100
) -> List[Campaign]:
    """
    קבלת רשימת כל הקמפיינים
    """
    campaigns = crud_campaign.get_multi(db, skip=skip, limit=limit)
    return campaigns

@router.post("/", response_model=Campaign)
async def create_new_campaign(
    *,
    db: Session = Depends(deps.get_db),
    campaign_in: CampaignCreate,
    background_tasks: BackgroundTasks,
    current_user: User = Depends(deps.get_current_user)
) -> Campaign:
    """
    יצירת קמפיין חדש
    """
    # יצירת הקמפיין במסד הנתונים
    campaign = crud_campaign.create(db=db, obj_in=campaign_in)
    
    # יצירת הקמפיין בפלטפורמה המתאימה
    if campaign.platform.lower() == "facebook":
        background_tasks.add_task(create_facebook_campaign, campaign)
    elif campaign.platform.lower() == "instagram":
        background_tasks.add_task(create_instagram_campaign, campaign)
    elif campaign.platform.lower() == "google":
        background_tasks.add_task(create_google_campaign, campaign)
    
    return campaign

@router.get("/{campaign_id}", response_model=Campaign)
def get_campaign(
    *,
    db: Session = Depends(deps.get_db),
    campaign_id: uuid.UUID,
    current_user: User = Depends(deps.get_current_user)
) -> Campaign:
    """
    קבלת פרטי קמפיין ספציפי
    """
    campaign = crud_campaign.get(db=db, id=campaign_id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    return campaign

@router.put("/{campaign_id}", response_model=Campaign)
def update_campaign(
    *,
    db: Session = Depends(deps.get_db),
    campaign_id: uuid.UUID,
    campaign_in: CampaignUpdate,
    current_user: User = Depends(deps.get_current_user)
) -> Campaign:
    """
    עדכון פרטי קמפיין
    """
    campaign = crud_campaign.get(db=db, id=campaign_id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    campaign = crud_campaign.update(db=db, db_obj=campaign, obj_in=campaign_in)
    return campaign

@router.post("/{campaign_id}/analyze", response_model=CampaignAnalysis)
async def analyze_campaign(
    *,
    db: Session = Depends(deps.get_db),
    campaign_id: uuid.UUID,
    current_user: User = Depends(deps.get_current_user)
) -> CampaignAnalysis:
    """
    ניתוח ביצועי קמפיין באמצעות AI
    """
    campaign = crud_campaign.get(db=db, id=campaign_id)
    if not campaign:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Campaign not found"
        )
    
    # ניתוח הקמפיין באמצעות AI
    analysis = await analyze_campaign_performance(campaign)
    
    # שמירת תוצאות הניתוח במסד הנתונים
    analysis_obj = CampaignAnalysis(
        campaign_id=campaign_id,
        analysis_date=datetime.now().isoformat(),
        insights=analysis["insights"],
        recommendations=analysis["recommendations"],
        performance_score=analysis["performance_score"],
        improvement_areas=analysis["improvement_areas"]
    )
    db.add(analysis_obj)
    db.commit()
    db.refresh(analysis_obj)
    
    return analysis_obj 