import React, { useState } from 'react';
import { auth } from '../firebase/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';

const LandingPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (error) {
      alert("Login Error: " + error.message);
    }
  };

  return (
    <div className="split-background">
      <div className="login-card">
        {/* Main Logo in Card */}
        <img 
          src="/logo.png" 
          alt="PrithviPhal Logo" 
          style={{ width: '90px', marginBottom: '10px' }} 
        />
        
        <h1 className="portal-title">PrithviPhal</h1>
        <p className="member-portal-text">MEMBER PORTAL</p>

        <form onSubmit={handleLogin}>
          <div className="input-container">
            <span className="input-icon">👤</span>
            <input 
              className="login-input"
              type="email" 
              placeholder="Username or Email Address" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="input-container">
            <span className="input-icon">🔒</span>
            <input 
              className="login-input"
              type="password" 
              placeholder="Password" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn-login">Log In</button>
        </form>

        <p style={{ marginTop: '25px', fontSize: '0.9rem', color: '#444' }}>
          Don't have an account? <Link to="/register" style={{ color: '#5d8a66', fontWeight: 'bold', textDecoration: 'none' }}>Create one.</Link>
        </p>
      </div>
    </div>
  );
};

export default LandingPage;