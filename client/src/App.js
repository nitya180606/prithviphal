import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import LandingPage from './Pages/LandingPage';
import Register from './Pages/Register';
import Dashboard from './Pages/Dashboard';
import Navbar from './Components/Navbar';
import './App.css';

// Component to handle conditional Navbar rendering
const Layout = ({ children }) => {
  const location = useLocation();
  // Hide navbar on Landing (/) and Register (/register)
  const showNavbar = location.pathname !== '/' && location.pathname !== '/register';

  return (
    <>
      {showNavbar && <Navbar />}
      {children}
    </>
  );
};

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;