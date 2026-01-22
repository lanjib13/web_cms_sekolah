const db = require('../db');
const fs = require('fs');

exports.getAll = async (req, res) => {
  const [rows] = await db.query(
    'SELECT * FROM teachers ORDER BY name ASC'
  );
  res.json(rows);
};

exports.create = async (req, res) => {
  const { name, subject } = req.body;
  const photo = req.file
    ? `/uploads/teachers/${req.file.filename}`
    : null;

  await db.query(
    'INSERT INTO teachers (name, subject, photo) VALUES (?, ?, ?)',
    [name, subject, photo]
  );

  res.json({ message: 'Guru ditambahkan' });
};

exports.update = async (req, res) => {
  const { name, subject } = req.body;
  const { id } = req.params;

  let photo = null;
  if (req.file) {
    const [[old]] = await db.query(
      'SELECT photo FROM teachers WHERE id = ?',
      [id]
    );

    if (old?.photo) fs.unlinkSync(old.photo.replace('/', ''));
    photo = `/uploads/teachers/${req.file.filename}`;
  }

  await db.query(
    `UPDATE teachers SET
      name = ?,
      subject = ?,
      photo = COALESCE(?, photo)
    WHERE id = ?`,
    [name, subject, photo, id]
  );

  res.json({ message: 'Data guru diperbarui' });
};

exports.remove = async (req, res) => {
  const [[row]] = await db.query(
    'SELECT photo FROM teachers WHERE id = ?',
    [req.params.id]
  );

  if (row?.photo) fs.unlinkSync(row.photo.replace('/', ''));
  await db.query('DELETE FROM teachers WHERE id = ?', [req.params.id]);

  res.json({ message: 'Guru dihapus' });
};
