import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaLaptopCode, FaLightbulb, FaShieldAlt, FaSpaceShuttle } from 'react-icons/fa';

const About = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const cards = [
    {
      icon: <FaLaptopCode style={{ color: 'var(--primary)' }} />,
      title: 'Full Stack Engineering',
      desc: 'Expertise across both frontend design frameworks and high performance scalable Node.js backend systems.'
    },
    {
      icon: <FaLightbulb style={{ color: 'var(--accent)' }} />,
      title: 'Creative Innovation',
      desc: 'Creating next-gen experiences like Iqlipse Space and Skillipse, delivering unique user value.'
    },
    {
      icon: <FaShieldAlt style={{ color: 'var(--accent2)' }} />,
      title: 'Quality & Security',
      desc: 'Writing clean, self-documenting code with deep testing patterns and robust modern architecture.'
    },
    {
      icon: <FaSpaceShuttle style={{ color: 'var(--secondary)' }} />,
      title: 'Blazing Fast Speed',
      desc: 'Optimized rendering cycles, lightweight assets, and clean API designs for high performance.'
    }
  ];

  return (
    <section id="about" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        <h2 className="section-title">
          About <span className="gradient-text">Me</span>
        </h2>
        <div className="section-divider" />
        <p className="section-subtitle">
          Building the future of digital products, one line of code at a time.
        </p>

        <div 
          ref={ref} 
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', alignItems: 'center', marginBottom: '60px' }} 
          className="about-grid"
        >
          {/* Left Text details */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h3 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '20px', fontFamily: 'Space Grotesk' }}>
              Who is Aryan Kumar?
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '1.05rem', lineHeight: '1.7' }}>
              I am a passionate software engineer based in Bihar, India. I specialize in designing and engineering high-impact, beautiful applications with React, Node.js, PHP, and other modern technologies.
            </p>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '20px', fontSize: '1.05rem', lineHeight: '1.7' }}>
              As the founder of <a href="https://iqlipse.space" target="_blank" rel="noreferrer" style={{ color: 'var(--accent)', textDecoration: 'none', fontWeight: 600 }}>Iqlipse</a> and <a href="https://skillipse.org" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>Skillipse</a>, I lead initiatives aimed at empowering developers and crafting highly performant tools. I love bridging the gap between advanced backend computation and visually stunning interfaces.
            </p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '30px' }}>
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary)', fontFamily: 'Space Grotesk' }}>15+</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Projects Completed</div>
              </div>
              <div style={{ width: '1px', background: 'var(--border)' }} />
              <div>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent)', fontFamily: 'Space Grotesk' }}>2+</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Platforms Founded</div>
              </div>
            </div>
          </motion.div>

          {/* Right Card Grid */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.8 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}
            className="cards-grid"
          >
            {cards.map((card, idx) => (
              <div 
                key={idx} 
                className="glass card-hover" 
                style={{ padding: '24px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.05)' }}
              >
                <div style={{ fontSize: '2rem', marginBottom: '16px', display: 'flex' }}>
                  {card.icon}
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '10px', fontFamily: 'Space Grotesk' }}>
                  {card.title}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: '1.5' }}>
                  {card.desc}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .about-grid {
            grid-template-columns: 1fr !important;
            gap: 40px;
          }
        }
        @media (max-width: 600px) {
          .cards-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default About;
