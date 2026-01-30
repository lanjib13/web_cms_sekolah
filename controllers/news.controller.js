const db = require('../db');
const fs = require('fs');

exports.getAll = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM news ORDER BY published_at DESC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const [[row]] = await db.query(
      'SELECT * FROM news WHERE id = ?',
      [req.params.id]
    );
    res.json(row || null);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { title, content, published_at } = req.body;
    const photo = req.file
      ? `/uploads/news/${req.file.filename}`
      : null;

    await db.query(
      `INSERT INTO news (title, content, photo, published_at)
       VALUES (?, ?, ?, ?)`,
      [title, content, photo, published_at]
    );

    res.json({ message: 'Berita dibuat' });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { title, content, published_at } = req.body;
    const { id } = req.params;

    let photo = null;

    if (req.file) {
      const [[old]] = await db.query(
        'SELECT photo FROM news WHERE id = ?',
        [id]
      );

      if (old?.photo) {
        const path = old.photo.replace(/^\//, '');
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      }

      photo = `/uploads/news/${req.file.filename}`;
    }

    await db.query(
      `UPDATE news SET
        title = ?,
        content = ?,
        published_at = ?,
        photo = COALESCE(?, photo)
      WHERE id = ?`,
      [title, content, published_at, photo, id]
    );

    res.json({ message: 'Berita diperbarui' });
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const [[row]] = await db.query(
      'SELECT photo FROM news WHERE id = ?',
      [req.params.id]
    );

    if (row?.photo) {
      const path = row.photo.replace(/^\//, '');
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    }

    await db.query('DELETE FROM news WHERE id = ?', [req.params.id]);

    res.json({ message: 'Berita dihapus' });
  } catch (err) {
    next(err);
  }
};
