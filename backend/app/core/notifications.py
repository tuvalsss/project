from fastapi import WebSocket, WebSocketDisconnect
from typing import Dict, List, Optional
from ..models import Notification
from datetime import datetime
import json
import asyncio

class NotificationManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}
        
    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        if user_id not in self.active_connections:
            self.active_connections[user_id] = []
        self.active_connections[user_id].append(websocket)
        
    def disconnect(self, websocket: WebSocket, user_id: str):
        if user_id in self.active_connections:
            self.active_connections[user_id].remove(websocket)
            if not self.active_connections[user_id]:
                del self.active_connections[user_id]
                
    async def send_personal_notification(self, user_id: str, notification: Notification):
        if user_id in self.active_connections:
            message = {
                "type": notification.type,
                "title": notification.title,
                "message": notification.message,
                "metadata": notification.metadata,
                "created_at": notification.created_at
            }
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except WebSocketDisconnect:
                    await self.disconnect(connection, user_id)
                    
    async def broadcast(self, message: dict):
        for user_id in self.active_connections:
            for connection in self.active_connections[user_id]:
                try:
                    await connection.send_json(message)
                except WebSocketDisconnect:
                    await self.disconnect(connection, user_id)

class NotificationService:
    def __init__(self, manager: NotificationManager):
        self.manager = manager
        
    async def create_notification(
        self,
        user_id: str,
        type: str,
        title: str,
        message: str,
        metadata: Optional[dict] = None
    ) -> Notification:
        """יצירת התראה חדשה"""
        notification = Notification(
            user_id=user_id,
            type=type,
            title=title,
            message=message,
            metadata=metadata or {}
        )
        await notification.save()
        
        # שליחת ההתראה בזמן אמת
        await self.manager.send_personal_notification(user_id, notification)
        
        return notification
        
    async def create_campaign_performance_notification(
        self,
        user_id: str,
        campaign_id: str,
        performance_data: dict
    ) -> Notification:
        """יצירת התראה על ביצועי קמפיין"""
        title = "עדכון ביצועי קמפיין"
        message = f"הקמפיין שלך השיג {performance_data['conversions']} המרות ב-24 השעות האחרונות"
        
        return await self.create_notification(
            user_id=user_id,
            type="campaign_performance",
            title=title,
            message=message,
            metadata={
                "campaign_id": campaign_id,
                "performance_data": performance_data
            }
        )
        
    async def create_payment_notification(
        self,
        user_id: str,
        transaction_id: str,
        amount: float,
        currency: str,
        status: str
    ) -> Notification:
        """יצירת התראה על תשלום"""
        title = "עדכון תשלום"
        message = f"התשלום שלך על סך {amount} {currency} {status}"
        
        return await self.create_notification(
            user_id=user_id,
            type="payment",
            title=title,
            message=message,
            metadata={
                "transaction_id": transaction_id,
                "amount": amount,
                "currency": currency,
                "status": status
            }
        )
        
    async def create_commission_notification(
        self,
        user_id: str,
        amount: float,
        currency: str
    ) -> Notification:
        """יצירת התראה על עמלה"""
        title = "עמלת שותפים חדשה"
        message = f"קיבלת עמלה חדשה בסך {amount} {currency}"
        
        return await self.create_notification(
            user_id=user_id,
            type="commission",
            title=title,
            message=message,
            metadata={
                "amount": amount,
                "currency": currency
            }
        )
        
    async def mark_as_read(self, notification_id: str) -> Notification:
        """סימון התראה כנקראה"""
        notification = await Notification.get(notification_id)
        if notification:
            notification.read = True
            await notification.save()
        return notification
        
    async def get_unread_notifications(self, user_id: str) -> List[Notification]:
        """קבלת כל ההתראות שלא נקראו"""
        return await Notification.filter(user_id=user_id, read=False).order_by("-created_at")
        
    async def get_all_notifications(self, user_id: str) -> List[Notification]:
        """קבלת כל ההתראות"""
        return await Notification.filter(user_id=user_id).order_by("-created_at") 