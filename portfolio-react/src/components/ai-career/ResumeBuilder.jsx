import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaDownload, FaRobot, FaStar, FaPlus, FaTrash } from 'react-icons/fa';
import axios from 'axios';

import { API_URL } from './config';

const ResumeBuilder = ({ user }) => {
  const [activeSection, setActiveSection] = useState('form');
  const [saving, setSaving] = useState(false);
  const [aiScore, setAiScore] = useState(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    summary: '',
    skills: '',
    education: [{ degree: '', institution: '', year: '', grade: '' }],
    experience: [{ title: '', company: '', duration: '', description: '' }],
    projects: [{ name: '', tech: '', description: '', link: '' }],
    certifications: ''
  });

  const update = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const updateArr = (field, idx, key, value) => {
    const arr = [...formData[field]];
    arr[idx][key] = value;
    setFormData(prev => ({ ...prev, [field]: arr }));
  };
  const addRow = (field, empty) => setFormData(prev => ({ ...prev, [field]: [...prev[field], { ...empty }] }));
  const removeRow = (field, idx) => setFormData(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== idx) }));

  const runAIEvaluator = () => {
    let score = 0;
    const suggestions = [];
    if (formData.summary.length > 80) score += 15; else suggestions.push('Expand your professional summary to at least 2-3 sentences.');
    if (formData.skills.split(',').length >= 5) score += 20; else suggestions.push('List at least 5+ skills for better ATS matching.');
    if (formData.experience[0].title) score += 25; else suggestions.push('Add at least one work experience or internship entry.');
    if (formData.projects[0].name) score += 20; else suggestions.push('Add 1-3 relevant projects to showcase your work.');
    if (formData.github || formData.linkedin) score += 10; else suggestions.push('Include LinkedIn and GitHub profile URLs.');
    if (formData.education[0].institution) score += 10; else suggestions.push('Add your education details.');
    setAiScore(score);
    setAiSuggestions(suggestions);
  };

  const saveResume = async () => {
    setSaving(true);
    try {
      await axios.post(`${API_URL}/resume`, { email: user?.email, resume: formData }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('careerToken')}` }
      });
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  const inputStyle = { width: '100%', marginBottom: '16px' };
  const sectionBtn = (id, label) => (
    <button onClick={() => setActiveSection(id)} style={{
      padding: '10px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer',
      background: activeSection === id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
      color: 'white', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.3s'
    }}>{label}</button>
  );

  return (
    <div>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Space Grotesk', marginBottom: '8px' }}>CV / Resume Builder</h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Build your professional resume and get an AI evaluation score with targeted improvement suggestions.</p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
        {sectionBtn('form', '✍️ Edit Resume')}
        {sectionBtn('preview', '👁️ Preview CV')}
        {sectionBtn('ai', '🤖 AI Evaluator')}
      </div>

      {activeSection === 'form' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass" style={{ padding: '36px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
          {/* Personal Info */}
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '1px' }}>Personal Information</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <input className="form-input" placeholder="Full Name" value={formData.name} onChange={e => update('name', e.target.value)} />
            <input className="form-input" placeholder="Email Address" value={formData.email} onChange={e => update('email', e.target.value)} />
            <input className="form-input" placeholder="Phone Number" value={formData.phone} onChange={e => update('phone', e.target.value)} />
            <input className="form-input" placeholder="Location (City, Country)" value={formData.location} onChange={e => update('location', e.target.value)} />
            <input className="form-input" placeholder="LinkedIn URL" value={formData.linkedin} onChange={e => update('linkedin', e.target.value)} />
            <input className="form-input" placeholder="GitHub URL" value={formData.github} onChange={e => update('github', e.target.value)} />
          </div>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Professional Summary</h3>
          <textarea className="form-input" placeholder="A dynamic full-stack developer with expertise in React and Node.js..." rows="4" value={formData.summary} onChange={e => update('summary', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Skills</h3>
          <input className="form-input" placeholder="React, JavaScript, Node.js, Python, CSS3, MongoDB" value={formData.skills} onChange={e => update('skills', e.target.value)} style={inputStyle} />

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Education</h3>
          {formData.education.map((edu, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: '12px', marginBottom: '12px', alignItems: 'center' }}>
              <input className="form-input" placeholder="Degree (e.g., B.Tech CSE)" value={edu.degree} onChange={e => updateArr('education', idx, 'degree', e.target.value)} />
              <input className="form-input" placeholder="Institution Name" value={edu.institution} onChange={e => updateArr('education', idx, 'institution', e.target.value)} />
              <input className="form-input" placeholder="Year (e.g., 2022-2026)" value={edu.year} onChange={e => updateArr('education', idx, 'year', e.target.value)} />
              <input className="form-input" placeholder="CGPA / Grade" value={edu.grade} onChange={e => updateArr('education', idx, 'grade', e.target.value)} />
              {idx > 0 && <button onClick={() => removeRow('education', idx)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer' }}><FaTrash /></button>}
            </div>
          ))}
          <button onClick={() => addRow('education', { degree: '', institution: '', year: '', grade: '' })} style={{ background: 'none', border: '1px dashed rgba(255,255,255,0.2)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', fontSize: '0.85rem' }}>
            <FaPlus /> Add Education
          </button>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Work Experience / Internships</h3>
          {formData.experience.map((exp, idx) => (
            <div key={idx} style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input className="form-input" placeholder="Job Title / Role" value={exp.title} onChange={e => updateArr('experience', idx, 'title', e.target.value)} />
                <input className="form-input" placeholder="Company Name" value={exp.company} onChange={e => updateArr('experience', idx, 'company', e.target.value)} />
                <input className="form-input" placeholder="Duration (e.g., Jun 2024 - Aug 2024)" value={exp.duration} onChange={e => updateArr('experience', idx, 'duration', e.target.value)} />
              </div>
              <textarea className="form-input" placeholder="Describe your responsibilities and achievements..." rows="3" value={exp.description} onChange={e => updateArr('experience', idx, 'description', e.target.value)} style={{ resize: 'vertical' }} />
              {idx > 0 && <button onClick={() => removeRow('experience', idx)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginTop: '8px' }}><FaTrash /> Remove</button>}
            </div>
          ))}
          <button onClick={() => addRow('experience', { title: '', company: '', duration: '', description: '' })} style={{ background: 'none', border: '1px dashed rgba(255,255,255,0.2)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', fontSize: '0.85rem' }}>
            <FaPlus /> Add Experience
          </button>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Projects</h3>
          {formData.projects.map((proj, idx) => (
            <div key={idx} style={{ border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                <input className="form-input" placeholder="Project Name" value={proj.name} onChange={e => updateArr('projects', idx, 'name', e.target.value)} />
                <input className="form-input" placeholder="Technologies Used" value={proj.tech} onChange={e => updateArr('projects', idx, 'tech', e.target.value)} />
                <input className="form-input" placeholder="GitHub / Live URL" value={proj.link} onChange={e => updateArr('projects', idx, 'link', e.target.value)} />
              </div>
              <textarea className="form-input" placeholder="Brief description of the project..." rows="2" value={proj.description} onChange={e => updateArr('projects', idx, 'description', e.target.value)} style={{ resize: 'vertical' }} />
              {idx > 0 && <button onClick={() => removeRow('projects', idx)} style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', marginTop: '8px' }}><FaTrash /> Remove</button>}
            </div>
          ))}
          <button onClick={() => addRow('projects', { name: '', tech: '', description: '', link: '' })} style={{ background: 'none', border: '1px dashed rgba(255,255,255,0.2)', color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px', fontSize: '0.85rem' }}>
            <FaPlus /> Add Project
          </button>

          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '1px' }}>Certifications & Achievements</h3>
          <textarea className="form-input" placeholder="AWS Cloud Practitioner (2024), Google Analytics Certificate, Hackathon Winner..." rows="3" value={formData.certifications} onChange={e => update('certifications', e.target.value)} style={{ ...inputStyle, resize: 'vertical' }} />

          <div style={{ display: 'flex', gap: '16px', marginTop: '10px' }}>
            <button onClick={saveResume} disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save Resume'}
            </button>
            <button onClick={() => setActiveSection('preview')} className="btn-outline">
              Preview CV
            </button>
          </div>
        </motion.div>
      )}

      {activeSection === 'preview' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div style={{ background: 'white', color: '#1a1a1a', borderRadius: '16px', padding: '50px', maxWidth: '900px', fontFamily: 'Georgia, serif', boxShadow: '0 20px 60px rgba(0,0,0,0.4)' }} id="resume-preview">
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '30px', borderBottom: '3px solid #6366f1', paddingBottom: '20px' }}>
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>{formData.name || 'Your Name'}</h1>
              <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '15px', marginTop: '10px', fontSize: '0.85rem', color: '#555' }}>
                {formData.email && <span>✉ {formData.email}</span>}
                {formData.phone && <span>📞 {formData.phone}</span>}
                {formData.location && <span>📍 {formData.location}</span>}
                {formData.linkedin && <span>🔗 LinkedIn</span>}
                {formData.github && <span>💻 GitHub</span>}
              </div>
            </div>

            {formData.summary && (
              <div style={{ marginBottom: '25px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Professional Summary</h2>
                <p style={{ lineHeight: '1.7', color: '#333' }}>{formData.summary}</p>
              </div>
            )}

            {formData.skills && (
              <div style={{ marginBottom: '25px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Technical Skills</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {formData.skills.split(',').map((sk, i) => (
                    <span key={i} style={{ background: '#eef2ff', color: '#4338ca', padding: '4px 12px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600 }}>{sk.trim()}</span>
                  ))}
                </div>
              </div>
            )}

            {formData.education.some(e => e.institution) && (
              <div style={{ marginBottom: '25px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Education</h2>
                {formData.education.filter(e => e.institution).map((edu, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>{edu.degree}</h3>
                      <p style={{ color: '#555', fontSize: '0.9rem', margin: '2px 0' }}>{edu.institution}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ color: '#777', fontSize: '0.85rem' }}>{edu.year}</p>
                      {edu.grade && <p style={{ color: '#6366f1', fontWeight: 700, fontSize: '0.85rem' }}>{edu.grade}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {formData.experience.some(e => e.title) && (
              <div style={{ marginBottom: '25px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Work Experience</h2>
                {formData.experience.filter(e => e.title).map((exp, idx) => (
                  <div key={idx} style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>{exp.title} {exp.company && `@ ${exp.company}`}</h3>
                      <span style={{ color: '#777', fontSize: '0.85rem' }}>{exp.duration}</span>
                    </div>
                    {exp.description && <p style={{ color: '#444', lineHeight: '1.6', marginTop: '6px', fontSize: '0.9rem' }}>{exp.description}</p>}
                  </div>
                ))}
              </div>
            )}

            {formData.projects.some(p => p.name) && (
              <div style={{ marginBottom: '25px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '12px' }}>Projects</h2>
                {formData.projects.filter(p => p.name).map((proj, idx) => (
                  <div key={idx} style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '1rem', margin: 0 }}>{proj.name}</h3>
                      <span style={{ color: '#6366f1', fontSize: '0.8rem', fontFamily: 'monospace' }}>{proj.tech}</span>
                    </div>
                    {proj.description && <p style={{ color: '#444', lineHeight: '1.6', marginTop: '4px', fontSize: '0.9rem' }}>{proj.description}</p>}
                    {proj.link && <a href={proj.link} style={{ color: '#6366f1', fontSize: '0.8rem' }}>{proj.link}</a>}
                  </div>
                ))}
              </div>
            )}

            {formData.certifications && (
              <div style={{ marginBottom: '10px' }}>
                <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#6366f1', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Certifications & Achievements</h2>
                <p style={{ color: '#444', lineHeight: '1.7', fontSize: '0.9rem' }}>{formData.certifications}</p>
              </div>
            )}
          </div>

          <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
            <button onClick={() => window.print()} className="btn-primary">
              <FaDownload /> Download / Print PDF
            </button>
          </div>
        </motion.div>
      )}

      {activeSection === 'ai' && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass" style={{ padding: '40px', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
            <FaRobot style={{ fontSize: '2rem', color: 'var(--primary)' }} />
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Space Grotesk', margin: 0 }}>AI Resume Evaluator</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Scans your CV and produces an ATS compatibility score with improvement recommendations.</p>
            </div>
          </div>

          <button onClick={runAIEvaluator} className="btn-primary" style={{ marginBottom: '30px' }}>
            <FaRobot /> Evaluate My CV
          </button>

          {aiScore !== null && (
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
              {/* Score Display */}
              <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                <div style={{
                  width: '140px', height: '140px', borderRadius: '50%', margin: '0 auto 16px',
                  background: `conic-gradient(${aiScore >= 80 ? '#10b981' : aiScore >= 50 ? '#6366f1' : '#f87171'} ${aiScore * 3.6}deg, rgba(255,255,255,0.06) 0deg)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  <div style={{ width: '110px', height: '110px', borderRadius: '50%', background: 'var(--bg-dark)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span style={{ fontSize: '2.2rem', fontWeight: 900, color: aiScore >= 80 ? '#10b981' : aiScore >= 50 ? '#6366f1' : '#f87171' }}>{aiScore}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>/ 100</span>
                  </div>
                </div>
                <h4 style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                  {aiScore >= 80 ? '🎉 Excellent Resume!' : aiScore >= 50 ? '👍 Good, needs polish' : '⚠️ Needs more work'}
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>ATS Compatibility & Completeness Score</p>
              </div>

              {/* Stars */}
              <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: '30px' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <FaStar key={star} style={{ color: star <= Math.round(aiScore / 20) ? '#fbbf24' : 'rgba(255,255,255,0.15)', fontSize: '1.4rem' }} />
                ))}
              </div>

              {/* Suggestions */}
              {aiSuggestions.length > 0 && (
                <div>
                  <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '16px', fontFamily: 'Space Grotesk' }}>💡 Recommended Improvements:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {aiSuggestions.map((s, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '14px 18px', borderRadius: '10px', background: 'rgba(251, 191, 36, 0.07)', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                        <span style={{ color: '#fbbf24', fontSize: '0.9rem' }}>⚡</span>
                        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5' }}>{s}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {aiSuggestions.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: '12px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <p style={{ color: '#34d399', fontWeight: 600 }}>✅ Your CV looks complete! Keep it updated regularly.</p>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ResumeBuilder;
