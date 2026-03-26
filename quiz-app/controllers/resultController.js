// resultController.js
// Handles fetching quiz results for users.
const db = require('../config/db');

// Get all results for the current user
exports.getMyResults = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const results = await db.all('SELECT * FROM results WHERE user_id = ?', [userId]);
    res.json({ results });
  } catch (err) {
    next(err);
  }
};

// Get a single result by result ID
exports.getResult = async (req, res, next) => {
  try {
    const resultId = req.params.id;
    const userId = req.user.id;
    const result = await db.get('SELECT * FROM results WHERE id = ? AND user_id = ?', [resultId, userId]);
    if (!result) return res.status(404).json({ error: 'Result not found' });
    res.json({ result });
  } catch (err) {
    next(err);
  }
};
