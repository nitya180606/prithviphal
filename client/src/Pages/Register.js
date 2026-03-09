import React, { useState } from 'react';
// 1. Make sure 'db' is imported here alongside 'auth'
import { auth, db } from '../firebase/firebase'; 
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate, Link } from 'react-router-dom';
// 2. Firestore imports
import { doc, setDoc } from "firebase/firestore"; 

const Register = () => {
  const [username, setUsername] = useState(""); 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      // 1. Create the Auth account
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Set the displayName in Firebase Auth (Good practice)
      await updateProfile(user, {
        displayName: username
      });

      // 3. Save the username to the Firestore "users" collection
      // We use user.uid as the document ID to link Auth and Firestore
      await setDoc(doc(db, "users", user.uid), {
        username: username,
        email: email,
        createdAt: new Date()
      });

      alert("Account created! Please log in.");
      navigate("/");
    } catch (error) {
      // Improved error message
      alert(error.message);
    }
  };

  return (
    <div className="split-background">
      <div className="login-card">
        <img src="/logo.png" alt="Logo" style={{ width: '70px', marginBottom: '10px' }} />
        <h1 className="portal-title">PrithviPhal</h1>
        <p className="member-portal-text">Create Account</p>

        <form onSubmit={handleRegister}>
          {/* Username Input Field */}
          <div className="input-container">
            <span className="input-icon">👤</span>
            <input 
              className="login-input"
              type="text" 
              placeholder="Enter Full Name / Username" 
              onChange={(e) => setUsername(e.target.value)} 
              required 
            />
          </div>

          {/* Email Input Field */}
          <div className="input-container">
            <span className="input-icon">📧</span>
            <input 
              className="login-input"
              type="email" 
              placeholder="Enter Email Address" 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          {/* Password Input Field */}
          <div className="input-container">
            <span className="input-icon">🔒</span>
            <input 
              className="login-input"
              type="password" 
              placeholder="Create Password" 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn-login">Register</button>
        </form>

        <p style={{ marginTop: '25px', fontSize: '0.9rem' }}>
          Already a member? <Link to="/" style={{ color: '#5d8a66', fontWeight: 'bold', textDecoration: 'none' }}>Log in here.</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;