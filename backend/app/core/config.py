from pydantic_settings import BaseSettings
from typing import Optional, List


class Settings(BaseSettings):
    PROJECT_NAME: str = "OP ASCEND AI Agent"
    VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/v1"

    # Database
    DATABASE_URL: str = "postgresql+psycopg://postgres:postgres@localhost:5432/op_ascend"

    # JWT
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 15
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"

    # Gemini AI
    GEMINI_API_KEY: Optional[str] = None

    # Gemini model configuration
    GEMINI_MODEL: str = "gemini-3-flash-preview"
    GEMINI_TEMPERATURE: float = 0.7
    GEMINI_MAX_TOKENS: int = 2048

    # Conversation memory
    CONVERSATION_MEMORY_ENABLED: bool = True
    CONVERSATION_MEMORY_TTL_SECONDS: int = 3600
    MAX_CONVERSATION_HISTORY: int = 20

    # System prompt path
    SYSTEM_PROMPT_PATH: str = "/app/system_prompt.txt"

    # CORS
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:5173", "http://localhost:3000", "http://localhost:8000"]

    # Logging
    LOG_LEVEL: str = "INFO"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True


settings = Settings()
