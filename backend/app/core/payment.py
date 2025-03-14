import stripe
from fastapi import HTTPException
from typing import Optional
from datetime import datetime
from ..models import Transaction
from .config import settings

stripe.api_key = settings.STRIPE_SECRET_KEY

class PaymentService:
    @staticmethod
    async def create_payment_method(user_id: str, payment_details: dict) -> dict:
        try:
            payment_method = stripe.PaymentMethod.create(
                type="card",
                card={
                    "number": payment_details["card_number"],
                    "exp_month": payment_details["exp_month"],
                    "exp_year": payment_details["exp_year"],
                    "cvc": payment_details["cvc"],
                },
            )
            
            # קישור שיטת התשלום למשתמש
            stripe.PaymentMethod.attach(
                payment_method.id,
                customer=user_id,
            )
            
            return {"payment_method_id": payment_method.id}
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    async def process_payment(
        user_id: str,
        amount: float,
        currency: str = "USD",
        payment_method_id: Optional[str] = None,
    ) -> Transaction:
        try:
            # יצירת תשלום בסטרייפ
            payment_intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # סטרייפ משתמש באגורות
                currency=currency,
                customer=user_id,
                payment_method=payment_method_id,
                confirm=True,
                return_url="https://your-domain.com/payment/success",
            )
            
            # יצירת תיעוד התשלום במערכת שלנו
            transaction = Transaction(
                user_id=user_id,
                amount=amount,
                currency=currency,
                type="payment",
                status="completed" if payment_intent.status == "succeeded" else "pending",
                metadata={"stripe_payment_intent_id": payment_intent.id}
            )
            
            return transaction
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    async def process_commission(
        affiliate_id: str,
        amount: float,
        currency: str = "USD",
    ) -> Transaction:
        try:
            # יצירת העברת כספים לשותף
            transfer = stripe.Transfer.create(
                amount=int(amount * 100),
                currency=currency,
                destination=affiliate_id,  # חשבון הסטרייפ של השותף
            )
            
            # יצירת תיעוד העמלה במערכת שלנו
            transaction = Transaction(
                user_id=affiliate_id,
                amount=amount,
                currency=currency,
                type="commission",
                status="completed" if transfer.status == "succeeded" else "pending",
                metadata={"stripe_transfer_id": transfer.id}
            )
            
            return transaction
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    async def process_refund(
        transaction_id: str,
        amount: Optional[float] = None,
    ) -> Transaction:
        try:
            # מציאת התשלום המקורי
            original_transaction = await Transaction.get(transaction_id)
            if not original_transaction:
                raise HTTPException(status_code=404, detail="Transaction not found")
            
            # ביצוע ההחזר בסטרייפ
            refund = stripe.Refund.create(
                payment_intent=original_transaction.metadata["stripe_payment_intent_id"],
                amount=int(amount * 100) if amount else None,
            )
            
            # יצירת תיעוד ההחזר במערכת שלנו
            transaction = Transaction(
                user_id=original_transaction.user_id,
                amount=amount or original_transaction.amount,
                currency=original_transaction.currency,
                type="refund",
                status="completed" if refund.status == "succeeded" else "pending",
                metadata={
                    "stripe_refund_id": refund.id,
                    "original_transaction_id": transaction_id
                }
            )
            
            return transaction
        except stripe.error.StripeError as e:
            raise HTTPException(status_code=400, detail=str(e))

    @staticmethod
    async def get_transaction_history(user_id: str) -> list[Transaction]:
        """קבלת היסטוריית תשלומים של משתמש"""
        return await Transaction.filter(user_id=user_id).order_by("-created_at") 