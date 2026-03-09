from flask import Flask, request, jsonify
import joblib
import pandas as pd

app = Flask(__name__)

# Load model and encoders
model = joblib.load("model.pkl")
encoders = joblib.load("encoders.pkl")

@app.route("/")
def home():
    return "Flask ML Home Running"
    
@app.route("/test")
def test():
    return "ML Service Running"


@app.route("/predict", methods=["POST"])
def predict():
    data = request.json

    input_df = pd.DataFrame([data])

    for column in ['Crop', 'Season', 'State']:
        input_df[column] = input_df[column].str.strip()

    # 🔥 ADD THIS BLOCK HERE (VERY IMPORTANT)
    numeric_columns = [
        'Year',
        'Area',
        'Annual_Rainfall',
        'Fertilizer',
        'Pesticide',
        'Soil_Moisture'
    ]
    # Convert numeric columns to appropriate data types
    for column in numeric_columns:
        input_df[column] = pd.to_numeric(input_df[column], errors='coerce')

    # Encode
    for column in ['Crop', 'Season', 'State']:
        input_df[column] = encoders[column].transform(input_df[column])
    # Ensure correct feature order
    feature_order = [
        'Crop',
        'Year',
        'Season',
        'State',
        'Area',
        'Annual_Rainfall',
        'Fertilizer',
        'Pesticide',
        'Soil_Moisture'
    ]

    input_df = input_df[feature_order]

    prediction = model.predict(input_df)

    return jsonify({
        "predicted_yield": float(prediction[0])
    })
if __name__ == "__main__":
    app.run(port=5001)