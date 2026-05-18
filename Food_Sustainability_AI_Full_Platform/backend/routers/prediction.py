
from fastapi import APIRouter
import random

router = APIRouter(prefix="/prediction", tags=["Prediction"])

@router.get("/forecast")
def forecast():
    return {
        "predicted_waste_tomorrow": f"{random.randint(5,15)}%",
        "high_risk_food": "Rice",
        "recommended_action": "Reduce buffet quantity"
    }
