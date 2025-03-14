from fastapi import APIRouter, Depends, HTTPException, status
from sqlmodel import Session

from app.api import deps
from app.core.firebase_auth import verify_firebase_token
from app.core.security import create_access_token
from app.crud import crud_user
from app.models import User, UserCreate, Token

router = APIRouter()

@router.post("/firebase/login", response_model=Token)
async def login_with_firebase(
    firebase_token: str,
    db: Session = Depends(deps.get_db)
) -> Token:
    """
    התחברות באמצעות פיירבייס והחזרת טוקן JWT
    """
    # אימות טוקן פיירבייס
    firebase_user = await verify_firebase_token(firebase_token)
    
    # בדיקה אם המשתמש קיים במערכת
    user = crud_user.get_by_firebase_uid(db, firebase_uid=firebase_user["uid"])
    
    if not user:
        # יצירת משתמש חדש אם לא קיים
        user_in = UserCreate(
            email=firebase_user["email"],
            full_name=firebase_user.get("name"),
            firebase_uid=firebase_user["uid"],
            auth_provider="firebase"
        )
        user = crud_user.create(db, obj_in=user_in)
    
    # יצירת טוקן JWT
    access_token = create_access_token(subject=str(user.id))
    return Token(access_token=access_token) 