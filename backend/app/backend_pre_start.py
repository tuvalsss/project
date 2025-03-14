import logging

from sqlalchemy.engine import Engine # type: ignore
from sqlmodel import Session, select # type: ignore
from tenacity import after_log, before_log, retry, stop_after_attempt, wait_fixed # type: ignore

from app.core.db import engine
from app.core.config import settings
from app.models import User, UserCreate
from app import crud

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

max_tries = 60 * 5  # 5 minutes
wait_seconds = 1


@retry(
    stop=stop_after_attempt(max_tries),
    wait=wait_fixed(wait_seconds),
    before=before_log(logger, logging.INFO),
    after=after_log(logger, logging.WARN),
)
def init() -> None:
    try:
        # Try to create session to check if DB is awake
        with Session(engine) as session:
            # Create initial superuser if not exists
            user = session.exec(
                select(User).where(User.email == settings.FIRST_SUPERUSER)
            ).first()
            if not user:
                user_in = UserCreate(
                    email=settings.FIRST_SUPERUSER,
                    password=settings.FIRST_SUPERUSER_PASSWORD,
                    is_superuser=True,
                )
                user = crud.create_user(session=session, user_create=user_in)
                logger.info("Initial superuser created")
    except Exception as e:
        logger.error(e)
        raise e


def main() -> None:
    logger.info("Initializing service")
    init()
    logger.info("Service finished initializing")


if __name__ == "__main__":
    main()
