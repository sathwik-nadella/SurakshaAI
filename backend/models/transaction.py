from pydantic import BaseModel

class Transaction(BaseModel):
    user_id: int
    amount: float
    is_new_recipient: bool
    usual_amount: float
    transaction_hour: int
    is_new_device: bool