import pandas as pd
from sklearn.neighbors import NearestNeighbors
import joblib

# Sample provider data
data = {
    'rating': [4.8, 4.5, 4.2],
    'experience': [5, 3, 2],
    'bookings': [120, 90, 50]
}

# Create DataFrame
df = pd.DataFrame(data)

# Features
X = df[['rating', 'experience', 'bookings']]

# KNN Model
model = NearestNeighbors(n_neighbors=2)

# Train model
model.fit(X)

# Save model
joblib.dump(model, 'provider_model.pkl')

print("Model Saved Successfully")