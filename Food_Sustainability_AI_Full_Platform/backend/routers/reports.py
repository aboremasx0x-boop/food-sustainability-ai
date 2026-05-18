
from fastapi import APIRouter

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/esg")
def esg_report():
    return {
        "monthly_waste": "2.4 Tons",
        "saved_cost": "18,400 SAR",
        "co2_reduction": "32%"
    }
