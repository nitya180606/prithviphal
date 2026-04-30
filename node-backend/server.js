require("dotenv").config();
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const admin = require("./firebaseAdmin");
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://prithviphal-frontend.onrender.com"
  ]
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.send("Node Backend Running 🚀");
});

app.get("/test-ml", async (req, res) => {
    try {
        const response = await axios.get(`${process.env.ML_SERVICE_URL}/test`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "ML Service not responding" });
    }
});

async function verifyFirebaseToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split("Bearer ")[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

async function getAnnualRainfall(state) {
    try {
        const apiKey = process.env.WEATHER_API_KEY;
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${state},IN&appid=${apiKey}`;
        const response = await axios.get(url);
        const humidity = response.data.main.humidity;
        const estimatedRainfall = humidity * 10;
        return estimatedRainfall;
    } catch (error) {
        console.error("Weather API error:", error.message);
        throw new Error("Weather fetch failed");
    }
}

app.post("/predict", verifyFirebaseToken, async (req, res) => {
    try {
        const farmerData = req.body;
        farmerData.Year = new Date().getFullYear();
        const rainfall = await getAnnualRainfall(farmerData.State);
        farmerData.Annual_Rainfall = rainfall;
        farmerData.Soil_Moisture = 30;

        console.log("Final Data Sent To Flask:", farmerData);

        const response = await axios.post(
            `${process.env.ML_SERVICE_URL}/predict`,
            farmerData
        );

        const predictedYield = response.data.predicted_yield;
        const db = admin.firestore();

        await db.collection("users").doc(req.user.uid).collection("predictions").add({
            ...req.body,
            rainfall_used: rainfall,
            predicted_yield: predictedYield,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.json({
            success: true,
            rainfall_used: rainfall,
            predicted_yield: predictedYield
        });

    } catch (error) {
        console.error("Prediction error:", error.response?.data || error.message);
        res.status(500).json({ success: false, message: "ML prediction failed" });
    }
});

app.post("/api/chat", async (req, res) => {
    try {
        const { message } = req.body;
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [
                {
                    role: "system",
                    content: `You are a helpful crop and farming assistant for the CROP-PORTAL app. 
                              Answer only agriculture-related questions. Keep answers concise and helpful.`
                },
                { role: "user", content: message }
            ],
            max_tokens: 512,
        });
        const reply = completion.choices[0]?.message?.content || "No response";
        res.json({ reply });
    } catch (error) {
        console.error("Groq error:", error.message);
        res.status(500).json({ error: "Groq API error", details: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Node server running on port ${PORT}`);
});