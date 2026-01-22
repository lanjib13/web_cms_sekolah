const db = require('../db');
const fs = require('fs');

exports.getAll = async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM news ORDER BY published_at DESC'
  );
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [[row]] = await db.query(
    'SELECT * FROM news WHERE id = ?',
    [req.params.id]
  );
  res.json(row);
};

exports.create = async (req, res) => {
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
};

exports.update = async (req, res) => {
  const { title, content, published_at } = req.body;
  const { id } = req.params;

  let photo = null;
  if (req.file) {
    const [[old]] = await db.query(
      'SELECT photo FROM news WHERE id = ?',
      [id]
    );
    if (old?.photo) fs.unlinkSync(old.photo.replace('/', ''));
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
};

exports.remove = async (req, res) => {
  const [[row]] = await db.query(
    'SELECT photo FROM news WHERE id = ?',
    [req.params.id]
  );

  if (row?.photo) fs.unlinkSync(row.photo.replace('/', ''));
  await db.query('DELETE FROM news WHERE id = ?', [req.params.id]);

  res.json({ message: 'Berita dihapus' });
};
