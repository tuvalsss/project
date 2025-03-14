from sqlmodel import Session, create_engine, select

from app.core.config import settings
from app.models import User, Campaign, CampaignAnalysis  # Import all models

engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

# Create all tables
from app.models import SQLModel
SQLModel.metadata.create_all(engine)

# make sure all SQLModel models are imported before initializing DB
# otherwise, SQLModel might fail to initialize relationships properly
# for more details: https://github.com/fastapi/full-stack-fastapi-template/issues/28


def get_session():
    with Session(engine) as session:
        yield session
