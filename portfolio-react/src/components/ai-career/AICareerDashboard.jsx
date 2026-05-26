import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCompass, FaClipboardList, FaFileInvoice, FaUserGraduate, 
  FaComments, FaSignOutAlt, FaUser, FaCheck, FaExclamationTriangle,
  FaBook, FaArrowRight, FaSync
} from 'react-icons/fa';
import axios from 'axios';

// Import sub-pages (we will create them next)
import CareerAssessment from './CareerAssessment';
import ResumeBuilder from './ResumeBuilder';
import MentorScheduler from './MentorScheduler';
import AIFeedback from './AIFeedback';

import { API_URL } from './config';

// Career dictionary for matching logic
const CAREER_DATABASE = [
  {
    title: 'Full Stack Engineer',
    domain: 'Software Engineering',
    desc: 'Bridges the gap between frontend interfaces and backend databases, developing complete websites and cloud platforms.',
    skills: ['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Git'],
    resources: [
      { name: 'Full-Stack Web Developer NanoDegree', provider: 'Udacity', url: 'https://www.udacity.com' },
      { name: 'Modern Full-Stack React & Node Bootcamp', provider: 'Udemy', url: 'https://www.udemy.com' },
      { name: 'The Odin Project (Full Stack Javascript)', provider: 'Open Source', url: 'https://www.theodinproject.com' }
    ]
  },
  {
    title: 'AI / Machine Learning Engineer',
    domain: 'Artificial Intelligence',
    desc: 'Designs and builds intelligent algorithms and deep learning models to enable machines to learn and make decisions.',
    skills: ['Python', 'C++', 'Java', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Linear Algebra', 'DSA'],
    resources: [
      { name: 'Machine Learning Specialization by Andrew Ng', provider: 'Coursera', url: 'https://www.coursera.org' },
      { name: 'Deep Learning Specialization', provider: 'Coursera', url: 'https://www.coursera.org' },
      { name: 'Introduction to PyTorch', provider: 'Udemy', url: 'https://www.udemy.com' }
    ]
  },
  {
    title: 'Data Analyst',
    domain: 'Data Science',
    desc: 'Inspects, cleans, and models datasets to extract actionable business insights and create interactive dashboards.',
    skills: ['Python', 'SQL', 'Excel', 'Tableau', 'Statistics', 'Communication'],
    resources: [
      { name: 'Google Data Analytics Professional Certificate', provider: 'Coursera', url: 'https://www.coursera.org' },
      { name: 'Data Analysis with Python', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org' },
      { name: 'SQL for Data Science', provider: 'edX', url: 'https://www.edx.org' }
    ]
  },
  {
    title: 'UI/UX Product Designer',
    domain: 'Product Design',
    desc: 'Conducts user research, defines wireframes, and designs high-fidelity interactive user interfaces and visuals.',
    skills: ['Figma', 'UI Design', 'UX Research', 'CSS3', 'Responsive Design', 'Prototyping'],
    resources: [
      { name: 'Google UX Design Professional Certificate', provider: 'Coursera', url: 'https://www.coursera.org' },
      { name: 'Learn Figma: User Interface Design', provider: 'Udemy', url: 'https://www.udemy.com' },
      { name: 'Refactoring UI Book & Tutorials', provider: 'Independent', url: 'https://refactoringui.com' }
    ]
  },
  {
    title: 'Software Developer (C++/Java)',
    domain: 'Software Development',
    desc: 'Engineers desktop, system, or backend software applications using structured systems programming languages and DSA.',
    skills: ['C++', 'Java', 'DSA', 'OOP', 'Git', 'Linux'],
    resources: [
      { name: 'C++ Programming & Data Structures', provider: 'Udemy', url: 'https://www.udemy.com' },
      { name: 'Java Programming Masterclass', provider: 'Udemy', url: 'https://www.udemy.com' },
      { name: 'Algorithms, Part I & II (Princeton)', provider: 'Coursera', url: 'https://www.coursera.org' }
    ]
  }
];

const AICareerDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [skillsText, setSkillsText] = useState('');
  const [interestsText, setInterestsText] = useState('');
  const [education, setEducation] = useState('First Year Undergrad');
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem('careerUser');
    if (!savedUser) {
      navigate('/ai-career');
      return;
    }
    const parsedUser = JSON.parse(savedUser);
    setUser(parsedUser);

    // Fetch user profile from backend
    axios.get(`${API_URL}/profile`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('careerToken')}` },
      params: { email: parsedUser.email }
    }).then(res => {
      if (res.data.success && res.data.profile) {
        const { skills, interests, education: edu } = res.data.profile;
        setSkillsText(skills.join(', '));
        setInterestsText(interests.join(', '));
        setEducation(edu || 'First Year Undergrad');
        runRecommendationEngine(skills, interests);
      }
    }).catch(err => console.log('Error getting profile:', err));

    // Fetch quiz completions
    axios.get(`${API_URL}/assessment`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('careerToken')}` },
      params: { email: parsedUser.email }
    }).then(res => {
      if (res.data.success && res.data.results && res.data.results.length > 0) {
        setQuizCompleted(true);
      }
    }).catch(err => console.log('Error getting assessment:', err));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('careerUser');
    localStorage.removeItem('careerToken');
    navigate('/ai-career');
  };

  const parseInput = (text) => {
    return text.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
  };

  const runRecommendationEngine = (skillsList, interestsList) => {
    const list = skillsList.map(s => s.toLowerCase());
    const matched = CAREER_DATABASE.map(career => {
      // Calculate matches
      const matches = career.skills.filter(skill => list.includes(skill.toLowerCase()));
      const score = Math.round((matches.length / career.skills.length) * 100);
      
      // Calculate gap
      const gap = career.skills.filter(skill => !list.includes(skill.toLowerCase()));
      
      return {
        ...career,
        matchScore: score,
        matchedSkills: matches,
        skillGap: gap
      };
    }).sort((a, b) => b.matchScore - a.matchScore);

    setRecommendations(matched);
    if (matched.length > 0) {
      setSelectedCareer(matched[0]);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveSuccess(false);

    const skills = parseInput(skillsText);
    const interests = parseInput(interestsText);

    try {
      const response = await axios.post(`${API_URL}/profile`, {
        email: user.email,
        skills,
        interests,
        education
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('careerToken')}` }
      });

      if (response.data.success) {
        setSaveSuccess(true);
        runRecommendationEngine(skills, interests);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-dark)',
      display: 'flex',
      color: 'white',
      position: 'relative',
      zIndex: 10
    }}>
      {/* Sidebar Navigation */}
      <div style={{
        width: '280px',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        background: 'rgba(5, 8, 22, 0.85)',
        backdropFilter: 'blur(20px)',
        padding: '30px 20px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        flexShrink: 0
      }} className="sidebar">
        <div>
          {/* Brand */}
          <div 
            onClick={() => navigate('/')} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              cursor: 'pointer',
              marginBottom: '40px'
            }}
          >
            <span style={{
              fontWeight: 800,
              fontSize: '1.2rem',
              fontFamily: 'Space Grotesk, sans-serif'
            }} className="gradient-text">
              ARYAN KUMAR
            </span>
          </div>

          {/* User profile brief */}
          {user && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px',
              borderRadius: '16px',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.05)',
              marginBottom: '30px'
            }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '1.1rem'
              }}>
                {user.name ? user.name[0].toUpperCase() : 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {user.name || 'User'}
                </h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  {user.email}
                </p>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <button 
              onClick={() => setActiveTab('dashboard')} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'dashboard' ? 'rgba(99, 102, 241, 0.15)' : 'none',
                color: activeTab === 'dashboard' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease'
              }}
            >
              <FaCompass style={{ fontSize: '1.1rem' }} /> Career Dashboard
            </button>
            
            <button 
              onClick={() => setActiveTab('assessment')} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'assessment' ? 'rgba(99, 102, 241, 0.15)' : 'none',
                color: activeTab === 'assessment' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease'
              }}
            >
              <FaClipboardList style={{ fontSize: '1.1rem' }} /> Career Quiz {quizCompleted && <FaCheck style={{ color: 'var(--accent2)', fontSize: '0.75rem', marginLeft: 'auto' }} />}
            </button>

            <button 
              onClick={() => setActiveTab('resume')} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'resume' ? 'rgba(99, 102, 241, 0.15)' : 'none',
                color: activeTab === 'resume' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease'
              }}
            >
              <FaFileInvoice style={{ fontSize: '1.1rem' }} /> CV Builder
            </button>

            <button 
              onClick={() => setActiveTab('mentor')} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'mentor' ? 'rgba(99, 102, 241, 0.15)' : 'none',
                color: activeTab === 'mentor' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease'
              }}
            >
              <FaUserGraduate style={{ fontSize: '1.1rem' }} /> Mock Mentorship
            </button>

            <button 
              onClick={() => setActiveTab('feedback')} 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: '14px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeTab === 'feedback' ? 'rgba(99, 102, 241, 0.15)' : 'none',
                color: activeTab === 'feedback' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: 600,
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.3s ease'
              }}
            >
              <FaComments style={{ fontSize: '1.1rem' }} /> Submit Feedback
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div>
          <button 
            onClick={handleLogout} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              width: '100%',
              padding: '14px 16px',
              borderRadius: '12px',
              border: 'none',
              background: 'none',
              color: '#f87171',
              fontWeight: 600,
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'all 0.3s ease'
            }}
          >
            <FaSignOutAlt /> Sign Out
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div style={{
        flexGrow: 1,
        padding: '50px 40px',
        overflowY: 'auto',
        height: '100vh'
      }} className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              transition={{ duration: 0.3 }}
            >
              <h1 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Space Grotesk', marginBottom: '8px' }}>
                Career Dashboard
              </h1>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
                Manage your developer credentials and scan your career match indicators.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '30px' }} className="dashboard-grid">
                
                {/* Profile update form */}
                <div className="glass" style={{ padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', height: 'fit-content' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                    <FaUser style={{ color: 'var(--primary)' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Space Grotesk' }}>My Profile</h3>
                  </div>

                  {saveSuccess && (
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.1)',
                      border: '1px solid rgba(16, 185, 129, 0.3)',
                      color: '#34d399',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '20px',
                      fontSize: '0.9rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <FaCheck /> Profile updated and recommendations refreshed!
                    </div>
                  )}

                  <form onSubmit={handleSaveProfile} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>
                        Current Education Level
                      </label>
                      <select 
                        value={education} 
                        onChange={(e) => setEducation(e.target.value)}
                        className="form-input"
                        style={{ width: '100%', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                      >
                        <option value="First Year Undergrad" style={{ background: '#0d1117' }}>First Year Undergrad</option>
                        <option value="Second Year Undergrad" style={{ background: '#0d1117' }}>Second Year Undergrad</option>
                        <option value="Third Year Undergrad" style={{ background: '#0d1117' }}>Third Year Undergrad</option>
                        <option value="Final Year Undergrad" style={{ background: '#0d1117' }}>Final Year Undergrad</option>
                        <option value="Post-Graduate / Masters" style={{ background: '#0d1117' }}>Post-Graduate / Masters</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>
                        Skills (comma separated)
                      </label>
                      <textarea
                        required
                        rows="3"
                        placeholder="React, JavaScript, HTML5, CSS3, Python"
                        value={skillsText}
                        onChange={(e) => setSkillsText(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '8px', fontWeight: 500 }}>
                        Key Interests (comma separated)
                      </label>
                      <textarea
                        required
                        rows="2"
                        placeholder="Web development, Mobile apps, AI, Games"
                        value={interestsText}
                        onChange={(e) => setInterestsText(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <button type="submit" disabled={saving} className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                      {saving ? 'Saving...' : 'Save & Refresh Matches'}
                    </button>
                  </form>
                </div>

                {/* Match indicator area */}
                <div>
                  <div className="glass" style={{ padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '30px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Space Grotesk' }}>Matched Careers</h3>
                      <button 
                        onClick={() => {
                          const skills = parseInput(skillsText);
                          const interests = parseInput(interestsText);
                          runRecommendationEngine(skills, interests);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem', fontWeight: 600 }}
                      >
                        <FaSync /> Re-match
                      </button>
                    </div>

                    {recommendations.length === 0 ? (
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                        Please enter your profile details and skills to generate career pathway matches.
                      </p>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {recommendations.slice(0, 3).map((career, idx) => (
                          <div 
                            key={idx} 
                            onClick={() => setSelectedCareer(career)}
                            style={{
                              padding: '16px 20px',
                              borderRadius: '12px',
                              border: `1px solid ${selectedCareer?.title === career.title ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}`,
                              background: selectedCareer?.title === career.title ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255,255,255,0.01)',
                              cursor: 'pointer',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              transition: 'all 0.3s ease'
                            }}
                          >
                            <div>
                              <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '4px' }}>{career.title}</h4>
                              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{career.domain}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <span style={{
                                fontSize: '1.15rem',
                                fontWeight: 800,
                                color: career.matchScore > 75 ? 'var(--accent2)' : career.matchScore > 40 ? 'var(--primary)' : '#f87171'
                              }}>{career.matchScore}%</span>
                              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Match Rating</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Selected Career Analysis */}
                  {selectedCareer && (
                    <div className="glass" style={{ padding: '30px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
                      <h3 style={{ fontSize: '1.35rem', fontWeight: 700, fontFamily: 'Space Grotesk', marginBottom: '8px' }}>
                        {selectedCareer.title} Analytics
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '24px', lineHeight: '1.5' }}>
                        {selectedCareer.desc}
                      </p>

                      {/* Skill Gap */}
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <FaExclamationTriangle style={{ color: '#fbbf24' }} /> Skill Gap Analysis
                      </h4>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '24px' }}>
                        {selectedCareer.matchedSkills.map((sk, sIdx) => (
                          <span key={sIdx} className="tech-tag" style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#34d399' }}>
                            ✓ {sk}
                          </span>
                        ))}
                        {selectedCareer.skillGap.map((sk, sIdx) => (
                          <span key={sIdx} className="tech-tag" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171' }}>
                            + Need {sk}
                          </span>
                        ))}
                      </div>

                      {/* Learning Resources */}
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <FaBook style={{ color: 'var(--accent)' }} /> Suggested Career Resources
                      </h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {selectedCareer.resources.map((res, rIdx) => (
                          <a 
                            key={rIdx}
                            href={res.url} 
                            target="_blank" 
                            rel="noreferrer" 
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '12px 16px',
                              borderRadius: '8px',
                              background: 'rgba(255,255,255,0.02)',
                              border: '1px solid rgba(255,255,255,0.05)',
                              color: 'white',
                              textDecoration: 'none',
                              fontSize: '0.85rem',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                              e.currentTarget.style.borderColor = 'var(--accent)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'rgba(255,255,255,0.02)';
                              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.05)';
                            }}
                          >
                            <div>
                              <span style={{ fontWeight: 600 }}>{res.name}</span>
                              <span style={{ color: 'var(--text-secondary)', marginLeft: '8px', fontSize: '0.75rem' }}>({res.provider})</span>
                            </div>
                            <FaArrowRight style={{ color: 'var(--accent)', fontSize: '0.75rem' }} />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

              </div>
            </motion.div>
          )}

          {activeTab === 'assessment' && (
            <CareerAssessment key="assessment" user={user} onComplete={() => setQuizCompleted(true)} />
          )}

          {activeTab === 'resume' && (
            <ResumeBuilder key="resume" user={user} />
          )}

          {activeTab === 'mentor' && (
            <MentorScheduler key="mentor" user={user} />
          )}

          {activeTab === 'feedback' && (
            <AIFeedback key="feedback" user={user} />
          )}
        </AnimatePresence>
      </div>

      <style>{`
        @media (max-width: 1000px) {
          .dashboard-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 768px) {
          flex-direction: column !important;
          .sidebar {
            width: 100% !important;
            height: auto !important;
            border-right: none !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08) !important;
          }
          .main-content {
            height: auto !important;
            padding: 30px 20px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AICareerDashboard;
