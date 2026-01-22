const db = require('../db');
const fs = require('fs');

exports.getAll = async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM gallery ORDER BY created_at DESC'
  );
  res.json(rows);
};

exports.getById = async (req, res) => {
  const [[row]] = await db.query(
    'SELECT * FROM gallery WHERE id = ?',
    [req.params.id]
  );
  res.json(row);
};

exports.create = async (req, res) => {
  const { title, description, event_date, location } = req.body;
  const photo = `/uploads/gallery/${req.file.filename}`;

  await db.query(
    `INSERT INTO gallery (title, description, photo, event_date, location)
     VALUES (?, ?, ?, ?, ?)`,
    [title, description, photo, event_date, location]
  );

  res.json({ message: 'Galeri ditambahkan' });
};

exports.remove = async (req, res) => {
  const [[row]] = await db.query(
    'SELECT photo FROM gallery WHERE id = ?',
    [req.params.id]
  );

  if (row?.photo) {
    fs.unlinkSync(row.photo.replace('/', ''));
  }

  await db.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
  res.json({ message: 'Galeri dihapus' });
};
