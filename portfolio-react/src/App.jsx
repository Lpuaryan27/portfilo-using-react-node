import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
import Contact from './components/Contact';
import Footer from './components/Footer';
import StarsBackground from './components/StarsBackground';

// AI Career Portal Components
import AICareerPortal from './components/ai-career/AICareerPortal';
import AICareerDashboard from './components/ai-career/AICareerDashboard';

function MainPortfolio() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </>
  );
}

function App() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      const glow = document.getElementById('cursor-glow');
      if (glow) {
        glow.style.left = `${e.clientX}px`;
        glow.style.top = `${e.clientY}px`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <Router>
      <div style={{ position: 'relative', minHeight: '100vh' }}>
        {/* Visual background layers */}
        <StarsBackground />
        <div id="cursor-glow" className="cursor-glow" />

        <Routes>
          <Route path="/" element={<MainPortfolio />} />
          <Route path="/ai-career" element={<AICareerPortal />} />
          <Route path="/ai-career/dashboard" element={<AICareerDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
