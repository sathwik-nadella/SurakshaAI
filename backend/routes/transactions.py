from fastapi import APIRouter
from models.transaction import Transaction
from services.risk_engine import calculate_risk
from services.explanation import generate_explanation

router = APIRouter()

@router.post("/transactions/analyze")
def analyze_transaction(transaction: Transaction):
    result = calculate_risk(transaction)
    explanation = generate_explanation(transaction, result)

    return {
        **result,
        "explanation": explanation
    }