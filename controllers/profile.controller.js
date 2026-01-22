const db = require('../db');
const fs = require('fs');

exports.get = async (req, res) => {
  const [[profile]] = await db.query(
    'SELECT * FROM school_profile LIMIT 1'
  );
  res.json(profile || {});
};

exports.createOrUpdate = async (req, res) => {
  const {
    headmaster_name,
    headmaster_greeting,
    vision,
    mission,
    history,
    goal
  } = req.body;

  let photoPath = null;
  if (req.file) {
    photoPath = `/uploads/headmaster/${req.file.filename}`;
  }

  const [[existing]] = await db.query(
    'SELECT * FROM school_profile LIMIT 1'
  );

  if (!existing) {
    await db.query(
      `INSERT INTO school_profile 
      (headmaster_name, headmaster_photo, headmaster_greeting, vision, mission, history, goal)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        headmaster_name,
        photoPath,
        headmaster_greeting,
        vision,
        mission,
        history,
        goal
      ]
    );
  } else {
    if (photoPath && existing.headmaster_photo) {
      fs.unlinkSync(existing.headmaster_photo.replace('/', ''));
    }

    await db.query(
      `UPDATE school_profile SET
        headmaster_name = ?,
        headmaster_photo = COALESCE(?, headmaster_photo),
        headmaster_greeting = ?,
        vision = ?,
        mission = ?,
        history = ?,
        goal = ?
      WHERE id = ?`,
      [
        headmaster_name,
        photoPath,
        headmaster_greeting,
        vision,
        mission,
        history,
        goal,
        existing.id
      ]
    );
  }

  res.json({ message: 'Profil sekolah disimpan' });
};
