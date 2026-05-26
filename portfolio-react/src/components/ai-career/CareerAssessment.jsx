import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaGraduationCap, FaChevronRight, FaChevronLeft, FaChartPie, FaRocket } from 'react-icons/fa';
import axios from 'axios';

import { API_URL } from './config';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: 'Which industry vertical excites you the most?',
    type: 'radio',
    name: 'industry',
    options: [
      { label: 'Technology (Software, Apps, AI, Data)', value: 'Tech' },
      { label: 'Healthcare & Biotech (Devices, Research, Systems)', value: 'Healthcare' },
      { label: 'Finance & Banking (Trading, Venture, Analytics)', value: 'Finance' },
      { label: 'Creative Arts & Media (UI/UX, Games, Branding)', value: 'Arts' },
      { label: 'Business & Management (Product, Strategy, Operations)', value: 'Business' }
    ]
  },
  {
    id: 2,
    question: 'How do you rate your affinity for creativity and visual design? (1-10)',
    type: 'slider',
    name: 'creativity',
    min: 1,
    max: 10,
    defaultValue: 5
  },
  {
    id: 3,
    question: 'How do you rate your logical and analytical thinking capability? (1-10)',
    type: 'slider',
    name: 'analytical',
    min: 1,
    max: 10,
    defaultValue: 5
  },
  {
    id: 4,
    question: 'Do you prefer routine tasks and stability over constant problem-solving challenges?',
    type: 'radio',
    name: 'routine',
    options: [
      { label: 'Yes, I prefer structured routines and stable guidelines.', value: 'Yes' },
      { label: 'No, I thrive in fast-paced challenges and open-ended problems.', value: 'No' }
    ]
  },
  {
    id: 5,
    question: 'What is your core motivator in a career?',
    type: 'radio',
    name: 'motivator',
    options: [
      { label: 'Leadership & driving strategy', value: 'Leadership' },
      { label: 'Innovation & technical building', value: 'Innovation' },
      { label: 'Helping others & social impact', value: 'Impact' },
      { label: 'Financial success & stability', value: 'Success' }
    ]
  }
];

