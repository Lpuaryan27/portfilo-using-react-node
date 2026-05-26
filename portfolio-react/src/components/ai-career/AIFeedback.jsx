import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaPaperPlane, FaCheckCircle, FaSpinner } from 'react-icons/fa';
import axios from 'axios';

import { API_URL } from './config';

const AIFeedback = ({ user }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [featureRating, setFeatureRating] = useState({
    quiz: 5,
    resume: 5,
    mentors: 5
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      setError('Please provide comments on your experience.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await axios.post(`${API_URL}/feedback`, {
        email: user.email,
        name: user.name,
        overallRating: rating,
        featureRating,
        feedbackText
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('careerToken')}` }
      });

      if (response.data.success) {
        setSuccess(true);
        setFeedbackText('');
        setRating(5);
        setFeatureRating({ quiz: 5, resume: 5, mentors: 5 });
      } else {
        setError(response.data.error || 'Failed to submit feedback.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'An error occurred while submitting feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureRatingChange = (feature, val) => {
    setFeatureRating(prev => ({
      ...prev,
      [feature]: val
    }));
  };

  return (
    <div>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Space Grotesk', marginBottom: '8px' }}>
        System Feedback
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
        Your review helps us refine the career recommendation model, mentor mappings, and resume analysis engine.
      </p>

      <div style={{ maxWidth: '700px' }}>
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass"
              style={{
                padding: '40px',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.08)',
                textAlign: 'center',
                background: 'rgba(16, 185, 129, 0.03)'
              }}
            >
              <FaCheckCircle style={{ color: '#34d399', fontSize: '4.5rem', marginBottom: '24px' }} />
              <h2 style={{ fontSize: '1.75rem', fontWeight: 800, fontFamily: 'Space Grotesk', marginBottom: '12px' }}>
                Thank You for Your Feedback!
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', marginBottom: '30px', maxWidth: '500px', margin: '0 auto 30px' }}>
                We have logged your ratings. Aryan Kumar's AI Compass will use these evaluations to optimize recommendation vectors and refine the student experience.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="btn-primary" 
                style={{ padding: '12px 30px' }}
              >
                Submit Another Response
              </button>
            </motion.div>
          ) : (
            <motion.form 
              onSubmit={handleSubmitFeedback}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="glass"
              style={{
                padding: '40px',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.06)',
                display: 'flex',
                flexDirection: 'column',
                gap: '30px'
              }}
            >
              {error && (
                <div style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  padding: '14px 18px',
                  borderRadius: '8px',
                  fontSize: '0.9rem'
                }}>
                  {error}
                </div>
              )}

              {/* Overall Star Rating */}
              <div>
                <label style={{ display: 'block', fontSize: '1rem', fontWeight: 700, fontFamily: 'Space Grotesk', marginBottom: '10px' }}>
                  Overall Platform Rating
                </label>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
                  Rate your experience with AI Career Compass navigation and performance.
                </p>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '4px',
                        transition: 'transform 0.2s ease'
                      }}
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <FaStar 
                        style={{
                          fontSize: '2.5rem',
                          color: (hoverRating || rating) >= star ? '#fbbf24' : 'rgba(255, 255, 255, 0.1)',
                          transition: 'color 0.2s ease'
                        }}
                      />
                    </button>
                  ))}
                  <span style={{ marginLeft: '12px', fontSize: '1.1rem', fontWeight: 700, color: '#fbbf24' }}>
                    {rating === 5 ? 'Excellent!' : rating === 4 ? 'Good' : rating === 3 ? 'Average' : rating === 2 ? 'Poor' : 'Very Poor'}
                  </span>
                </div>
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)' }} />

              {/* Feature-specific Ratings */}
              <div>
                <label style={{ display: 'block', fontSize: '1rem', fontWeight: 700, fontFamily: 'Space Grotesk', marginBottom: '20px' }}>
                  Feature Performance Ratings
                </label>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Quiz */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 600 }}>Career Assessment & Matching</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Accuracy of matched developers careers</p>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          onClick={() => handleFeatureRatingChange('quiz', star)}
                          style={{
                            fontSize: '1.25rem',
                            cursor: 'pointer',
                            color: featureRating.quiz >= star ? 'var(--primary)' : 'rgba(255,255,255,0.1)'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Resume Builder */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 600 }}>CV Builder & AI Score Evaluator</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Utility of PDF print templates and feedback advice</p>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          onClick={() => handleFeatureRatingChange('resume', star)}
                          style={{
                            fontSize: '1.25rem',
                            cursor: 'pointer',
                            color: featureRating.resume >= star ? 'var(--primary)' : 'rgba(255,255,255,0.1)'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Mentors */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 600 }}>Mentorship Slot Scheduler</h4>
                      <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>Mock schedule and calendar interface design</p>
                    </div>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <FaStar
                          key={star}
                          onClick={() => handleFeatureRatingChange('mentors', star)}
                          style={{
                            fontSize: '1.25rem',
                            cursor: 'pointer',
                            color: featureRating.mentors >= star ? 'var(--primary)' : 'rgba(255,255,255,0.1)'
                          }}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <hr style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.06)' }} />

              {/* Comments Textarea */}
              <div>
                <label style={{ display: 'block', fontSize: '1rem', fontWeight: 700, fontFamily: 'Space Grotesk', marginBottom: '8px' }}>
                  What could be improved?
                </label>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '12px' }}>
                  Please share any recommendations, bugs or user interface ideas.
                </p>
                <textarea
                  required
                  rows="4"
                  placeholder="The matching algorithm worked great, but I'd like to see more details on certifications..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="form-input"
                  style={{ width: '100%' }}
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="btn-primary" 
                style={{ width: '100%', justifyContent: 'center', padding: '14px 0' }}
              >
                {loading ? (
                  <>
                    <FaSpinner className="spin" style={{ animation: 'spin-slow 2s linear infinite' }} /> Submitting Review...
                  </>
                ) : (
                  <>
                    <FaPaperPlane /> Submit Feedback
                  </>
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AIFeedback;
