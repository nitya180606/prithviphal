from flask import Flask, request, jsonify
import joblib
import pandas as pd
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

try:
    model = joblib.load(os.path.join(BASE_DIR, "model.pkl"))
    encoders = joblib.load(os.path.join(BASE_DIR, "encoders.pkl"))
    print("✅ Model and encoders loaded successfully")
except Exception as e:
    print("❌ Error loading model:", e)

@app.route("/")
def home():
    return "Flask ML Service Running"

@app.route("/test")
def test():
    return "ML Service Running"

@app.route("/predict", methods=["POST"])
def predict():
    data = request.json
    input_df = pd.DataFrame([data])

    for column in ['Crop', 'Season', 'State']:
        input_df[column] = input_df[column].str.strip()

    numeric_columns = ['Year', 'Area', 'Annual_Rainfall', 'Fertilizer', 'Pesticide', 'Soil_Moisture']
    for column in numeric_columns:
        input_df[column] = pd.to_numeric(input_df[column], errors='coerce')

    for column in ['Crop', 'Season', 'State']:
        input_df[column] = encoders[column].transform(input_df[column])

    feature_order = ['Crop', 'Year', 'Season', 'State', 'Area', 'Annual_Rainfall', 'Fertilizer', 'Pesticide', 'Soil_Moisture']
    input_df = input_df[feature_order]

    prediction = model.predict(input_df)

    return jsonify({"predicted_yield": float(prediction[0])})

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)