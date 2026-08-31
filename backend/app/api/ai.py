from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict, Any, Optional

router = APIRouter()

class ChatRequest(BaseModel):
    message: str
    context: Optional[Dict[str, Any]] = None

@router.get("/suggestions")
def get_ai_suggestions():
    return [
        "What should I buy today?",
        "Where is my money stuck?",
        "Which products may stock out?",
        "I only have ₹10,000. What should I buy?"
    ]

@router.post("/chat")
def chat_with_ai(request: ChatRequest):
    return {
        "id": "1",
        "role": "assistant",
        "content": "I am a mock AI assistant. To enable real AI, add an LLM API key to your backend configuration.",
        "timestamp": "2026-08-31T00:00:00Z"
    }
