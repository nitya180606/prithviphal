# 🌾 PrithviPhal — Crop Yield Prediction & Farmer Assistance Portal

> An intelligent agricultural web platform that empowers farmers with data-driven crop yield predictions using Machine Learning.

---

## 📌 About The Project

**PrithviPhal** is a full-stack web application that helps farmers predict crop yield using machine learning. Farmers enter basic farm details like crop type, season, state, area, fertilizer, and pesticide usage. The system automatically fetches real-time rainfall data and runs it through a trained ML model to estimate yield in **tons per hectare**.

Built as part of Mini Project — Final Review at **B V Raju Institute of Technology (BVRIT)**, Department of Computer Science and Engineering.

---

## ✨ Features

- 🔐 **Secure Authentication** — Firebase-powered login and signup
- 🌱 **Crop Yield Prediction** — XGBoost ML model trained on historical agricultural data
- 🌧️ **Real-time Rainfall Fetch** — Automatically fetches live weather data
- 📊 **Prediction History** — All past predictions saved and accessible
- 🤖 **AI Farming Assistant** — Groq-powered chatbot for farming advice
- 📍 **Live Weather Updates** — Current weather shown on dashboard

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js |
| Backend | Node.js + Express |
| ML Service | Flask + Python |
| ML Algorithm | XGBoost |
| Database & Auth | Firebase Firestore |
| AI Chatbot | Groq API |
| Weather Data | OpenWeatherMap API |

---

## 🏗️ Project Structure

```
prithviphal/
├── client/                  # React Frontend
│   ├── public/
│   └── src/
│       ├── Components/      # Reusable UI components
│       │   ├── Navbar.js
│       │   ├── PredictionForm.js
│       │   ├── PredictionTable.js
│       │   ├── AnalyticsCards.js
│       │   └── ChatWidget.js
│       ├── Pages/           # Application pages
│       │   ├── LandingPage.js
│       │   ├── Dashboard.js
│       │   └── Register.js
│       └── firebase/
│           └── firebase.js
│
├── node-backend/            # Node.js Backend (API Gateway)
│   ├── server.js
│   ├── firebaseAdmin.js
│   └── package.json
│
└── ml-service/              # Flask ML Microservice
    ├── app.py
    ├── train_model.py
    ├── model.pkl
    ├── encoders.pkl
    └── requirements.txt
```

---

## ⚙️ How It Works

```
Farmer fills form (React)
        ↓
Node.js fetches real-time rainfall
        ↓
Flask receives 7 inputs
        ↓
XGBoost model predicts yield
        ↓
Result saved to Firebase + shown to farmer
```

---

## 🧠 ML Algorithm — XGBoost

The core prediction engine uses **XGBoost Regression**:

- Takes 7 inputs: Crop Type, Season, State, Area, Fertilizer, Pesticide, Rainfall
- Builds hundreds of gradient-boosted decision trees
- Each tree corrects the errors of the previous one
- Returns yield prediction in **tons/hectare**

**Feature Importance:**
| Feature | Importance |
|---|---|
| Rainfall | 35% |
| Fertilizer | 28% |
| Crop Type | 20% |
| State | 10% |
| Area | 7% |

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js installed
- Python 3.x installed
- Firebase project set up

### 1. Clone the repository
```bash
git clone https://github.com/nitya180606/prithviphal.git
cd prithviphal
```

### 2. Start the React Frontend
```bash
cd client
npm install
npm start
```

### 3. Start the Node.js Backend
```bash
cd node-backend
npm install
node server.js
```

### 4. Start the Flask ML Service
```bash
cd ml-service
pip install -r requirements.txt
python app.py
```

---

## 🔐 Environment Variables

Create a `.env` file in `node-backend/` with:
```
WEATHER_API_KEY=your_openweathermap_key
GROQ_API_KEY=your_groq_key
```

Create a `.env` file in `client/` with:
```
REACT_APP_FIREBASE_API_KEY=your_firebase_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
```

> ⚠️ Never push `.env` files or `firebaseServiceAccountKey.json` to GitHub.

---

## 👩‍💻 Developed By

| Name | Roll Number |
|---|---|
| P. Sri Nithya | 23211A05N0 |

**Guided By:** Mrs. G. Prathyusha, Assistant Professor
**Institution:** B V Raju Institute of Technology (BVRIT), CSE Department

---

## 📚 References

- XGBoost Documentation — [xgboost.readthedocs.io](https://xgboost.readthedocs.io)
- Firebase Documentation — [firebase.google.com/docs](https://firebase.google.com/docs)
- OpenWeatherMap API — [openweathermap.org/api](https://openweathermap.org/api)

---

## 📄 License

This project was developed for academic purposes at BVRIT.
