def calculate_risk(transaction):
    score = 0
    reasons = []

    if transaction.is_new_recipient:
        score += 20
        reasons.append("New recipient")

    if transaction.amount > transaction.usual_amount * 3:
        score += 25
        reasons.append("Transaction amount is much higher than usual")

    if transaction.amount > transaction.usual_amount * 5:
        score += 15
        reasons.append("Transaction amount is extremely high compared to usual")

    if transaction.transaction_hour < 6 or transaction.transaction_hour > 23:
        score += 10
        reasons.append("Transaction at an unusual time")
    if transaction.is_new_device:
      score += 25
      reasons.append("Transaction from a new device")

    if score >= 60:
        risk_level = "HIGH"
        action = "HOLD"
    elif score >= 30:
        risk_level = "MEDIUM"
        action = "VERIFY"
    else:
        risk_level = "LOW"
        action = "ALLOW"

    return {
        "risk_score": min(score, 100),
        "risk_level": risk_level,
        "action": action,
        "reasons": reasons
    }