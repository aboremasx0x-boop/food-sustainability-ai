
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/waste", tags=["Waste"])

class WasteData(BaseModel):
    restaurant: str
    food_type: str
    weight: float

@router.post("/analyze")
def analyze(data: WasteData):
    score = max(0, 100 - int(data.weight * 2))

    return {
        "restaurant": data.restaurant,
        "food_type": data.food_type,
        "estimated_weight": data.weight,
        "sustainability_score": score,
        "recommendation": "Reduce tomorrow production by 10%"
    }
