const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');

/**
 * REGISTER ADMIN (sekali / internal)
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        message: 'Name, email, dan password wajib diisi'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'Password minimal 6 karakter'
      });
    }

    // cek email
    const [[existing]] = await db.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    );

    if (existing) {
      return res.status(409).json({
        message: 'Email sudah terdaftar'
      });
    }

    // hash password
    const hashed = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, 'admin']
    );

    res.status(201).json({
      message: 'Admin berhasil dibuat'
    });
  } catch (err) {
    next(err);
  }
};

/**
 * LOGIN
 */
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const [rows] = await db.query(
      'SELECT * FROM users WHERE email = ? LIMIT 1',
      [email]
    );

    if (!rows.length) {
      return res.status(401).json({ message: 'Login gagal' });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Login gagal' });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '30m' }
    );

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'lax'
    });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logout berhasil' });
};

exports.me = async (req, res) => {
  const [[user]] = await db.query(
    'SELECT id, name, email, role FROM users WHERE id = ?',
    [req.user.id]
  );

  res.json(user);
};
