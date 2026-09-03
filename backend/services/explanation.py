def generate_explanation(transaction, risk_result):
    risk_level = risk_result["risk_level"]
    amount = f"₹{transaction.amount:.0f}"

    if risk_level == "HIGH":
        reasons = ", ".join(risk_result["reasons"]).lower()

        return {
            "title": "Payment Paused for Your Safety",
            "message": f"Your payment of {amount} has been paused because it looks unusual.",
            "details": f"We noticed: {reasons}.",
            "action": "Please check the recipient and payment amount. Continue only if you recognize this payment."
        }

    if risk_level == "MEDIUM":
        reasons = ", ".join(risk_result["reasons"]).lower()

        return {
            "title": "Please Verify This Payment",
            "message": f"Your payment of {amount} needs your confirmation.",
            "details": f"We noticed: {reasons}.",
            "action": "Make sure you recognize the recipient and intended to make this payment."
        }

    return {
        "title": "Payment Allowed",
        "message": f"Your payment of {amount} appears normal.",
        "details": "No unusual activity was detected.",
        "action": "You can continue with your payment."
    }