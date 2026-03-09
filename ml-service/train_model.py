import pandas as pd
import xgboost as xgb
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import r2_score
import joblib

# Load dataset
df = pd.read_csv("crop_yield_final.csv")

# Clean string columns (remove extra spaces)
for column in ['Crop', 'Season', 'State']:
    df[column] = df[column].str.strip()

# Encode categorical columns
label_encoders = {}

for column in ['Crop', 'Season', 'State']:
    le = LabelEncoder()
    df[column] = le.fit_transform(df[column])
    label_encoders[column] = le

# Features and target
X = df.drop("Yield", axis=1)
y = df["Yield"]

# Train test split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# XGBoost model
model = xgb.XGBRegressor(
    n_estimators=200,
    learning_rate=0.1,
    max_depth=6,
    random_state=42
)

model.fit(X_train, y_train)

# Predictions
y_pred = model.predict(X_test)

# Evaluate
score = r2_score(y_test, y_pred)
print("R2 Score:", score)

# Save model and encoders
joblib.dump(model, "model.pkl")
joblib.dump(label_encoders, "encoders.pkl")

print("Model saved successfully.")