import ChatWidget from "../Components/ChatWidget";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, query, orderBy, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import AnalyticsCards from "../Components/AnalyticsCards";
import PredictionForm from "../Components/PredictionForm";
import PredictionTable from "../Components/PredictionTable";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [result, setResult] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [predicting, setPredicting] = useState(false);

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    Crop: "", Season: "", State: "", Area: "", Fertilizer: "", Pesticide: ""
  });

  const fetchLocalWeather = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const API_KEY = "3fb85cf9030633f188ca72c5b752d9f3";
          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
          );
          setWeather(response.data);
        } catch (err) {
          console.error("Error fetching local weather:", err);
        } finally {
          setWeatherLoading(false);
        }
      }, (error) => {
        console.error("Geolocation denied", error);
        setWeatherLoading(false);
      });
    } else {
      setWeatherLoading(false);
    }
  };

  const fetchPredictions = async (uid) => {
    try {
      const q = query(collection(db, "users", uid, "predictions"), orderBy("createdAt", "desc"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setPredictions(data);
    } catch (err) {
      console.error("Error fetching predictions:", err);
    }
  };

  const fetchUserDetails = async (uid) => {
    try {
      const userDocRef = doc(db, "users", uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) setUserData(userDocSnap.data());
    } catch (err) {
      console.error("Error fetching user details:", err);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        navigate("/");
      } else {
        setUser(currentUser);
        await fetchUserDetails(currentUser.uid);
        await fetchPredictions(currentUser.uid);
        fetchLocalWeather();
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    if (!user) return;
    setPredicting(true);
    try {
      const token = await user.getIdToken();
      const response = await axios.post("https://prithviphal-backend.onrender.com/predict", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setResult(response.data);
      await fetchPredictions(user.uid);
    } catch (error) {
      alert("Prediction failed");
    } finally {
      setPredicting(false);
    }
  };

  const averageYield = predictions.length > 0
    ? (predictions.reduce((sum, p) => sum + Number(p.predicted_yield), 0) / predictions.length).toFixed(2)
    : 0;
  const highestYield = predictions.length > 0
    ? Math.max(...predictions.map((p) => Number(p.predicted_yield))).toFixed(2)
    : 0;

  return (
    <div className="dashboard-container">

      {/* ── HEADER ── */}
      <header style={{
        marginBottom: '32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
      }}>
        <div>
          <p style={{ fontSize: '0.75rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '2px', color: 'var(--text-muted)', marginBottom: '6px' }}>
            Dashboard
          </p>
          <h2 style={{ fontSize: '1.8rem', fontWeight: '800', margin: 0, letterSpacing: '-0.5px' }}>
            Welcome back,{' '}
            <span style={{ color: 'var(--primary)' }}>
              {userData?.username || user?.email?.split('@')[0] || 'Farmer'}
            </span>{' '}
            <span style={{ fontSize: '1.5rem' }}>👋</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', marginTop: '4px', fontSize: '0.9rem' }}>
            Here's your farm productivity overview
          </p>
        </div>

        {/* Weather Widget */}
        <div className="weather-card">
          {weatherLoading ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              📡 Detecting location...
            </div>
          ) : weather ? (
            <>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="weather"
                style={{ width: '52px', height: '52px' }}
              />
              <div>
                <div className="weather-city">{weather.name}</div>
                <div className="weather-temp">{Math.round(weather.main.temp)}°C</div>
                <div className="weather-desc">{weather.weather[0].description}</div>
              </div>
            </>
          ) : (
            <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              ⚠️ Weather unavailable
            </div>
          )}
        </div>
      </header>

      {/* ── ANALYTICS CARDS ── */}
      <AnalyticsCards predictions={predictions} avg={averageYield} high={highestYield} />

      {/* ── MAIN GRID ── */}
      <div className="main-grid">
        <PredictionForm handleChange={handleChange} handlePredict={handlePredict} predicting={predicting} />

        {/* Result Card */}
        <div className="glass-card result-card">
          <div className="section-header">
            <div className="section-dot" style={{ background: '#fde047', boxShadow: '0 0 8px #fde047' }} />
            <h3>Latest Result</h3>
          </div>

          {result ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>
                Estimated Yield
              </p>
              <div style={{
                fontSize: '4rem',
                fontWeight: '800',
                fontFamily: 'DM Mono, monospace',
                color: 'var(--primary)',
                lineHeight: 1,
                textShadow: '0 0 40px rgba(74,222,128,0.3)',
              }}>
                {Number(result.predicted_yield).toFixed(2)}
              </div>
              <div style={{ color: 'var(--text-muted)', fontSize: '1rem', marginTop: '6px', marginBottom: '20px' }}>
                tons / hectare
              </div>
              <div style={{
                background: 'rgba(74,222,128,0.08)',
                border: '1px solid rgba(74,222,128,0.15)',
                borderRadius: '10px',
                padding: '10px 16px',
                display: 'inline-block',
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
              }}>
                💧 Rainfall used: <strong style={{ fontFamily: 'DM Mono, monospace' }}>{result.rainfall_used} mm</strong>
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '50px 20px' }}>
              <span style={{ fontSize: '3rem' }}>⚡</span>
              <p>Submit the form to generate<br />an AI yield prediction</p>
            </div>
          )}
        </div>
      </div>

      {/* ── PREDICTION TABLE ── */}
      <PredictionTable predictions={predictions} />

      {/* ── AI CHAT WIDGET ── */}
      <ChatWidget />

    </div>
  );
}