const CareerAssessment = ({ user, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    industry: 'Tech',
    creativity: 5,
    analytical: 5,
    routine: 'No',
    motivator: 'Innovation'
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleRadioChange = (name, value) => {
    setAnswers({ ...answers, [name]: value });
  };

  const handleSliderChange = (name, value) => {
    setAnswers({ ...answers, [name]: parseInt(value) });
  };

  const handleNext = () => {
    if (currentStep < QUIZ_QUESTIONS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      submitQuiz();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const submitQuiz = async () => {
    setLoading(true);
    // Simple dynamic heuristic to match career domains
    const scores = {
      'Software Engineering': 50,
      'Data Science': 50,
      'Artificial Intelligence': 50,
      'Product Management': 50,
      'UI/UX Design': 50
    };

    const { industry, creativity, analytical, routine, motivator } = answers;

    // Process logic
    if (industry === 'Tech') {
      scores['Software Engineering'] += 30;
      scores['Artificial Intelligence'] += 30;
      scores['Data Science'] += 20;
    } else if (industry === 'Arts') {
      scores['UI/UX Design'] += 40;
    } else if (industry === 'Business') {
      scores['Product Management'] += 35;
    } else if (industry === 'Finance') {
      scores['Data Science'] += 25;
    }

    // Creativity additions
    scores['UI/UX Design'] += creativity * 4;
    scores['Product Management'] += creativity * 2;

    // Analytical additions
    scores['Artificial Intelligence'] += analytical * 4;
    scores['Data Science'] += analytical * 4;
    scores['Software Engineering'] += analytical * 2;

    // Routine additions
    if (routine === 'Yes') {
      scores['Software Engineering'] += 5;
    } else {
      scores['Artificial Intelligence'] += 15;
      scores['Product Management'] += 15;
    }

    // Motivator additions
    if (motivator === 'Innovation') {
      scores['Artificial Intelligence'] += 20;
      scores['Software Engineering'] += 15;
      scores['UI/UX Design'] += 10;
    } else if (motivator === 'Leadership') {
      scores['Product Management'] += 25;
    } else if (motivator === 'Impact') {
      scores['Software Engineering'] += 10;
      scores['UI/UX Design'] += 15;
    }

    // Normalize to max 100%
    const calculatedResults = Object.keys(scores).map(domain => {
      let finalScore = Math.min(Math.round(scores[domain]), 100);
      return { domain, score: finalScore };
    }).sort((a, b) => b.score - a.score);

    try {
      const response = await axios.post(`${API_URL}/assessment`, {
        email: user.email,
        answers,
        results: calculatedResults
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('careerToken')}` }
      });

      if (response.data.success) {
        setResult(calculatedResults);
        if (onComplete) onComplete();
      }
    } catch (err) {
      console.error(err);
      // fallback even if server is disconnected
      setResult(calculatedResults);
    } finally {
      setLoading(false);
    }
  };

  const activeQuestion = QUIZ_QUESTIONS[currentStep];

  return (
    <div style={{ maxWidth: '750px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Space Grotesk', marginBottom: '8px' }}>
        Career Assessment Quiz
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
        Answer this questionnaire to run matching analytics on your optimal industry career vectors.
      </p>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key="quiz-body"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass"
            style={{
              padding: '40px',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            {/* Step Indicators */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '30px' }}>
              {QUIZ_QUESTIONS.map((q, idx) => (
                <div 
                  key={idx}
                  style={{
                    height: '6px',
                    flexGrow: 1,
                    borderRadius: '4px',
                    background: idx <= currentStep ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
                    transition: 'all 0.3s ease'
                  }}
                />
              ))}
            </div>

            <span style={{ fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600, display: 'block', marginBottom: '12px' }}>
              QUESTION {currentStep + 1} OF {QUIZ_QUESTIONS.length}
            </span>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: '30px', lineHeight: '1.4', fontFamily: 'Space Grotesk' }}>
              {activeQuestion.question}
            </h3>

            {/* Inputs based on type */}
            <div style={{ marginBottom: '40px' }}>
              {activeQuestion.type === 'radio' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {activeQuestion.options.map((opt, oIdx) => (
                    <label 
                      key={oIdx}
                      style={{
                        padding: '16px 20px',
                        borderRadius: '12px',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        background: answers[activeQuestion.name] === opt.value ? 'rgba(99, 102, 241, 0.1)' : 'rgba(0,0,0,0.2)',
                        borderColor: answers[activeQuestion.name] === opt.value ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        fontSize: '0.95rem',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <input 
                        type="radio" 
                        name={activeQuestion.name} 
                        value={opt.value}
                        checked={answers[activeQuestion.name] === opt.value}
                        onChange={() => handleRadioChange(activeQuestion.name, opt.value)}
                        style={{ accentColor: 'var(--primary)' }}
                      />
                      {opt.label}
                    </label>
                  ))}
                </div>
              )}

              {activeQuestion.type === 'slider' && (
                <div style={{ padding: '10px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    <span>Low ({activeQuestion.min})</span>
                    <span style={{ fontSize: '1.5rem', color: 'var(--accent)', fontWeight: 700 }}>
                      {answers[activeQuestion.name]}
                    </span>
                    <span>High ({activeQuestion.max})</span>
                  </div>
                  <input 
                    type="range" 
                    min={activeQuestion.min} 
                    max={activeQuestion.max}
                    value={answers[activeQuestion.name]}
                    onChange={(e) => handleSliderChange(activeQuestion.name, e.target.value)}
                    style={{
                      width: '100%',
                      accentColor: 'var(--primary)',
                      height: '8px',
                      background: 'rgba(255,255,255,0.1)',
                      borderRadius: '8px',
                      outline: 'none'
                    }}
                  />
                </div>
              )}
            </div>

            {/* Navigation buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <button
                onClick={handlePrev}
                disabled={currentStep === 0}
                className="btn-outline"
                style={{
                  padding: '12px 24px',
                  fontSize: '0.9rem',
                  opacity: currentStep === 0 ? 0.3 : 1,
                  cursor: currentStep === 0 ? 'not-allowed' : 'pointer'
                }}
              >
                <FaChevronLeft /> Previous
              </button>
              
              <button
                onClick={handleNext}
                disabled={loading}
                className="btn-primary"
                style={{
                  padding: '12px 28px',
                  fontSize: '0.9rem'
                }}
              >
                {loading ? 'Evaluating...' : currentStep === QUIZ_QUESTIONS.length - 1 ? (
                  <>Submit <FaRocket /></>
                ) : (
                  <>Next <FaChevronRight /></>
                )}
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="quiz-result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass"
            style={{
              padding: '40px',
              borderRadius: '24px',
              border: '1px solid rgba(255,255,255,0.06)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <FaGraduationCap style={{ fontSize: '2rem', color: 'var(--accent2)' }} />
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'Space Grotesk' }}>
                Your Matches Recommended Path
              </h3>
            </div>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '30px', lineHeight: '1.5' }}>
              Based on your design affinity, analytical logic profile, and workspace vertical preferences, our matching engine has generated the following career suitability indexes:
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
              {result.map((res, rIdx) => (
                <div key={rIdx}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.92rem', fontWeight: 600, marginBottom: '6px' }}>
                    <span>{res.domain}</span>
                    <span style={{ color: rIdx === 0 ? 'var(--accent2)' : 'var(--text-secondary)' }}>
                      {res.score}% Suitability
                    </span>
                  </div>
                  <div style={{ height: '8px', background: 'rgba(255,255,255,0.06)', borderRadius: '10px', overflow: 'hidden' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${res.score}%` }}
                      transition={{ duration: 0.8, delay: rIdx * 0.1 }}
                      style={{
                        height: '100%',
                        borderRadius: '10px',
                        background: rIdx === 0 
                          ? 'linear-gradient(90deg, var(--primary), var(--accent2))' 
                          : 'linear-gradient(90deg, rgba(99, 102, 241, 0.4), rgba(99, 102, 241, 0.8))'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => setResult(null)}
                className="btn-primary"
              >
                Retake Assessment <FaChartPie />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CareerAssessment;
