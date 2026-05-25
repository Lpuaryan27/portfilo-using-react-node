import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaHtml5, FaCss3Alt, FaJs, FaReact, FaNodeJs, FaPhp, FaJava, FaCode, FaProjectDiagram } from 'react-icons/fa';
import { SiTailwindcss, SiCplusplus, SiMongodb } from 'react-icons/si';

const Skills = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const skills = [
    { name: 'HTML5', icon: <FaHtml5 style={{ color: '#f06529' }} />, level: '95%' },
    { name: 'CSS3', icon: <FaCss3Alt style={{ color: '#2965f1' }} />, level: '90%' },
    { name: 'JavaScript', icon: <FaJs style={{ color: '#f0db4f' }} />, level: '90%' },
    { name: 'React', icon: <FaReact style={{ color: '#61dbfb' }} />, level: '85%' },
    { name: 'Tailwind CSS', icon: <SiTailwindcss style={{ color: '#38bdf8' }} />, level: '92%' },
    { name: 'Node.js', icon: <FaNodeJs style={{ color: '#3c873a' }} />, level: '85%' },
    { name: 'MongoDB', icon: <SiMongodb style={{ color: '#4db33d' }} />, level: '80%' },
    { name: 'PHP', icon: <FaPhp style={{ color: '#8993be' }} />, level: '80%' },
    { name: 'C++', icon: <SiCplusplus style={{ color: '#00599c' }} />, level: '85%' },
    { name: 'Java', icon: <FaJava style={{ color: '#f89820' }} />, level: '75%' },
    { name: 'DSA', icon: <FaProjectDiagram style={{ color: '#c084fc' }} />, level: '88%' },
  ];

  return (
    <section id="skills" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        <h2 className="section-title">
          My <span className="gradient-text">Skills</span>
        </h2>
        <div className="section-divider" />
        <p className="section-subtitle">
          A overview of my technical stack and engineering capabilities.
        </p>

        <div 
          ref={ref}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '24px' }}
        >
          {skills.map((skill, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: index * 0.05 }}
              className="glass card-hover"
              style={{
                padding: '24px',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
              }}
            >
              <div style={{ fontSize: '2.5rem', display: 'flex', flexShrink: 0 }}>
                {skill.icon}
              </div>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h4 style={{ fontWeight: 600, fontSize: '1rem', fontFamily: 'Space Grotesk' }}>{skill.name}</h4>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{skill.level}</span>
                </div>
                <div style={{ background: 'rgba(255, 255, 255, 0.08)', height: '6px', borderRadius: '3px', width: '100%', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={inView ? { width: skill.level } : {}}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="skill-bar-fill"
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default Skills;
