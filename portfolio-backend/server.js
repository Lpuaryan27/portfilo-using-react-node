const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const DB_FILE = path.join(__dirname, 'messages.json');

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'], // Vite development ports
  methods: ['GET', 'POST'],
  credentials: true
}));
app.use(express.json());

// Initialize Local JSON File DB if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2));
}

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

  try {
    const fileData = fs.readFileSync(DB_FILE, 'utf8');
    const messages = JSON.parse(fileData || '[]');
    messages.push(newMessage);
    fs.writeFileSync(DB_FILE, JSON.stringify(messages, null, 2));
    
    console.log(`[New Message Received] From: ${name} (${email})`);
    return res.json({ success: true, message: 'Message saved successfully.' });
  } catch (err) {
    console.error('Error saving message:', err);
    return res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

// Get Messages (Admin access)
app.get('/api/messages', (req, res) => {
  try {
    const fileData = fs.readFileSync(DB_FILE, 'utf8');
    const messages = JSON.parse(fileData || '[]');
    res.json({ success: true, count: messages.length, messages });
  } catch (err) {
    console.error('Error reading messages:', err);
    res.status(500).json({ success: false, error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
