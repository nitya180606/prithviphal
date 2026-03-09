import pandas as pd

# Load dataset
df = pd.read_csv("crop_yield_final.csv")

print("Shape of dataset:", df.shape)
print("\nColumns:")
print(df.columns)

print("\nMissing values:")
print(df.isnull().sum())

print("\nFirst 5 rows:")
print(df.head())