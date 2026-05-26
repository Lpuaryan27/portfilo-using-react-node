import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaCalendarAlt, FaClock, FaVideo, FaStar, 
  FaUserGraduate, FaCheckCircle, FaSpinner, FaChevronRight 
} from 'react-icons/fa';
import axios from 'axios';

import { API_URL } from './config';

const MOCK_MENTORS = [
  {
    id: 1,
    name: 'Siddharth Sen',
    role: 'Senior Staff Engineer at Google',
    domain: 'Software Engineering',
    rating: 4.9,
    reviews: 142,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Specializes in distributed systems, scalable backend architectures, and high-performance React architectures.',
    slots: ['10:00 AM', '02:00 PM', '04:30 PM']
  },
  {
    id: 2,
    name: 'Dr. Ananya Rao',
    role: 'Principal ML Scientist at Adobe',
    domain: 'Artificial Intelligence',
    rating: 4.8,
    reviews: 98,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Deep learning researcher. Expert in computer vision, LLM fine-tuning, and neural network optimization.',
    slots: ['09:00 AM', '11:30 AM', '03:00 PM']
  },
  {
    id: 3,
    name: 'Kunal Verma',
    role: 'Lead UX Designer at Razorpay',
    domain: 'Product Design',
    rating: 4.9,
    reviews: 115,
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Passionate about customer-centric designs, design systems, usability research, and interactive prototyping.',
    slots: ['11:00 AM', '01:00 PM', '05:00 PM']
  },
  {
    id: 4,
    name: 'Priyanka Das',
    role: 'Product Lead at Microsoft',
    domain: 'Product Management',
    rating: 4.7,
    reviews: 84,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Guiding early-stage products from conception to market release. Expert in growth analytics and agile roadmap strategy.',
    slots: ['10:30 AM', '02:30 PM', '06:00 PM']
  },
  {
    id: 5,
    name: 'Rohan Sharma',
    role: 'Data Science Director at Swiggy',
    domain: 'Data Science',
    rating: 4.8,
    reviews: 73,
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    bio: 'Helps students build prediction engines, data visualizations, and masters the art of business presentations.',
    slots: ['09:30 AM', '12:00 PM', '04:00 PM']
  }
];

