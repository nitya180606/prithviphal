import joblib

encoders = joblib.load("encoders.pkl")

print("Season classes:")
print(encoders["Season"].classes_)