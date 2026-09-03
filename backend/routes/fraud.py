from fastapi import APIRouter
from models.fraud_message import FraudMessage
from services.fraud_detector import detect_fraud

router = APIRouter()

@router.post("/fraud/analyze")
def analyze_fraud(message: FraudMessage):
    result = detect_fraud(message.message)

    return {
        "message": message.message,
        **result
    }