const MentorScheduler = ({ user }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [topic, setTopic] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/mentors/bookings`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('careerToken')}` },
        params: { email: user.email }
      });
      if (response.data.success) {
        setBookings(response.data.bookings || []);
      }
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenBooking = (mentor) => {
    setSelectedMentor(mentor);
    setDate('');
    setTimeSlot('');
    setTopic('');
    setBookingSuccess(false);
    setBookingError('');
  };

  const handleBookSession = async (e) => {
    e.preventDefault();
    if (!date || !timeSlot || !topic) {
      setBookingError('Please fill in all booking options.');
      return;
    }
    setSubmitting(true);
    setBookingError('');

    try {
      const response = await axios.post(`${API_URL}/mentors/book`, {
        email: user.email,
        mentorId: selectedMentor.id,
        mentorName: selectedMentor.name,
        mentorRole: selectedMentor.role,
        domain: selectedMentor.domain,
        avatar: selectedMentor.avatar,
        date,
        timeSlot,
        topic
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('careerToken')}` }
      });

      if (response.data.success) {
        setBookingSuccess(true);
        setTimeout(() => {
          setSelectedMentor(null);
          fetchBookings();
        }, 1800);
      } else {
        setBookingError(response.data.error || 'Failed to book session.');
      }
    } catch (err) {
      console.error(err);
      setBookingError(err.response?.data?.error || 'An error occurred while booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Get tomorrow's date format for minimum selector
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  return (
    <div>
      <h1 style={{ fontSize: '2.2rem', fontWeight: 800, fontFamily: 'Space Grotesk', marginBottom: '8px' }}>
        Mock Mentorship
      </h1>
      <p style={{ color: 'var(--text-secondary)', marginBottom: '40px' }}>
        Schedule 1-on-1 virtual mock interviews or career guidance sessions with industry engineers.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1.2fr', gap: '30px' }} className="dashboard-grid">
        
        {/* Mentor Cards Listing */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Space Grotesk', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaUserGraduate style={{ color: 'var(--primary)' }} /> Available Career Mentors
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {MOCK_MENTORS.map((mentor) => (
              <motion.div
                key={mentor.id}
                whileHover={{ y: -5 }}
                className="glass"
                style={{
                  padding: '24px',
                  borderRadius: '16px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  gap: '20px',
                  position: 'relative'
                }}
              >
                <img 
                  src={mentor.avatar} 
                  alt={mentor.name} 
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '16px',
                    objectFit: 'cover',
                    border: '2px solid rgba(99, 102, 241, 0.3)'
                  }}
                />
                <div style={{ flexGrow: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                    <div>
                      <h4 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '2px' }}>{mentor.name}</h4>
                      <p style={{ fontSize: '0.85rem', color: 'var(--accent)', fontWeight: 600, marginBottom: '6px' }}>{mentor.role}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(251, 191, 36, 0.1)', padding: '4px 10px', borderRadius: '20px', border: '1px solid rgba(251, 191, 36, 0.2)' }}>
                      <FaStar style={{ color: '#fbbf24', fontSize: '0.85rem' }} />
                      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24' }}>{mentor.rating}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>({mentor.reviews})</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: '1.5' }}>
                    {mentor.bio}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <span style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: '6px' }}>
                        {mentor.domain}
                      </span>
                    </div>
                    <button 
                      onClick={() => handleOpenBooking(mentor)}
                      className="btn-primary" 
                      style={{ padding: '8px 18px', fontSize: '0.85rem', borderRadius: '8px' }}
                    >
                      Book Session
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bookings Tracker */}
        <div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Space Grotesk', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <FaCalendarAlt style={{ color: 'var(--accent)' }} /> My Scheduled Sessions
          </h3>

          <div className="glass" style={{ padding: '24px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)', minHeight: '300px' }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px', flexDirection: 'column', gap: '10px', color: 'var(--text-secondary)' }}>
                <FaSpinner className="spin" style={{ fontSize: '1.5rem', animation: 'spin-slow 2s linear infinite' }} />
                <span>Loading sessions...</span>
              </div>
            ) : bookings.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
                <FaCalendarAlt style={{ fontSize: '2.5rem', opacity: 0.15, marginBottom: '16px' }} />
                <p style={{ fontSize: '0.95rem', fontWeight: 500 }}>No scheduled sessions yet.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '6px' }}>Choose a mentor on the left and book a virtual meet.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {bookings.map((booking, index) => (
                  <div 
                    key={index} 
                    style={{
                      padding: '16px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.01)',
                      border: '1px solid rgba(255, 255, 255, 0.04)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <img 
                      src={booking.avatar} 
                      alt={booking.mentorName} 
                      style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div style={{ flexGrow: 1, overflow: 'hidden' }}>
                      <h4 style={{ fontSize: '0.92rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                        {booking.mentorName}
                      </h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--accent)' }}>
                        {booking.topic}
                      </p>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '6px', color: 'var(--text-secondary)', fontSize: '0.72rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaCalendarAlt /> {booking.date}
                        </span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <FaClock /> {booking.timeSlot}
                        </span>
                      </div>
                    </div>
                    <a 
                      href="https://meet.google.com" 
                      target="_blank" 
                      rel="noreferrer"
                      style={{
                        padding: '8px',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        color: '#34d399',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none',
                        cursor: 'pointer'
                      }}
                      title="Join Meeting"
                    >
                      <FaVideo style={{ fontSize: '0.9rem' }} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Booking Form Modal Overlay */}
      <AnimatePresence>
        {selectedMentor && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(5, 8, 22, 0.85)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="glass"
              style={{
                width: '100%',
                maxWidth: '500px',
                borderRadius: '24px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '30px',
                position: 'relative'
              }}
            >
              {bookingSuccess ? (
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <FaCheckCircle style={{ color: '#34d399', fontSize: '4rem', marginBottom: '20px', animation: 'scaleUp 0.3s ease' }} />
                  <h3 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Space Grotesk', marginBottom: '10px' }}>Session Booked!</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                    Your session with <strong>{selectedMentor.name}</strong> is scheduled. Meeting coordinates have been saved to your dashboard.
                  </p>
                </div>
              ) : (
                <div>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 800, fontFamily: 'Space Grotesk', marginBottom: '4px' }}>Book 1:1 Consultation</h3>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '24px' }}>
                    With {selectedMentor.name} ({selectedMentor.domain})
                  </p>

                  {bookingError && (
                    <div style={{
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      marginBottom: '20px',
                      fontSize: '0.85rem'
                    }}>
                      {bookingError}
                    </div>
                  )}

                  <form onSubmit={handleBookSession} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                        Select Date
                      </label>
                      <input 
                        type="date" 
                        required
                        min={getMinDate()}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="form-input"
                        style={{ width: '100%', background: 'rgba(0,0,0,0.3)', color: 'white' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                        Select Available Slot
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        {selectedMentor.slots.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setTimeSlot(slot)}
                            style={{
                              padding: '10px 4px',
                              borderRadius: '8px',
                              border: timeSlot === slot ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
                              background: timeSlot === slot ? 'rgba(99, 102, 241, 0.2)' : 'rgba(0,0,0,0.2)',
                              color: timeSlot === slot ? 'white' : 'var(--text-secondary)',
                              fontSize: '0.82rem',
                              fontWeight: 600,
                              cursor: 'pointer',
                              textAlign: 'center'
                            }}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: '6px', fontWeight: 500 }}>
                        Session Focus/Topic
                      </label>
                      <textarea
                        required
                        rows="3"
                        placeholder="e.g. Mock technical coding interview, resume review, career roadmapping..."
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className="form-input"
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                      <button 
                        type="button" 
                        onClick={() => setSelectedMentor(null)} 
                        className="btn-outline" 
                        style={{ flexGrow: 1, justifyContent: 'center', padding: '10px 0', fontSize: '0.9rem' }}
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit" 
                        disabled={submitting}
                        className="btn-primary" 
                        style={{ flexGrow: 2, justifyContent: 'center', padding: '10px 0', fontSize: '0.9rem' }}
                      >
                        {submitting ? 'Confirming...' : 'Confirm Booking'}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MentorScheduler;
