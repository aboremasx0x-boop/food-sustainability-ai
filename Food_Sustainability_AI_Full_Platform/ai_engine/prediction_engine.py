
import pandas as pd

def predict_waste(dataframe):
    average = dataframe['waste_kg'].mean()

    if average > 50:
        return "High Waste Risk"
    return "Normal Waste Levels"
