// Centralized API Configuration for AI Career Compass
// By default, it connects to localhost:5000 during development.
// When you deploy your backend (e.g., to Render), replace the PROD_API_URL below with your deployed URL.

const DEV_API_URL = 'http://localhost:5000/api/ai-career';

// REPLACE THIS with your deployed backend URL once you host the portfolio-backend (e.g. on Render)
const PROD_API_URL = 'https://portfilo-using-react-node.onrender.com/api/ai-career';

export const API_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  ? DEV_API_URL
  : PROD_API_URL;
