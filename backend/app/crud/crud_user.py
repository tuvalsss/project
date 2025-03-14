from typing import Any, Dict, Optional, Union
from uuid import UUID

from sqlmodel import Session, select

from app.core.security import get_password_hash, verify_password
from app.crud.base import CRUDBase
from app.models import User, UserCreate, UserUpdate


class CRUDUser(CRUDBase[User, UserCreate, UserUpdate]):
    def get_by_email(self, db: Session, *, email: str) -> Optional[User]:
        return db.exec(select(User).where(User.email == email)).first()

    def get_by_firebase_uid(self, db: Session, *, firebase_uid: str) -> Optional[User]:
        """
        קבלת משתמש לפי מזהה פיירבייס
        """
        return db.exec(select(User).where(User.firebase_uid == firebase_uid)).first()

    def authenticate(self, db: Session, *, email: str, password: str) -> Optional[User]:
        """
        אימות משתמש לפי אימייל וסיסמה
        """
        user = self.get_by_email(db, email=email)
        if not user:
            return None
        if not verify_password(password, user.hashed_password):
            return None
        return user

    def create(self, db: Session, *, obj_in: UserCreate) -> User:
        create_data = obj_in.dict(exclude_unset=True)
        if "password" in create_data:
            create_data["hashed_password"] = get_password_hash(create_data["password"])
            del create_data["password"]
        
        # אם יש טוקן פיירבייס, נשתמש בו
        if "firebase_token" in create_data:
            del create_data["firebase_token"]
            create_data["auth_provider"] = "firebase"
        else:
            create_data["auth_provider"] = "email"
        
        db_obj = User(**create_data)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def update(
        self, db: Session, *, db_obj: User, obj_in: Union[UserUpdate, Dict[str, Any]]
    ) -> User:
        if isinstance(obj_in, dict):
            update_data = obj_in
        else:
            update_data = obj_in.dict(exclude_unset=True)
        if "password" in update_data:
            hashed_password = get_password_hash(update_data["password"])
            del update_data["password"]
            update_data["hashed_password"] = hashed_password
        for field, value in update_data.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj

    def is_active(self, user: User) -> bool:
        return user.is_active

    def is_superuser(self, user: User) -> bool:
        return user.is_superuser


crud_user = CRUDUser(User) 