from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "StockWise"
    API_V1_STR: str = "/api"
    # Using SQLite by default for the hackathon MVP
    SQLALCHEMY_DATABASE_URI: str = "sqlite:///./stockwise.db"
    
    # AI API configuration
    AI_API_KEY: str = ""
    AI_PROVIDER: str = "mock" # options: 'mock', 'openai', 'gemini'

    class Config:
        env_file = ".env"

settings = Settings()
