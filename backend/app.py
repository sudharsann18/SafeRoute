from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
from sklearn.ensemble import RandomForestClassifier

app = Flask(__name__)
app.config['CORS_HEADERS'] = 'Content-Type'

# ✅ FIX CORS
CORS(app, resources={r"/*": {"origins": "*"}})

# ==============================
# 🚀 CREATE SMART DATASET
# ==============================
np.random.seed(42)
data_size = 1000

# Features
speed = np.random.randint(20, 120, data_size)
acceleration = np.random.uniform(-10, 10, data_size)
hour = np.random.randint(0, 24, data_size)
distance = np.random.uniform(1, 1000, data_size)

# 🚨 ADD NEW IMPORTANT FEATURES
danger_points = np.random.randint(0, 10, data_size)
turns = np.random.randint(0, 30, data_size)

# 🧠 SMART RISK LOGIC (REALISTIC)
risk = (
    (speed > 80).astype(int) +
    (np.abs(acceleration) > 6).astype(int) +
    ((hour > 21) | (hour < 5)).astype(int) +   # 🌙 night risk
    (distance > 300).astype(int) +
    (danger_points > 3).astype(int) +
    (turns > 15).astype(int)
)

# Threshold → high risk
risk = (risk >= 3).astype(int)

# Features matrix
X = np.column_stack((
    speed,
    acceleration,
    hour,
    distance,
    danger_points,
    turns
))

y = risk

# ==============================
# 🤖 TRAIN MODEL
# ==============================
model = RandomForestClassifier(n_estimators=150)
model.fit(X, y)

print("✅ Smart ML Model trained successfully")


# ==============================
# 🔥 HOME ROUTE
# ==============================
@app.route("/")
def home():
    return "🚀 SafeRoute ML Backend Running"


# ==============================
# 🔥 PREDICTION API
# ==============================
@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.get_json()

        # 🛡️ SAFE INPUTS
        speed = float(data.get("speed", 60))
        acceleration = float(data.get("acceleration", 0))
        hour = int(data.get("hour", 12))
        distance = float(data.get("distance", 100))
        danger_points = int(data.get("danger_points", 0))
        turns = int(data.get("turns", 5))

        input_data = np.array([[
            speed,
            acceleration,
            hour,
            distance,
            danger_points,
            turns
        ]])

        prediction = model.predict(input_data)[0]
        probability = model.predict_proba(input_data)[0][1]

        print("📊 INPUT:", input_data)
        print(f"⚠️ Risk: {prediction}, Confidence: {probability:.2f}")

        return jsonify({
            "risk": int(prediction),
            "confidence": float(round(probability, 2)),
            "message": "🚨 High Risk Route" if prediction == 1 else "✅ Safe Route"
        })

    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify({
            "error": "Prediction failed",
            "details": str(e)
        }), 500


# ==============================
# 🚀 RUN SERVER
# ==============================
if __name__ == "__main__":
    app.run(debug=True, port=5000)