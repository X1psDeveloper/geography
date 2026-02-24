const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Страница со списком тестов
router.get('/', async (req, res) => {
  try {
    const quizData = await fs.readFile(
      path.join(__dirname, '../data/quiz-questions.json'),
      'utf-8'
    );
    const quizzes = JSON.parse(quizData).quizzes;
    res.render('quiz', {
      title: 'Тесты и викторины',
      quizzes,
      user: req.session.user
    });
  } catch (error) {
    res.render('quiz', {
      title: 'Тесты и викторины',
      quizzes: [],
      user: req.session.user
    });
  }
});

// Страница конкретного теста
router.get('/:id', async (req, res) => {
  try {
    const quizId = parseInt(req.params.id);
    const quizData = await fs.readFile(
      path.join(__dirname, '../data/quiz-questions.json'),
      'utf-8'
    );
    const allQuizzes = JSON.parse(quizData).quizzes;
    const quiz = allQuizzes.find(q => q.id === quizId);
    
    if (quiz) {
      res.render('quiz-detail', {
        title: `Тест: ${quiz.title}`,
        quiz,
        user: req.session.user
      });
    } else {
      res.redirect('/quiz');
    }
  } catch (error) {
    res.redirect('/quiz');
  }
});

// Обработка отправки теста
router.post('/:id/submit', async (req, res) => {
  try {
    const quizId = parseInt(req.params.id);
    const userAnswers = req.body.answers;
    
    const quizData = await fs.readFile(
      path.join(__dirname, '../data/quiz-questions.json'),
      'utf-8'
    );
    const allQuizzes = JSON.parse(quizData).quizzes;
    const quiz = allQuizzes.find(q => q.id === quizId);
    
    let score = 0;
    const results = [];
    
    if (quiz) {
      quiz.questions.forEach((question, index) => {
        const userAnswer = parseInt(userAnswers[index]);
        const isCorrect = userAnswer === question.correct;
        
        if (isCorrect) score++;
        
        results.push({
          question: question.question,
          userAnswer: userAnswer !== undefined ? question.options[userAnswer] : 'Не отвечено',
          correctAnswer: question.options[question.correct],
          explanation: question.explanation,
          isCorrect
        });
      });
    }
    
    const percentage = Math.round((score / quiz.questions.length) * 100);
    
    res.render('quiz-result', {
      title: 'Результаты теста',
      quizTitle: quiz.title,
      score,
      total: quiz.questions.length,
      percentage,
      results,
      user: req.session.user
    });
    
  } catch (error) {
    res.redirect('/quiz');
  }
});

module.exports = router;