import React, { useState, useEffect } from 'react';
import { FaBars, FaTimes, FaGithub, FaLinkedin } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/#home', isRoute: false },
    { name: 'About', href: '/#about', isRoute: false },
    { name: 'Skills', href: '/#skills', isRoute: false },
    { name: 'Projects', href: '/#projects', isRoute: false },
    { name: 'AI Career Compass', href: '/ai-career', isRoute: true },
    { name: 'Contact', href: '/#contact', isRoute: false },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontWeight: 800,
              fontSize: '1.6rem',
              fontFamily: 'Space Grotesk, sans-serif',
              letterSpacing: '-1px'
            }} className="gradient-text">
              ARYAN KUMAR
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="desktop-nav">
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              {navLinks.map((link) => {
                if (link.isRoute) {
                  return (
                    <Link
                      key={link.name}
                      to={link.href}
                      style={{
                        color: scrolled ? 'var(--text-primary)' : '#e2e8f0',
                        textDecoration: 'none',
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        transition: 'all 0.3s ease',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                      onMouseLeave={(e) => e.target.style.color = scrolled ? 'var(--text-primary)' : '#e2e8f0'}
                    >
                      {link.name}
                    </Link>
                  );
                }
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    style={{
                      color: scrolled ? 'var(--text-primary)' : '#e2e8f0',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                    onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                    onMouseLeave={(e) => e.target.style.color = scrolled ? 'var(--text-primary)' : '#e2e8f0'}
                  >
                    {link.name}
                  </a>
                );
              })}
            </div>
            
            {/* CTA Buttons */}
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <a 
                href="https://github.com/Lpuaryan27" 
                target="_blank" 
                rel="noreferrer"
                style={{ color: '#e2e8f0', fontSize: '1.3rem', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.target.style.color = '#e2e8f0'}
              >
                <FaGithub />
              </a>
              <a 
                href="https://www.linkedin.com/in/aryan-kumar-804b27199/" 
                target="_blank" 
                rel="noreferrer"
                style={{ color: '#e2e8f0', fontSize: '1.3rem', transition: 'all 0.3s ease' }}
                onMouseEnter={(e) => e.target.style.color = 'var(--primary)'}
                onMouseLeave={(e) => e.target.style.color = '#e2e8f0'}
              >
                <FaLinkedin />
              </a>
              <a href="/#contact" className="btn-primary" style={{ padding: '8px 20px', fontSize: '0.85rem' }}>
                Hire Me
              </a>
            </div>
          </div>

          {/* Mobile Menu Icon */}
          <div 
            onClick={() => setIsOpen(!isOpen)} 
            style={{ display: 'none', cursor: 'pointer', fontSize: '1.5rem', color: 'white' }}
            className="mobile-toggle"
          >
            {isOpen ? <FaTimes /> : <FaBars />}
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isOpen && (
          <div 
            className="glass" 
            style={{
              position: 'absolute',
              top: '70px',
              left: '24px',
              right: '24px',
              borderRadius: '16px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              zIndex: 1000
            }}
          >
            {navLinks.map((link) => {
              if (link.isRoute) {
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    onClick={() => setIsOpen(false)}
                    style={{
                      color: 'white',
                      textDecoration: 'none',
                      fontWeight: 500,
                      fontSize: '1.1rem',
                      padding: '8px 0',
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                    }}
                  >
                    {link.name}
                  </Link>
                );
              }
              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  style={{
                    color: 'white',
                    textDecoration: 'none',
                    fontWeight: 500,
                    fontSize: '1.1rem',
                    padding: '8px 0',
                    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  {link.name}
                </a>
              );
            })}
            <div style={{ display: 'flex', gap: '20px', padding: '10px 0', fontSize: '1.5rem' }}>
              <a href="https://github.com/Lpuaryan27" target="_blank" rel="noreferrer" style={{ color: 'white' }}><FaGithub /></a>
              <a href="https://www.linkedin.com/in/aryan-kumar-804b27199/" target="_blank" rel="noreferrer" style={{ color: 'white' }}><FaLinkedin /></a>
            </div>
            <a href="/#contact" onClick={() => setIsOpen(false)} className="btn-primary" style={{ textAlign: 'center', justifyContent: 'center' }}>
              Hire Me
            </a>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-toggle {
            display: block !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
