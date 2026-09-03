from pathlib import Path
import joblib

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / "fraud_model.joblib"

model = joblib.load(MODEL_PATH)

def detect_fraud(message):
    probability = float(model.predict_proba([message])[0][1])

    reasons = []
    text = message.lower()

    if "otp" in text:
        reasons.append("Requests OTP")

    if "password" in text or "pin" in text:
        reasons.append("Requests sensitive banking information")

    if "immediately" in text or "urgent" in text or "hurry" in text:
        reasons.append("Creates urgency")

    if "suspended" in text or "blocked" in text or "closed" in text:
        reasons.append("Threatens account restriction")

    if "click" in text or "link" in text or "verify" in text:
        reasons.append("Requests a verification action")

    if probability >= 0.75:
        risk_level = "HIGH"
        fraud_detected = True
    elif probability >= 0.45:
        risk_level = "MEDIUM"
        fraud_detected = False
    else:
        risk_level = "LOW"
        fraud_detected = False

    if not reasons and fraud_detected:
        reasons.append("Message matches known fraud patterns")

    return {
        "fraud_probability": round(probability, 4),
        "risk_level": risk_level,
        "fraud_detected": fraud_detected,
        "reasons": reasons
    }