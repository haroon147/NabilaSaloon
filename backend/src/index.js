require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const helmet  = require('helmet');
const morgan  = require('morgan');

const connectDB      = require('./config/db');
const authRoutes     = require('./routes/auth');
const serviceRoutes  = require('./routes/services');
const employeeRoutes = require('./routes/employees');
const bookingRoutes  = require('./routes/bookings');
const adminRoutes    = require('./routes/admin');
const { errorHandler } = require('./middleware/errorHandler');

const app  = express();
const PORT = process.env.PORT || 5000;

// ── Security & logging ────────────────────────────────────────────────────────
app.use(helmet());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// ── CORS ──────────────────────────────────────────────────────────────────────
app.use(cors({
  origin: [
    'http://localhost:5173',  // Vite dev
    'http://localhost:4173',  // Vite preview
    'http://localhost:3000',
  ],
  credentials: true,
}));

// ── Body parsing ──────────────────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), env: process.env.NODE_ENV });
});

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes);
app.use('/api/services',  serviceRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/bookings',  bookingRoutes);
app.use('/api/admin',     adminRoutes);

// ── 404 ───────────────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ── Global error handler ──────────────────────────────────────────────────────
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀  Nabila Salon API running on http://localhost:${PORT}`);
    console.log(`📦  Environment: ${process.env.NODE_ENV}`);
  });
});
