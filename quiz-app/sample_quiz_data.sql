-- Insert a sample quiz, questions, and answers for manual testing

-- Insert a sample admin user (if not exists)
INSERT OR IGNORE INTO users (id, name, email, password_hash, role) VALUES (1, 'Admin', 'admin@example.com', '$2a$10$abcdefghijklmnopqrstuv', 'admin');

-- Insert a sample quiz
INSERT INTO quizzes (id, title, description, time_limit, created_by) VALUES (1, 'Sample Quiz', 'A simple test quiz.', 300, 1);

-- Insert questions for the quiz
INSERT INTO questions (id, quiz_id, question_text) VALUES (1, 1, 'What is 2 + 2?');
INSERT INTO questions (id, quiz_id, question_text) VALUES (2, 1, 'What is the capital of France?');

-- Insert answers for question 1
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (1, '3', 0);
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (1, '4', 1);
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (1, '5', 0);
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (1, '22', 0);

-- Insert answers for question 2
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (2, 'London', 0);
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (2, 'Berlin', 0);
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (2, 'Paris', 1);
INSERT INTO answers (question_id, answer_text, is_correct) VALUES (2, 'Madrid', 0);
