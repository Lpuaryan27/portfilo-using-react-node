const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// JSON DB Files
const DB_FILE = path.join(__dirname, 'messages.json');
const USERS_FILE = path.join(__dirname, 'users.json');
const PROFILES_FILE = path.join(__dirname, 'profiles.json');
const ASSESSMENTS_FILE = path.join(__dirname, 'quiz_results.json');
const RESUMES_FILE = path.join(__dirname, 'resumes.json');
const BOOKINGS_FILE = path.join(__dirname, 'bookings.json');
const FEEDBACK_FILE = path.join(__dirname, 'ai_feedback.json');

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'], // Vite development ports
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());

// Helper function to read from JSON DB files
const readData = (filePath) => {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2));
    return [];
  }
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContent || '[]');
  } catch (err) {
    console.error(`Error reading database file: ${filePath}`, err);
    return [];
  }
};

// Helper function to write to JSON DB files
const writeData = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (err) {
    console.error(`Error writing database file: ${filePath}`, err);
    return false;
  }
};

// Auth validation middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Unauthorized user credentials.' });
  }
  
  // Proceed simply for college-level project local mock authorization
  req.token = token;
  next();
};

// Initialize DB Files
[DB_FILE, USERS_FILE, PROFILES_FILE, ASSESSMENTS_FILE, RESUMES_FILE, BOOKINGS_FILE, FEEDBACK_FILE].forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify(file === PROFILES_FILE || file === RESUMES_FILE ? {} : [], null, 2));
  }
});

// Routes
app.get('/', (req, res) => {
  res.json({ status: 'active', message: "Aryan Kumar's portfolio API server running." });
});

// Post Contact Message
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ success: false, error: 'Name, email, and message are required.' });
  }

  const newMessage = {
    id: Date.now(),
    name,
    email,
    subject: subject || 'No Subject',
    message,
    timestamp: new Date().toISOString()
  };

  const messages = readData(DB_FILE);
  messages.push(newMessage);
  writeData(DB_FILE, messages);
  
  console.log(`[New Message Received] From: ${name} (${email})`);
  return res.json({ success: true, message: 'Message saved successfully.' });
});

// Get Messages (Admin access)
app.get('/api/messages', (req, res) => {
  const messages = readData(DB_FILE);
  res.json({ success: true, count: messages.length, messages });
});

/* ==========================================================================
   AI CAREER ENDPOINTS
   ========================================================================== */

// Auth: Sign Up
app.post('/api/ai-career/auth/signup', (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, error: 'Name, email, and password are required.' });
  }

  const users = readData(USERS_FILE);
  const userExists = users.some(u => u.email.toLowerCase() === email.toLowerCase());

  if (userExists) {
    return res.status(400).json({ success: false, error: 'Account with this email already exists.' });
  }

  const newUser = {
    id: Date.now(),
    name,
    email: email.toLowerCase(),
    password, // Stored directly/simply for local year-1 project setup
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  writeData(USERS_FILE, users);

  console.log(`[User Signed Up] Name: ${name}, Email: ${email}`);
  
  const token = `mock-token-${Buffer.from(email).toString('base64')}`;
  return res.json({
    success: true,
    user: { name: newUser.name, email: newUser.email },
    token
  });
});

// Auth: Login
app.post('/api/ai-career/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Email and password are required.' });
  }

  const users = readData(USERS_FILE);
  const user = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);

  if (!user) {
    return res.status(400).json({ success: false, error: 'Invalid email or password combination.' });
  }

  console.log(`[User Logged In] Email: ${email}`);
  
  const token = `mock-token-${Buffer.from(email).toString('base64')}`;
  return res.json({
    success: true,
    user: { name: user.name, email: user.email },
    token
  });
});

// Profile: Get Details
app.get('/api/ai-career/profile', authenticateToken, (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email parameter is required.' });
  }

  const profilesMap = JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf8') || '{}');
  const userProfile = profilesMap[email.toLowerCase()];

  if (!userProfile) {
    return res.json({
      success: true,
      profile: {
        skills: [],
        interests: [],
        education: 'First Year Undergrad'
      }
    });
  }

  return res.json({ success: true, profile: userProfile });
});

