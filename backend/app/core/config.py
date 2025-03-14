import secrets
import warnings
from typing import Annotated, Any, Literal, List, Optional, Union

from pydantic import (
    AnyUrl,
    BeforeValidator,
    EmailStr,
    HttpUrl,
    PostgresDsn,
    computed_field,
    model_validator,
    field_validator,
)
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing_extensions import Self


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",")]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        # Use top level .env file (one level above ./backend/)
        env_file="../.env",
        env_ignore_empty=True,
        extra="ignore",
    )
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = secrets.token_urlsafe(32)
    # 60 minutes * 24 hours * 8 days = 8 days
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8
    FRONTEND_HOST: str = "http://localhost:5173"
    ENVIRONMENT: Literal["local", "staging", "production"] = "local"

    BACKEND_CORS_ORIGINS: List[str] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            return v
        raise ValueError(v)

    PROJECT_NAME: str
    SENTRY_DSN: HttpUrl | None = None
    POSTGRES_SERVER: str
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = ""

    @computed_field  # type: ignore[prop-decorator]
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        return MultiHostUrl.build(
            scheme="postgresql+psycopg",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        )

    SMTP_TLS: bool = True
    SMTP_SSL: bool = False
    SMTP_PORT: Optional[int] = None
    SMTP_HOST: Optional[str] = None
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None
    EMAILS_FROM_EMAIL: Optional[EmailStr] = None
    EMAILS_FROM_NAME: Optional[str] = None

    @field_validator("EMAILS_FROM_NAME")
    def get_project_name(cls, v: Optional[str], values: dict) -> str:
        if not v:
            return values["PROJECT_NAME"]
        return v

    EMAIL_RESET_TOKEN_EXPIRE_HOURS: int = 48
    EMAIL_TEMPLATES_DIR: str = "/app/app/email-templates/build"
    EMAILS_ENABLED: bool = False

    @field_validator("EMAILS_ENABLED", mode="before")
    def get_emails_enabled(cls, v: bool, values: dict) -> bool:
        return bool(
            values.get("SMTP_HOST")
            and values.get("SMTP_PORT")
            and values.get("EMAILS_FROM_EMAIL")
        )

    EMAIL_TEST_USER: EmailStr = "test@example.com"
    FIRST_SUPERUSER: EmailStr
    FIRST_SUPERUSER_PASSWORD: str
    USERS_OPEN_REGISTRATION: bool = False

    # Firebase Configuration
    FIREBASE_DATABASE_URL: str
    FIREBASE_PROJECT_ID: str
    FIREBASE_PRIVATE_KEY_ID: str
    FIREBASE_PRIVATE_KEY: str
    FIREBASE_CLIENT_EMAIL: str
    FIREBASE_CLIENT_ID: str
    FIREBASE_AUTH_URI: str
    FIREBASE_TOKEN_URI: str
    FIREBASE_PROVIDER_CERT: str
    FIREBASE_CLIENT_CERT: str

    # OpenAI API
    OPENAI_API_KEY: str

    # Facebook API
    FACEBOOK_APP_ID: str
    FACEBOOK_APP_SECRET: str
    FACEBOOK_ACCESS_TOKEN: str

    # Google Ads
    GOOGLE_ADS_CUSTOMER_ID: str
    GOOGLE_ADS_DEVELOPER_TOKEN: str
    GOOGLE_ADS_CLIENT_ID: str
    GOOGLE_ADS_CLIENT_SECRET: str
    GOOGLE_ADS_REFRESH_TOKEN: str

    # Instagram API (using Facebook API)
    INSTAGRAM_BUSINESS_ACCOUNT_ID: str

    # AI Configuration
    AI_MODEL_VERSION: str = "gpt-4"
    AI_TEMPERATURE: float = 0.7
    AI_MAX_TOKENS: int = 2000

    # Affiliate System
    MIN_PAYOUT_AMOUNT: float = 50.0
    DEFAULT_COMMISSION_RATE: float = 0.1
    REFERRAL_CODE_LENGTH: int = 8

    # Campaign Settings
    CAMPAIGN_STATUS_OPTIONS: List[str] = ["draft", "active", "paused", "completed"]
    PLATFORM_OPTIONS: List[str] = ["facebook", "instagram", "google"]
    MIN_CAMPAIGN_BUDGET: float = 10.0

    def _check_default_secret(self, var_name: str, value: str | None) -> None:
        if value == "changethis":
            message = (
                f'The value of {var_name} is "changethis", '
                "for security, please change it, at least for deployments."
            )
            if self.ENVIRONMENT == "local":
                warnings.warn(message, stacklevel=1)
            else:
                raise ValueError(message)

    @model_validator(mode="after")
    def _enforce_non_default_secrets(self) -> Self:
        self._check_default_secret("SECRET_KEY", self.SECRET_KEY)
        self._check_default_secret("POSTGRES_PASSWORD", self.POSTGRES_PASSWORD)
        self._check_default_secret(
            "FIRST_SUPERUSER_PASSWORD", self.FIRST_SUPERUSER_PASSWORD
        )

        return self

    def check_default_values(self) -> None:
        """
        בדיקת ערכים ברירת מחדל שצריכים להיות מוחלפים
        """
        default_values = {
            "SECRET_KEY": "changethis",
            "POSTGRES_PASSWORD": "changethis",
            "FIRST_SUPERUSER_PASSWORD": "changethis",
        }

        for key, default_value in default_values.items():
            if hasattr(self, key) and getattr(self, key) == default_value:
                warnings.warn(
                    f"The value of {key} is \"{default_value}\", for security, "
                    "please change it, at least for deployments.",
                    stacklevel=1,
                )


settings = Settings()  # type: ignore
settings.check_default_values()
