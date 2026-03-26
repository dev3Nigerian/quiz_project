// quizRoutes.js
// Routes for quizzes and results
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const resultController = require('../controllers/resultController');
const auth = require('../middleware/authMiddleware');

// List all quizzes
router.get('/quizzes', auth, quizController.listQuizzes);
// Get a single quiz (no answers)
router.get('/quizzes/:id', auth, quizController.getQuiz);
// Submit answers for a quiz
router.post('/quizzes/:id/submit', auth, quizController.submitQuiz);

// Get all results for current user
router.get('/results', auth, resultController.getMyResults);
// Get a single result
router.get('/results/:id', auth, resultController.getResult);

module.exports = router;