// Profile: Save/Update Details
app.post('/api/ai-career/profile', authenticateToken, (req, res) => {
  const { email, skills, interests, education } = req.body;

  if (!email || !Array.isArray(skills) || !Array.isArray(interests)) {
    return res.status(400).json({ success: false, error: 'Email, skills, and interests arrays are required.' });
  }

  const profilesMap = JSON.parse(fs.readFileSync(PROFILES_FILE, 'utf8') || '{}');
  profilesMap[email.toLowerCase()] = {
    skills,
    interests,
    education: education || 'First Year Undergrad',
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(PROFILES_FILE, JSON.stringify(profilesMap, null, 2));
  console.log(`[Profile Updated] Email: ${email}`);
  return res.json({ success: true });
});

// Assessment: Get Results
app.get('/api/ai-career/assessment', authenticateToken, (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email parameter is required.' });
  }

  const assessments = readData(ASSESSMENTS_FILE);
  const userResults = assessments.filter(a => a.email.toLowerCase() === email.toLowerCase());

  return res.json({ success: true, results: userResults });
});

// Assessment: Save Results
app.post('/api/ai-career/assessment', authenticateToken, (req, res) => {
  const { email, score, industry, creativity, analytical, routine, motivator } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required to save quiz results.' });
  }

  const assessments = readData(ASSESSMENTS_FILE);
  const newResult = {
    id: Date.now(),
    email: email.toLowerCase(),
    score: score || 0,
    industry: industry || 'Tech',
    creativity: creativity || 5,
    analytical: analytical || 5,
    routine: routine || 'flexible',
    motivator: motivator || 'growth',
    timestamp: new Date().toISOString()
  };

  assessments.push(newResult);
  writeData(ASSESSMENTS_FILE, assessments);

  console.log(`[Assessment Completed] Email: ${email}, Score: ${score}%`);
  return res.json({ success: true });
});

// Resume: Get Details
app.get('/api/ai-career/resume', authenticateToken, (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email parameter is required.' });
  }

  const resumesMap = JSON.parse(fs.readFileSync(RESUMES_FILE, 'utf8') || '{}');
  const resume = resumesMap[email.toLowerCase()];

  return res.json({ success: true, resume: resume || null });
});

// Resume: Save Details
app.post('/api/ai-career/resume', authenticateToken, (req, res) => {
  const { email, personal, summary, skills, education, experience, projects, certifications } = req.body;

  if (!email || !personal) {
    return res.status(400).json({ success: false, error: 'Email and personal details are required.' });
  }

  const resumesMap = JSON.parse(fs.readFileSync(RESUMES_FILE, 'utf8') || '{}');
  resumesMap[email.toLowerCase()] = {
    personal,
    summary: summary || '',
    skills: skills || [],
    education: education || [],
    experience: experience || [],
    projects: projects || [],
    certifications: certifications || [],
    updatedAt: new Date().toISOString()
  };

  fs.writeFileSync(RESUMES_FILE, JSON.stringify(resumesMap, null, 2));
  console.log(`[Resume Saved] Email: ${email}`);
  return res.json({ success: true });
});

// Mentors: Get Bookings
app.get('/api/ai-career/mentors/bookings', authenticateToken, (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email parameter is required.' });
  }

  const bookings = readData(BOOKINGS_FILE);
  const userBookings = bookings.filter(b => b.email.toLowerCase() === email.toLowerCase());

  return res.json({ success: true, bookings: userBookings });
});

// Mentors: Book Session
app.post('/api/ai-career/mentors/book', authenticateToken, (req, res) => {
  const { email, mentorId, mentorName, mentorRole, domain, avatar, date, timeSlot, topic } = req.body;

  if (!email || !mentorName || !date || !timeSlot || !topic) {
    return res.status(400).json({ success: false, error: 'Please provide all booking requirements.' });
  }

  const bookings = readData(BOOKINGS_FILE);
  const newBooking = {
    id: Date.now(),
    email: email.toLowerCase(),
    mentorId,
    mentorName,
    mentorRole,
    domain,
    avatar,
    date,
    timeSlot,
    topic,
    bookedAt: new Date().toISOString()
  };

  bookings.push(newBooking);
  writeData(BOOKINGS_FILE, bookings);

  console.log(`[Session Booked] Email: ${email} booked ${mentorName} on ${date} at ${timeSlot}`);
  return res.json({ success: true });
});

// Feedback: Submit Review
app.post('/api/ai-career/feedback', authenticateToken, (req, res) => {
  const { email, name, overallRating, featureRating, feedbackText } = req.body;

  if (!email || !overallRating || !feedbackText) {
    return res.status(400).json({ success: false, error: 'Email, rating, and feedback commentary are required.' });
  }

  const feedbacks = readData(FEEDBACK_FILE);
  const newFeedback = {
    id: Date.now(),
    email: email.toLowerCase(),
    name: name || 'Anonymous',
    overallRating,
    featureRating: featureRating || {},
    feedbackText,
    submittedAt: new Date().toISOString()
  };

  feedbacks.push(newFeedback);
  writeData(FEEDBACK_FILE, feedbacks);

  console.log(`[Feedback Received] Email: ${email}, Rating: ${overallRating}`);
  return res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
