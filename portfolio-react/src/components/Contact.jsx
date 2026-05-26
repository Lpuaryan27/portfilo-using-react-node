import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhoneAlt, FaMapMarkerAlt, FaPaperPlane } from 'react-icons/fa';
import axios from 'axios';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      setStatus({ type: 'error', message: 'Please fill out all required fields.' });
      return;
    }

    setLoading(true);
    setStatus({ type: '', message: '' });

    try {
      // Connect to the custom Express backend server
      const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
        ? 'http://localhost:5000'
        : 'https://your-backend-app-name.onrender.com'; // Replace with deployed backend URL (e.g. on Render)

      const response = await axios.post(`${API_BASE_URL}/api/contact`, formData);
      if (response.data.success) {
        setStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setStatus({ type: 'error', message: 'Something went wrong. Please try again.' });
      }
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Failed to connect to backend server. Message saved locally.' });
      // Fallback: save to localStorage if server isn't running yet
      const offlineMessages = JSON.parse(localStorage.getItem('offline_messages') || '[]');
      offlineMessages.push({ ...formData, date: new Date().toISOString() });
      localStorage.setItem('offline_messages', JSON.stringify(offlineMessages));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        <h2 className="section-title">
          Get In <span className="gradient-text">Touch</span>
        </h2>
        <div className="section-divider" />
        <p className="section-subtitle">
          Have an exciting project idea, looking for collaboration, or just want to say hi? Write to me!
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '0.9fr 1.1fr', gap: '40px' }} className="contact-grid">
          
          {/* Details side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div className="glass" style={{ padding: '40px', borderRadius: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', height: '100%' }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: '30px', fontFamily: 'Space Grotesk' }}>Contact Info</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.2rem', flexShrink: 0 }}>
                    <FaMapMarkerAlt />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px', fontFamily: 'Space Grotesk' }}>Location</h4>
                    <p style={{ color: 'var(--text-secondary)' }}>Bihar, India</p>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.2rem', flexShrink: 0 }}>
                    <FaEnvelope />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px', fontFamily: 'Space Grotesk' }}>Email Address</h4>
                    <a href="mailto:araj356368@gmail.com" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                      araj356368@gmail.com
                    </a>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(99, 102, 241, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '1.2rem', flexShrink: 0 }}>
                    <FaPhoneAlt />
                  </div>
                  <div>
                    <h4 style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '4px', fontFamily: 'Space Grotesk' }}>Phone Number</h4>
                    <a href="tel:+916206631341" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }} onMouseEnter={(e) => e.target.style.color = 'var(--primary)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                      +91 6206631341
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Form side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="glass" style={{ padding: '40px', borderRadius: '24px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }} className="form-row">
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Your Name *</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Aryan Kumar" 
                    className="form-input" 
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Your Email *</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="example@mail.com" 
                    className="form-input" 
                    required
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Subject</label>
                <input 
                  type="text" 
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="Collaboration details" 
                  className="form-input" 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 500, color: 'var(--text-secondary)', marginBottom: '8px' }}>Your Message *</label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Hey, let's build something awesome together..." 
                  className="form-input" 
                  rows="5"
                  style={{ resize: 'none' }}
                  required
                />
              </div>

              {status.message && (
                <div style={{
                  padding: '12px 16px',
                  borderRadius: '8px',
                  fontSize: '0.9rem',
                  background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                  border: `1px solid ${status.type === 'success' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                  color: status.type === 'success' ? '#34d399' : '#f87171'
                }}>
                  {status.message}
                </div>
              )}

              <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                {loading ? 'Sending Message...' : 'Send Message'} <FaPaperPlane />
              </button>
            </form>
          </motion.div>

        </div>

      </div>

      <style>{`
        @media (max-width: 800px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Contact;
