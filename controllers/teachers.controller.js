const db = require('../db');
const fs = require('fs');

exports.getAll = async (req, res, next) => {
  try {
    const [rows] = await db.query(
      'SELECT * FROM teachers ORDER BY name ASC'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { name, subject } = req.body;
    const photo = req.file
      ? `/uploads/teachers/${req.file.filename}`
      : null;

    await db.query(
      'INSERT INTO teachers (name, subject, photo) VALUES (?, ?, ?)',
      [name, subject, photo]
    );

    res.json({ message: 'Guru ditambahkan' });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const { name, subject } = req.body;
    const { id } = req.params;

    let photo = null;

    if (req.file) {
      const [[old]] = await db.query(
        'SELECT photo FROM teachers WHERE id = ?',
        [id]
      );

      if (old?.photo) {
        const path = old.photo.replace(/^\//, '');
        if (fs.existsSync(path)) {
          fs.unlinkSync(path);
        }
      }

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
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const [[row]] = await db.query(
      'SELECT photo FROM teachers WHERE id = ?',
      [req.params.id]
    );

    if (row?.photo) {
      const path = row.photo.replace(/^\//, '');
      if (fs.existsSync(path)) {
        fs.unlinkSync(path);
      }
    }

    await db.query('DELETE FROM teachers WHERE id = ?', [req.params.id]);

    res.json({ message: 'Guru dihapus' });
  } catch (err) {
    next(err);
  }
};
