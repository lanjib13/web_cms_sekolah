require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

const app = express();

/**
 * =========================
 * TAMBAHAN WAJIB (Railway)
 * =========================
 */
app.set('trust proxy', 1);

/**
 * =========================
 * MIDDLEWARE GLOBAL
 * =========================
 */

// Security headers
app.use(helmet({ crossOriginResourcePolicy: false }));

// CORS (tetap pakai yang lama, TIDAK diubah)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);

// Parsing request body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// Static files
app.use('/uploads', express.static('uploads'));

/**
 * =========================
 * TAMBAHAN TEST ENDPOINT
 * =========================
 */
app.get('/ping', (req, res) => {
  res.json({ status: 'ok' });
});

/**
 * =========================
 * ROUTE SAFE LOADER (TAMBAHAN)
 * =========================
 */
function safeRoute(path, routePath) {
  try {
    console.log(`Loading route: ${routePath}`);
    app.use(path, require(routePath));
    console.log(`✅ Loaded: ${routePath}`);
  } catch (err) {
    console.error(`❌ FAILED loading ${routePath}`, err);
  }
}

/**
 * =========================
 * ROUTES (TIDAK DIUBAH, HANYA DIBUNGKUS)
 * =========================
 */
safeRoute('/api/auth', './routes/auth.route');
safeRoute('/api/profile', './routes/profile.route');
safeRoute('/api/gallery', './routes/gallery.route');
safeRoute('/api/teachers', './routes/teachers.route');
safeRoute('/api/news', './routes/news.route');

/**
 * =========================
 * ERROR HANDLER (TETAP)
 * =========================
 */
app.use(require('./middlewares/error'));

console.log('✅ App initialized');

module.exports = app;
