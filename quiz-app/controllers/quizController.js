// quizController.js
// Handles listing quizzes, getting a quiz, and submitting answers.
const db = require('../config/db');
const calculateScore = require('../scoreCalculator');

// List all quizzes (basic info only)
exports.listQuizzes = async (req, res, next) => {
  try {
    const quizzes = await db.all('SELECT id, title, description FROM quizzes');
    res.json({ quizzes });
  } catch (err) {
    next(err);
  }
};

// Get a single quiz (questions, but NOT correct answers)
exports.getQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    // Get quiz info
    const quiz = await db.get('SELECT id, title, description FROM quizzes WHERE id = ?', [quizId]);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    // Get questions (no correct_answer field)
    const questions = await db.all('SELECT id, question_text, option_a, option_b, option_c, option_d FROM questions WHERE quiz_id = ?', [quizId]);
    res.json({ quiz, questions });
  } catch (err) {
    next(err);
  }
};

// Submit quiz answers
exports.submitQuiz = async (req, res, next) => {
  try {
    const quizId = req.params.id;
    const userId = req.user.id;
    const userAnswers = req.body.answers; // { question_id: answer, ... }
    // Get questions and correct answers
    const questions = await db.all('SELECT id, correct_answer FROM questions WHERE quiz_id = ?', [quizId]);
    // Calculate score
    const result = calculateScore(questions, userAnswers);
    // Save result
    const { score, total } = result;
    const resultInsert = await db.run('INSERT INTO results (user_id, quiz_id, score, total) VALUES (?, ?, ?, ?)', [userId, quizId, score, total]);
    const resultId = resultInsert.lastID;
    res.json({ resultId, score, total });
  } catch (err) {
    next(err);
  }
};
