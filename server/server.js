const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// If no .env file in parent, try local
if (!process.env.MONGO_URI) {
  dotenv.config();
}

// Connect to MongoDB
connectDB();

const app = express();

// Trust proxy if behind load balancer/reverse proxy (Nginx, Heroku, etc.)
app.set('trust proxy', 1);

// --- Rate Limiting ---
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // Limit each IP to 300 requests per 15 minutes
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // Limit each IP to 30 requests per 15 minutes for auth endpoints
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many login or registration attempts. Please try again after 15 minutes.'
  }
});

// Apply rate limiters (applied before other middlewares to reject early)
app.use('/api', globalLimiter);
app.use('/api/auth', authLimiter);

// --- Middleware ---

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    credentials: true,
  })
);

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static assets
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API Routes ---
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/pickups', require('./routes/pickup.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/collector', require('./routes/collector.routes'));
app.use('/api/admin', require('./routes/admin.routes'));
app.use('/api/rewards', require('./routes/reward.routes'));
app.use('/api/notifications', require('./routes/notification.routes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'E-Waste Management API is running 🌱' });
});

// Serve React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'client', 'dist', 'index.html'));
  });
}

// Global error handler (must be last middleware)
app.use(errorHandler);

// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🌍 Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;
