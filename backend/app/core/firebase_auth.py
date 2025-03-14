import firebase_admin
from firebase_admin import auth, credentials
from fastapi import HTTPException, status
from typing import Optional

from app.core.config import settings

# יצירת אובייקט האישורים של פיירבייס
cred = credentials.Certificate({
    "type": "service_account",
    "project_id": settings.FIREBASE_PROJECT_ID,
    "private_key_id": settings.FIREBASE_PRIVATE_KEY_ID,
    "private_key": settings.FIREBASE_PRIVATE_KEY.replace("\\n", "\n"),
    "client_email": settings.FIREBASE_CLIENT_EMAIL,
    "client_id": settings.FIREBASE_CLIENT_ID,
    "auth_uri": settings.FIREBASE_AUTH_URI,
    "token_uri": settings.FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": settings.FIREBASE_PROVIDER_CERT,
    "client_x509_cert_url": settings.FIREBASE_CLIENT_CERT
})

# אתחול פיירבייס אדמין SDK
try:
    firebase_admin.initialize_app(cred)
except ValueError:
    # האפליקציה כבר אותחלה
    pass

async def verify_firebase_token(token: str) -> dict:
    """
    אימות טוקן פיירבייס והחזרת פרטי המשתמש
    """
    try:
        decoded_token = auth.verify_id_token(token)
        return {
            "uid": decoded_token["uid"],
            "email": decoded_token.get("email"),
            "name": decoded_token.get("name")
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Firebase token"
        )

async def get_firebase_user(uid: str) -> Optional[dict]:
    """
    קבלת פרטי משתמש מפיירבייס לפי UID
    """
    try:
        user = auth.get_user(uid)
        return {
            "uid": user.uid,
            "email": user.email,
            "name": user.display_name
        }
    except auth.UserNotFoundError:
        return None
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching Firebase user"
        ) 