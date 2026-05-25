import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaInstagram } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer style={{ background: '#03050c', borderTop: '1px solid var(--border)', padding: '50px 0 30px' }}>
      <div className="container">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          
          <span style={{ fontWeight: 800, fontSize: '1.5rem', fontFamily: 'Space Grotesk' }} className="gradient-text">
            ARYAN KUMAR
          </span>

          <p style={{ color: 'var(--text-secondary)', textAlign: 'center', maxWidth: '500px', fontSize: '0.95rem' }}>
            Designing and engineering state-of-the-art web products. Proud founder of Iqlipse & Skillipse.
          </p>

          <div style={{ display: 'flex', gap: '16px', fontSize: '1.3rem' }}>
            <a 
              href="https://github.com/Lpuaryan27" 
              target="_blank" 
              rel="noreferrer"
              style={{ color: 'var(--text-secondary)', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              <FaGithub />
            </a>
            <a 
              href="https://www.linkedin.com/in/aryan-kumar-804b27199/" 
              target="_blank" 
              rel="noreferrer"
              style={{ color: 'var(--text-secondary)', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              <FaLinkedin />
            </a>
            <a 
              href="#" 
              style={{ color: 'var(--text-secondary)', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              <FaTwitter />
            </a>
            <a 
              href="#" 
              style={{ color: 'var(--text-secondary)', transition: 'all 0.3s ease' }}
              onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
              onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}
            >
              <FaInstagram />
            </a>
          </div>

          <div style={{ width: '100%', height: '1px', background: 'rgba(255, 255, 255, 0.05)', marginTop: '20px' }} />

          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', textAlign: 'center' }}>
            &copy; {new Date().getFullYear()} Aryan Kumar. All Rights Reserved. Built with React & Node.js.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
