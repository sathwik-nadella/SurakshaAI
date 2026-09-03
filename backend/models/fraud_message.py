from pydantic import BaseModel

class FraudMessage(BaseModel):
    message: str