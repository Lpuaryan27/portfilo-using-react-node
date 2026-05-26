import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserPlus, FaSignInAlt, FaCompass, FaChevronLeft } from 'react-icons/fa';
import axios from 'axios';

import { API_URL } from './config';

const AICareerPortal = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const endpoint = isLogin ? '/auth/login' : '/auth/signup';
    const payload = isLogin ? { email, password } : { name, email, password };

    try {
      const response = await axios.post(`${API_URL}${endpoint}`, payload);
      if (response.data.success) {
        localStorage.setItem('careerUser', JSON.stringify(response.data.user));
        localStorage.setItem('careerToken', response.data.token);
        navigate('/ai-career/dashboard');
      } else {
        setError(response.data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Connection error with backend server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '40px 20px',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Back button */}
      <button 
        onClick={() => navigate('/')} 
        style={{
          position: 'absolute',
          top: '30px',
          left: '30px',
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '30px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '0.9rem',
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.1)'}
        onMouseLeave={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.05)'}
      >
        <FaChevronLeft /> Back to Portfolio
      </button>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={{
          width: '100%',
          maxWidth: '480px',
          textAlign: 'center'
        }}
      >
        {/* Header Icon */}
        <div style={{
          width: '70px',
          height: '70px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          boxShadow: '0 0 20px rgba(99, 102, 241, 0.5)'
        }}>
          <FaCompass style={{ fontSize: '2rem', color: 'white' }} />
        </div>

        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 800,
          fontFamily: 'Space Grotesk, sans-serif',
          marginBottom: '10px'
        }} className="gradient-text">
          AI Career Compass
        </h1>
        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1rem',
          marginBottom: '40px',
          lineHeight: '1.5'
        }}>
          Personalized Career Recommendations, Skill-Gap Analytics, Mentorship Bookings, and CV Builder.
        </p>

        {/* Auth Card */}
        <div className="glass" style={{
          padding: '40px',
          borderRadius: '24px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          textAlign: 'left'
        }}>
          <h2 style={{
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '24px',
            fontFamily: 'Space Grotesk, sans-serif'
          }}>
            {isLogin ? 'Welcome Back' : 'Create an Account'}
          </h2>

          {error && (
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '0.9rem'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {!isLogin && (
              <div>
                <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="form-input"
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>
                Email Address
              </label>
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>
                Password
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="form-input"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: '10px',
                padding: '16px'
              }}
            >
              {loading ? 'Authenticating...' : isLogin ? (
                <>Sign In <FaSignInAlt /></>
              ) : (
                <>Sign Up <FaUserPlus /></>
              )}
            </button>
          </form>

          {/* Toggle */}
          <div style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '0.9rem',
            color: 'var(--text-secondary)'
          }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: 600,
                cursor: 'pointer',
                padding: '0 4px',
                textDecoration: 'underline'
              }}
            >
              {isLogin ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AICareerPortal;
