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
app.set('trust proxy', 1); // ⬅️ TAMBAH INI

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
 * ROUTES (TIDAK DIUBAH)
 * =========================
 */
app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/profile', require('./routes/profile.route'));
app.use('/api/gallery', require('./routes/gallery.route'));
app.use('/api/teachers', require('./routes/teachers.route'));
app.use('/api/news', require('./routes/news.route'));

/**
 * =========================
 * ERROR HANDLER (TETAP)
 * =========================
 */
app.use(require('./middlewares/error'));

module.exports = app;
