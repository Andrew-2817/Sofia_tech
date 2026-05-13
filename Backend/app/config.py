from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:18122005@localhost:5432/sofia_tech_db"
    SECRET_KEY: str = "your-super-secret-key-change-me-1234567890"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    model_config = {
        "env_file": ".env",
        "extra": "ignore"
    }

settings = Settings()