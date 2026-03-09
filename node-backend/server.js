require("dotenv").config();
const Groq = require("groq-sdk");
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const admin = require("./firebaseAdmin");
const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

/* ===============================
   BASIC ROUTES
================================ */

app.get("/", (req, res) => {
    res.send("Node Backend Running 🚀");
});

app.get("/test-ml", async (req, res) => {
    try {
        const response = await axios.get("http://127.0.0.1:5001/test");
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "ML Service not responding" });
    }
});

/* ===============================
   FIREBASE TOKEN VERIFICATION
================================ */

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

/* ===============================
   WEATHER API FUNCTION
================================ */

async function getAnnualRainfall(state) {
    try {
        const apiKey = process.env.WEATHER_API_KEY;
        console.log("Loaded API Key:", apiKey);

        const url = `https://api.openweathermap.org/data/2.5/weather?q=${state},IN&appid=${apiKey}`;

        const response = await axios.get(url);

        const humidity = response.data.main.humidity;

        // Temporary rainfall estimation logic
        const estimatedRainfall = humidity * 10;

        return estimatedRainfall;

    } catch (error) {
        console.error("Weather API error:", error.message);
        throw new Error("Weather fetch failed");
    }
}

/* ===============================
   PREDICT ROUTE (PROTECTED)
================================ */

app.post("/predict", verifyFirebaseToken, async (req, res) => {
    try {
        const farmerData = req.body;

        // Add Year
        farmerData.Year = new Date().getFullYear();

        // Fetch rainfall
        const rainfall = await getAnnualRainfall(farmerData.State);
        farmerData.Annual_Rainfall = rainfall;

        // Temporary soil moisture
        farmerData.Soil_Moisture = 30;

        console.log("Final Data Sent To Flask:", farmerData);

        // Call ML service
        const response = await axios.post(
            "http://127.0.0.1:5001/predict",
            farmerData
        );

        const predictedYield = response.data.predicted_yield;

        // Save to Firestore BEFORE sending response
        const db = admin.firestore();

        await db
            .collection("users")
            .doc(req.user.uid)
            .collection("predictions")
            .add({
                ...req.body,
                rainfall_used: rainfall,
                predicted_yield: predictedYield,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

        // Send response to client
        res.json({
            success: true,
            rainfall_used: rainfall,
            predicted_yield: predictedYield
        });

    } catch (error) {
        console.error("Prediction error:", error.response?.data || error.message);

        res.status(500).json({
            success: false,
            message: "ML prediction failed"
        });
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
        {
          role: "user",
          content: message
        }
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
// app.post("/api/chat", async (req, res) => {
//   try {
//     const { message } = req.body;
//     const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//     const result = await model.generateContent(
//       `You are a helpful crop and farming assistant for the CROP-PORTAL app. 
//        Answer only agriculture-related questions.
//        User asked: ${message}`
//     );

//     res.json({ reply: result.response.text() });
//   } catch (error) {
//     res.status(500).json({ error: "Gemini API error" });
//   }
// });
/* ===============================
   START SERVER
================================ */

app.listen(5000, () => {
    console.log("Node server running on port 5000");
});

console.log("API KEY FROM ENV:", process.env.WEATHER_API_KEY);