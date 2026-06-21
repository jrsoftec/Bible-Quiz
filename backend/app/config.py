from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict


env_path = Path(__file__).resolve().parent.parent / '.env'
env_sample_path = Path(__file__).resolve().parent.parent / '.env.sample'

if env_path.exists():
    load_dotenv(env_path)
elif env_sample_path.exists():
    load_dotenv(env_sample_path)


class Settings(BaseSettings):
    database_url: str = 'sqlite:///./bible_quiz.db'
    secret_key: str
    access_token_expire_minutes: int = 1440
    admin_email: str
    admin_password: str

    model_config = SettingsConfigDict(
        case_sensitive=False,
    )


settings = Settings()
