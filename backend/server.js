const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Smart Local Tourism Portal API is healthy and running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.send('Welcome to the Smart Local Tourism Business Portal API. Access /api/health for system status.');
});

// Route imports with graceful fallbacks
const safeUse = (path, routeModule) => {
  try {
    app.use(path, require(routeModule));
  } catch (err) {
    if (err.code !== 'MODULE_NOT_FOUND') {
      console.warn(`[Route Init] Warning loading ${routeModule}:`, err.message);
    }
    app.use(path, (req, res) => {
      res.status(501).json({
        message: `Endpoint ${path} is being initialized in upcoming development stage.`
      });
    });
  }
};

safeUse('/api/auth', './routes/authRoutes');
safeUse('/api/destinations', './routes/destinationRoutes');
safeUse('/api/businesses', './routes/businessRoutes');
safeUse('/api/bookings', './routes/bookingRoutes');
safeUse('/api/reviews', './routes/reviewRoutes');
safeUse('/api/recommendations', './routes/recommendationRoutes');
safeUse('/api/itineraries', './routes/itineraryRoutes');
safeUse('/api/admin', './routes/adminRoutes');

// 404 Handler
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Resource not found: ${req.originalUrl}`
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Error]', err.stack || err.message);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`[Server] Smart Local Tourism Portal API running on http://localhost:${PORT}`);
});
