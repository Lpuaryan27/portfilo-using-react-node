import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { FaExternalLinkAlt, FaGithub, FaFolderOpen } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Projects = () => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const projects = [
    {
      title: 'AI Career Guidance System',
      desc: 'A premium, AI-driven guidance platform helping undergrads match with career paths, analyze skill gaps, generate evaluated resumes, and schedule 1:1 mock mentorship sessions.',
      tags: ['React', 'Node.js', 'Express', 'AI Evaluator', 'PDF Print'],
      demo: '/ai-career',
      github: 'https://github.com/Lpuaryan27/ai-project-placement-',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80',
      isRoute: true
    },
    {
      title: 'E-Commerce Platform',
      desc: 'A modern full-featured e-commerce solution with React frontend, Node.js Express backend, and MongoDB database integration.',
      tags: ['React', 'Node.js', 'MongoDB', 'Express'],
      demo: '#',
      github: 'https://github.com/Lpuaryan27',
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=600&q=80',
      isRoute: false
    },
    {
      title: 'Travel-with-iQlipse',
      desc: 'An AI-powered travel planning and Agency experiences website leveraging high fidelity styling and animations.',
      tags: ['Tailwind CSS', 'JavaScript', 'GSAP', 'AI API'],
      demo: 'https://travel-agency-ahk1.onrender.com',
      github: 'https://github.com/Lpuaryan27/Travel-with-iQlipse---AI-Powered-Travel-Experiences',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80',
      isRoute: false
    },
    {
      title: 'Iqlipse LPU Website',
      desc: 'Interactive university community platform featuring custom information directories, student portals, and resources.',
      tags: ['React', 'Node.js', 'UI Design', 'Vite'],
      demo: 'https://iqlipse-delta.vercel.app/home',
      github: 'https://github.com/Lpuaryan27',
      image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
      isRoute: false
    }
  ];

  return (
    <section id="projects" className="section-padding" style={{ position: 'relative' }}>
      <div className="container">
        
        <h2 className="section-title">
          My <span className="gradient-text">Projects</span>
        </h2>
        <div className="section-divider" />
        <p className="section-subtitle">
          Here is a showcase of my key digital builds, combining clean code with interactive layouts.
        </p>

        <div 
          ref={ref}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '30px' }}
          className="projects-grid"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass card-hover"
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Image Container */}
              <div style={{ height: '220px', overflow: 'hidden', position: 'relative' }}>
                <img 
                  src={project.image} 
                  alt={project.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.08)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1.0)';
                  }}
                />
                <div style={{ position: 'absolute', top: '16px', left: '16px', background: 'rgba(5, 8, 22, 0.75)', backdropFilter: 'blur(8px)', padding: '6px 12px', borderRadius: '30px', fontSize: '0.8rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <FaFolderOpen style={{ color: 'var(--primary)' }} /> Featured Project
                </div>
              </div>

              {/* Info Area */}
              <div style={{ padding: '28px', flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '12px', fontFamily: 'Space Grotesk' }}>
                    {project.title}
                  </h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px' }}>
                    {project.desc}
                  </p>
                </div>

                <div>
                  {/* Tech Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                    {project.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="tech-tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '20px' }}>
                    {project.isRoute ? (
                      <Link 
                        to={project.demo} 
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}
                      >
                        Live Demo <FaExternalLinkAlt style={{ fontSize: '0.8rem' }} />
                      </Link>
                    ) : (
                      <a 
                        href={project.demo} 
                        target="_blank" 
                        rel="noreferrer"
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600, fontSize: '0.9rem' }}
                      >
                        Live Demo <FaExternalLinkAlt style={{ fontSize: '0.8rem' }} />
                      </a>
                    )}
                    <a 
                      href={project.github} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.9rem' }}
                      onMouseEnter={(e) => {
                        e.target.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.color = 'var(--text-secondary)';
                      }}
                    >
                      Source <FaGithub style={{ fontSize: '0.95rem' }} />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      <style>{`
        @media (max-width: 500px) {
          .projects-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Projects;
