from fastapi import APIRouter

from app.api.v1.auth import firebase
from app.api.v1.affiliate import routes as affiliate_routes
from app.api.v1.campaigns import routes as campaign_routes
from app.api.v1.endpoints import items, login, users, utils

api_router = APIRouter()

# נתיבי אותנטיקציה
api_router.include_router(login.router, tags=["login"])
api_router.include_router(firebase.router, prefix="/auth", tags=["auth"])

# נתיבי משתמשים ופריטים
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(items.router, prefix="/items", tags=["items"])

# נתיבי שותפים
api_router.include_router(
    affiliate_routes.router,
    prefix="/affiliates",
    tags=["affiliates"]
)

# נתיבי קמפיינים
api_router.include_router(
    campaign_routes.router,
    prefix="/campaigns",
    tags=["campaigns"]
)

# נתיבי כלים
api_router.include_router(utils.router, prefix="/utils", tags=["utils"]) 