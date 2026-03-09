import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../firebase/firebase';
import { signOut } from 'firebase/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: '15px 50px', background: 'var(--bg-card)',
      borderBottom: '1px solid var(--border)',
      boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <h2 style={{ color: '#4ade80', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.png" alt="Logo" style={{ height: '40px' }} />
          PrithviPhal
        </h2>
      </div>

      <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
        {user ? (
          <>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: 'var(--text-primary)', fontWeight: '500' }}>
              Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="btn-main"
              style={{ padding: '8px 15px', background: '#e74c3c', boxShadow: 'none' }}
            >
              Logout
            </button>
          </>
        ) : (
          <Link to="/" style={{ textDecoration: 'none', color: '#4ade80', fontWeight: 'bold' }}>
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;