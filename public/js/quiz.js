// JavaScript для тестов и викторин
document.addEventListener('DOMContentLoaded', function() {
  console.log('Модуль тестов загружен');
  
  // Инициализация теста
  const initQuiz = () => {
    const quizForm = document.getElementById('quiz-form');
    if (!quizForm) return;
    
    // Таймер теста
    const timerElement = document.getElementById('quiz-timer');
    if (timerElement) {
      const timeLimit = parseInt(quizForm.dataset.timeLimit) || 600; // 10 минут по умолчанию
      let timeLeft = timeLimit;
      
      const updateTimer = () => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        if (timeLeft <= 60) {
          timerElement.style.color = '#e74c3c';
          timerElement.style.fontWeight = 'bold';
        }
        
        if (timeLeft <= 0) {
          clearInterval(timerInterval);
          alert('Время вышло! Тест будет отправлен автоматически.');
          quizForm.submit();
        }
        
        timeLeft--;
      };
      
      updateTimer(); // Первое обновление
      const timerInterval = setInterval(updateTimer, 1000);
      
      // Сохраняем интервал для очистки
      quizForm.dataset.timerInterval = timerInterval;
    }
    
    // Подсветка выбранных ответов
    const answerOptions = document.querySelectorAll('.answer-option');
    answerOptions.forEach(option => {
      option.addEventListener('click', function() {
        const questionId = this.dataset.questionId;
        const radioInput = document.querySelector(`input[name="answers[${questionId}]"]`);
        
        if (radioInput) {
          // Снимаем выделение со всех вариантов этого вопроса
          document.querySelectorAll(`[data-question-id="${questionId}"]`).forEach(opt => {
            opt.classList.remove('selected');
          });
          
          // Выделяем выбранный вариант
          this.classList.add('selected');
          radioInput.checked = true;
          radioInput.value = this.dataset.optionIndex;
        }
      });
    });
    
    // Предотвращение двойной отправки
    let isSubmitting = false;
    quizForm.addEventListener('submit', function(e) {
      if (isSubmitting) {
        e.preventDefault();
        return;
      }
      
      // Проверяем, все ли вопросы отвечены
      const totalQuestions = document.querySelectorAll('.question-card').length;
      const answeredQuestions = document.querySelectorAll('input[type="radio"]:checked').length;
      
      if (answeredQuestions < totalQuestions) {
        const confirmSubmit = confirm(`Вы ответили на ${answeredQuestions} из ${totalQuestions} вопросов. Продолжить?`);
        if (!confirmSubmit) {
          e.preventDefault();
          return;
        }
      }
      
      // Очищаем таймер
      if (quizForm.dataset.timerInterval) {
        clearInterval(parseInt(quizForm.dataset.timerInterval));
      }
      
      isSubmitting = true;
      const submitBtn = this.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Проверяем ответы...';
      }
    });
    
    // Кнопка пропуска вопроса
    const skipButtons = document.querySelectorAll('.skip-question');
    skipButtons.forEach(button => {
      button.addEventListener('click', function() {
        const questionId = this.dataset.questionId;
        const questionCard = document.getElementById(`question-${questionId}`);
        
        if (questionCard) {
          questionCard.style.opacity = '0.5';
          questionCard.style.transition = 'opacity 0.3s';
          
          // Помечаем как пропущенный
          const skipInput = document.createElement('input');
          skipInput.type = 'hidden';
          skipInput.name = `skipped[${questionId}]`;
          skipInput.value = '1';
          questionCard.appendChild(skipInput);
          
          this.disabled = true;
          this.textContent = 'Пропущено';
        }
      });
    });
  };
  
  // Инициализация результатов теста
  const initQuizResults = () => {
    const resultBar = document.querySelector('.result-bar');
    if (resultBar) {
      const percentage = parseFloat(resultBar.dataset.percentage) || 0;
      
      // Анимация заполнения шкалы
      setTimeout(() => {
        resultBar.style.width = percentage + '%';
      }, 300);
      
      // Анимация появления результатов
      const resultItems = document.querySelectorAll('.result-item');
      resultItems.forEach((item, index) => {
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
        }, 500 + (index * 200));
      });
      
      // Оценка результата
      const resultMessage = document.getElementById('result-message');
      if (resultMessage) {
        let message = '';
        let color = '';
        
        if (percentage >= 90) {
          message = 'Отлично! Вы прекрасно знаете материал! 🏆';
          color = '#2ecc71';
        } else if (percentage >= 70) {
          message = 'Хорошо! Вы хорошо разбираетесь в теме! 👍';
          color = '#3498db';
        } else if (percentage >= 50) {
          message = 'Удовлетворительно. Есть над чем поработать. 📚';
          color = '#f39c12';
        } else {
          message = 'Попробуйте ещё раз. Рекомендуем повторить материал. 🔄';
          color = '#e74c3c';
        }
        
        resultMessage.textContent = message;
        resultMessage.style.color = color;
        resultMessage.style.fontWeight = 'bold';
      }
      
      // Кнопка повторного прохождения
      const retryBtn = document.getElementById('retry-quiz');
      if (retryBtn) {
        retryBtn.addEventListener('click', function() {
          window.location.href = window.location.pathname.replace('/result', '');
        });
      }
      
      // Кнопка следующего теста
      const nextBtn = document.getElementById('next-quiz');
      if (nextBtn) {
        nextBtn.addEventListener('click', function() {
          const nextQuizId = parseInt(this.dataset.nextQuiz) || 1;
          window.location.href = `/quiz/${nextQuizId}`;
        });
      }
    }
  };
  
  // Инициализация выбора теста
  const initQuizSelector = () => {
    const quizCards = document.querySelectorAll('.quiz-card');
    quizCards.forEach(card => {
      card.addEventListener('click', function() {
        const quizId = this.dataset.quizId;
        if (quizId) {
          window.location.href = `/quiz/${quizId}`;
        }
      });
      
      // Эффект при наведении
      card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
      });
      
      card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
      });
    });
    
    // Поиск тестов
    const searchInput = document.getElementById('quiz-search');
    if (searchInput) {
      searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        quizCards.forEach(card => {
          const title = card.querySelector('.quiz-title').textContent.toLowerCase();
          const description = card.querySelector('.quiz-description').textContent.toLowerCase();
          
          if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    }
    
    // Фильтрация по сложности
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        const difficulty = this.dataset.difficulty;
        
        // Убираем активный класс со всех кнопок
        filterButtons.forEach(btn => btn.classList.remove('active'));
        // Добавляем активный класс текущей кнопке
        this.classList.add('active');
        
        quizCards.forEach(card => {
          if (difficulty === 'all' || card.dataset.difficulty === difficulty) {
            card.style.display = 'block';
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  };
  
  // Загрузка вопросов по AJAX (если нужно)
  const loadQuizQuestions = (quizId) => {
    // Реализация загрузки вопросов с сервера
    fetch(`/api/quiz/${quizId}/questions`)
      .then(response => response.json())
      .then(data => {
        console.log('Вопросы загружены:', data);
      })
      .catch(error => {
        console.error('Ошибка загрузки вопросов:', error);
      });
  };
  
  // Сохранение прогресса теста
  const saveQuizProgress = () => {
    const quizForm = document.getElementById('quiz-form');
    if (!quizForm) return;
    
    const formData = new FormData(quizForm);
    const progress = {};
    
    formData.forEach((value, key) => {
      if (key.startsWith('answers[')) {
        const questionId = key.match(/\[(.*?)\]/)[1];
        progress[questionId] = value;
      }
    });
    
    // Сохраняем в localStorage
    const quizId = quizForm.dataset.quizId;
    if (quizId) {
      localStorage.setItem(`quiz_progress_${quizId}`, JSON.stringify(progress));
      localStorage.setItem(`quiz_last_saved_${quizId}`, Date.now());
    }
  };
  
  // Восстановление прогресса
  const restoreQuizProgress = () => {
    const quizForm = document.getElementById('quiz-form');
    if (!quizForm) return;
    
    const quizId = quizForm.dataset.quizId;
    if (!quizId) return;
    
    const savedProgress = localStorage.getItem(`quiz_progress_${quizId}`);
    if (savedProgress) {
      const progress = JSON.parse(savedProgress);
      
      Object.keys(progress).forEach(questionId => {
        const input = document.querySelector(`input[name="answers[${questionId}]"][value="${progress[questionId]}"]`);
        if (input) {
          input.checked = true;
          
          // Подсвечиваем выбранный вариант
          const option = document.querySelector(`.answer-option[data-question-id="${questionId}"][data-option-index="${progress[questionId]}"]`);
          if (option) {
            option.classList.add('selected');
          }
        }
      });
      
      console.log('Прогресс восстановлен');
    }
  };
  
  // Автосохранение каждые 30 секунд
  setInterval(saveQuizProgress, 30000);
  
  // Восстанавливаем прогресс при загрузке
  restoreQuizProgress();
  
  // Инициализация в зависимости от страницы
  if (document.getElementById('quiz-form')) {
    initQuiz();
  }
  
  if (document.querySelector('.result-bar')) {
    initQuizResults();
  }
  
  if (document.querySelector('.quiz-card')) {
    initQuizSelector();
  }
  
  // Добавление стилей для тестов
  const quizStyles = document.createElement('style');
  quizStyles.textContent = `
    .quiz-progress {
      height: 10px;
      background: #f0f0f0;
      border-radius: 5px;
      margin: 20px 0;
      overflow: hidden;
    }
    
    .quiz-progress-bar {
      height: 100%;
      background: linear-gradient(90deg, #3498db, #2ecc71);
      width: 0%;
      transition: width 0.5s ease;
    }
    
    .result-item {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.5s ease, transform 0.5s ease;
    }
    
    .correct-answer {
      border-left: 4px solid #2ecc71;
      background: #f0fff4;
    }
    
    .incorrect-answer {
      border-left: 4px solid #e74c3c;
      background: #fff0f0;
    }
    
    .quiz-card {
      cursor: pointer;
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }
    
    .quiz-card:hover {
      box-shadow: 0 15px 35px rgba(0,0,0,0.15);
    }
    
    .difficulty-badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 12px;
      font-weight: bold;
      margin-right: 10px;
    }
    
    .difficulty-easy {
      background: #d4edda;
      color: #155724;
    }
    
    .difficulty-medium {
      background: #fff3cd;
      color: #856404;
    }
    
    .difficulty-hard {
      background: #f8d7da;
      color: #721c24;
    }
    
    .timer-warning {
      animation: pulse 1s infinite;
    }
    
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
    
    .skip-question {
      background: #95a5a6;
      color: white;
      border: none;
      padding: 8px 16px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 14px;
      margin-top: 10px;
    }
    
    .skip-question:hover {
      background: #7f8c8d;
    }
  `;
  document.head.appendChild(quizStyles);
});