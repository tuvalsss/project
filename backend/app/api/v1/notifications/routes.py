from fastapi import APIRouter, WebSocket, Depends, HTTPException
from typing import List
from ....core.notifications import NotificationManager, NotificationService
from ....models import Notification
from ...deps import get_current_user

router = APIRouter()
notification_manager = NotificationManager()
notification_service = NotificationService(notification_manager)

@router.websocket("/ws/notifications/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await notification_manager.connect(websocket, user_id)
    try:
        while True:
            data = await websocket.receive_text()
            # כאן אפשר להוסיף לוגיקה נוספת לטיפול בהודעות מהלקוח
    except Exception as e:
        notification_manager.disconnect(websocket, user_id)

@router.get("/notifications", response_model=List[Notification])
async def get_notifications(
    current_user = Depends(get_current_user),
    unread_only: bool = False
):
    """קבלת כל ההתראות של המשתמש"""
    if unread_only:
        return await notification_service.get_unread_notifications(current_user.id)
    return await notification_service.get_all_notifications(current_user.id)

@router.post("/notifications/{notification_id}/read")
async def mark_as_read(
    notification_id: str,
    current_user = Depends(get_current_user)
):
    """סימון התראה כנקראה"""
    notification = await notification_service.mark_as_read(notification_id)
    if not notification:
        raise HTTPException(status_code=404, detail="Notification not found")
    if notification.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to mark this notification")
    return {"status": "success"}

@router.post("/notifications/mark-all-read")
async def mark_all_as_read(current_user = Depends(get_current_user)):
    """סימון כל ההתראות כנקראות"""
    notifications = await notification_service.get_unread_notifications(current_user.id)
    for notification in notifications:
        await notification_service.mark_as_read(notification.id)
    return {"status": "success"} 