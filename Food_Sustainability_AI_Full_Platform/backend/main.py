
from fastapi import FastAPI
from routers import waste, reports, prediction

app = FastAPI(title="Food Sustainability AI")

app.include_router(waste.router)
app.include_router(reports.router)
app.include_router(prediction.router)

@app.get("/")
def root():
    return {"message": "Food Sustainability AI Running"}
