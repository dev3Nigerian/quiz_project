// scoreCalculator.js
// This function calculates the user's score for a quiz.
// It compares the user's answers to the correct answers and returns the score and details.

/**
 * Calculate the score for a quiz submission.
 * @param {Array} questions - Array of question objects from the DB (each with id and correct_answer).
 * @param {Object} userAnswers - Object mapping question_id to user's answer.
 * @returns {Object} - { score, total, details: [{question_id, correct, user_answer, correct_answer}] }
 */
function calculateScore(questions, userAnswers) {
  let score = 0;
  const details = questions.map(q => {
    const user_answer = userAnswers[q.id];
    const correct = user_answer === q.correct_answer;
    if (correct) score++;
    return {
      question_id: q.id,
      correct,
      user_answer,
      correct_answer: q.correct_answer // For internal use only
    };
  });
  return {
    score,
    total: questions.length,
    details
  };
}

module.exports = calculateScore;
