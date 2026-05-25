import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCode, FaRocket, FaTerminal, FaChevronDown } from 'react-icons/fa';

const Hero = () => {
  const words = ["Full Stack Developer", "Founder of Iqlipse", "UI/UX Innovator", "Tech Architect"];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(150);

  useEffect(() => {
    let timer;
    const handleType = () => {
      const fullWord = words[currentWordIndex];
      if (!isDeleting) {
        setCurrentText(fullWord.substring(0, currentText.length + 1));
        setTypingSpeed(100);

        if (currentText === fullWord) {
          timer = setTimeout(() => setIsDeleting(true), 2000);
          return;
        }
      } else {
        setCurrentText(fullWord.substring(0, currentText.length - 1));
        setTypingSpeed(50);

        if (currentText === '') {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [currentText, isDeleting, currentWordIndex]);

  return (
    <section id="home" className="bg-animated" style={{ position: 'relative', display: 'flex', alignItems: 'center', minHeight: '100vh', paddingTop: '80px', overflow: 'hidden' }}>
      
      {/* Dynamic Graphic Blobs */}
      <div 
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: '350px',
          height: '350px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(99,102,241,0.2) 0%, transparent 70%)',
          filter: 'blur(40px)',
          animation: 'float 8s ease-in-out infinite',
          zIndex: 1
        }}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: '15%',
          right: '10%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(6,182,212,0.15) 0%, transparent 70%)',
          filter: 'blur(50px)',
          animation: 'float 12s ease-in-out infinite reverse',
          zIndex: 1
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center' }} className="hero-grid">
          
          {/* Left Text Column */}
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(99, 102, 241, 0.1)', border: '1px solid rgba(99, 102, 241, 0.2)', padding: '6px 16px', borderRadius: '30px', color: '#a5b4fc', marginBottom: '24px', fontSize: '0.9rem', fontWeight: 600 }}>
              <FaTerminal /> Welcome to my digital space
            </div>
            
            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: '20px', fontFamily: 'Space Grotesk, sans-serif' }}>
              Hi, I'm <br />
              <span className="gradient-text">Aryan Kumar</span>
            </h1>

            <h2 style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px', minHeight: '50px' }}>
              I am a <span style={{ color: 'var(--accent)', borderRight: '3px solid var(--accent)', paddingRight: '4px', animation: 'blink 0.7s infinite' }}>{currentText}</span>
            </h2>

            <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '600px', marginBottom: '40px' }}>
              Founder of <span style={{ color: 'white', fontWeight: 600 }}>Iqlipse</span> and <span style={{ color: 'white', fontWeight: 600 }}>Skillipse</span>. 
              I design and engineer gorgeous, production-grade applications that merge clean code with state-of-the-art interactive graphics.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
              <a href="#projects" className="btn-primary">
                Explore Projects <FaRocket style={{ fontSize: '0.95rem' }} />
              </a>
              <a href="#contact" className="btn-outline">
                Let's Talk <FaCode />
              </a>
            </div>
          </motion.div>

          {/* Right Graphics/Photo Column */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{ display: 'flex', justifyContent: 'center', position: 'relative' }}
          >
            <div style={{ position: 'relative', width: '320px', height: '320px' }}>
              {/* Outer Orbit lines */}
              <div 
                style={{
                  position: 'absolute',
                  inset: '-20px',
                  borderRadius: '50%',
                  border: '2px dashed rgba(99, 102, 241, 0.2)',
                  animation: 'spin-slow 20s linear infinite'
                }}
              />
              <div 
                style={{
                  position: 'absolute',
                  inset: '-40px',
                  borderRadius: '50%',
                  border: '1px solid rgba(6, 182, 212, 0.15)',
                  animation: 'spin-slow-reverse 35s linear infinite'
                }}
              />
              
              {/* Main Glowing Circle */}
              <div 
                className="glow-purple"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                  padding: '5px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  animation: 'pulse-glow 5s infinite'
                }}
              >
                <div 
                  style={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    background: '#0d1117',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative'
                  }}
                >
                  {/* Neon Tech Icon Grid */}
                  <div style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
                    <div className="gradient-text" style={{ fontSize: '4rem', fontWeight: 900, fontFamily: 'Space Grotesk' }}>
                      I Q
                    </div>
                    <div style={{ fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase', color: 'var(--accent)', marginTop: '8px' }}>
                      Iqlipse Labs
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Badge elements */}
              <div 
                className="glass"
                style={{
                  position: 'absolute',
                  top: '-10px',
                  right: '-10px',
                  padding: '12px',
                  borderRadius: '50%',
                  color: '#60a5fa',
                  fontSize: '1.5rem',
                  display: 'flex',
                  boxShadow: 'var(--glow)',
                  animation: 'float 6s ease-in-out infinite'
                }}
              >
                <FaCode />
              </div>
              <div 
                className="glass"
                style={{
                  position: 'absolute',
                  bottom: '-10px',
                  left: '-10px',
                  padding: '12px',
                  borderRadius: '50%',
                  color: '#10b981',
                  fontSize: '1.5rem',
                  display: 'flex',
                  animation: 'float 5s ease-in-out infinite 1s'
                }}
              >
                <FaTerminal />
              </div>
            </div>
          </motion.div>

        </div>

        {/* Scroll Indicator */}
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '60px' }}>
          <a href="#about" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem' }} className="scroll-btn">
            <span>Scroll Down</span>
            <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} style={{ fontSize: '1.2rem', color: 'var(--primary)' }}>
              <FaChevronDown />
            </motion.div>
          </a>
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
            text-align: center;
            gap: 50px;
          }
          .hero-grid > div:first-child {
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .hero-grid p {
            margin-left: auto;
            margin-right: auto;
          }
          .hero-grid div {
            justify-content: center;
          }
        }
      `}</style>
    </section>
  );
};

export default Hero;
