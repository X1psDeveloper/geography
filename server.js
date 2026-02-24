// ============================================
// ГЕОАКАДЕМИЯ 7.0 - ПОЛНЫЙ СЕРВЕРНЫЙ ФАЙЛ
// ============================================

require('dotenv').config();
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// ===== СОЗДАНИЕ ПАПОК =====
const folders = ['data', 'public/uploads', 'public/images/continents', 'public/images/icons'];
folders.forEach(folder => {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder, { recursive: true });
    }
});

// ===== НАСТРОЙКА MULTER ДЛЯ ЗАГРУЗКИ ФАЙЛОВ =====
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = path.extname(file.originalname);
        cb(null, unique + ext);
    }
});
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// ===== MIDDLEWARE =====
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET || 'geography_secret_key_2026',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        maxAge: 1000 * 60 * 60 * 24, // 1 день
        secure: false 
    }
}));

// ===== НАСТРОЙКА ШАБЛОНИЗАТОРА =====
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ===== ИНИЦИАЛИЗАЦИЯ ДАННЫХ =====
const initializeData = () => {
    // Темы по умолчанию
    const defaultTopics = [
        {
            "id": 1,
            "title": "Материки и океаны",
            "description": "Изучите семь материков и пять океанов нашей планеты",
            "image": "continents.jpg",
            "content": "Земля состоит из шести материков: Евразия, Африка, Северная Америка, Южная Америка, Австралия и Антарктида. Океаны покрывают около 71% поверхности Земли.",
            "video": "https://www.youtube.com/embed/OhDJkQ8ldR4?si=oezU8dt85LOwuLdh",
            "quizId": 1,
            "icon": "fa-globe-americas"
        },
        {
            "id": 2,
            "title": "Климатические пояса",
            "description": "Узнайте о климате и природных зонах Земли",
            "image": "climate.jpg",
            "content": "Климатические пояса — это широтные полосы с определённым типом климата. Их выделяют на основе температуры и увлажнения.",
            "video": "https://www.youtube.com/embed/5gO2r8-l4Lc",
            "quizId": 2,
            "icon": "fa-cloud-sun"
        },
        {
            "id": 3,
            "title": "Население мира",
            "description": "Изучите расы, народы и страны мира",
            "image": "population.jpg",
            "content": "Население Земли превышает 8 миллиардов человек. Люди делятся на расы, говорят на тысячах языков и живут в разных странах.",
            "video": "https://www.youtube.com/embed/bMd2bVqG2LI?si=kEkO4lPt3lB5zNtS",
            "quizId": 3,
            "icon": "fa-users"
        }
    ];

    // Тесты по умолчанию
    const defaultQuiz = {
        "quizzes": [
            {
                "id": 1,
                "title": "Материки и океаны",
                "description": "Проверьте свои знания о континентах",
                "questions": [
                    {
                        "id": 1,
                        "question": "Какой материк самый большой по площади?",
                        "options": ["Африка", "Евразия", "Северная Америка", "Южная Америка"],
                        "correct": 1,
                        "explanation": "Евразия — самый большой материк, его площадь около 54 млн км²."
                    },
                    {
                        "id": 2,
                        "question": "Сколько океанов на Земле?",
                        "options": ["3", "4", "5", "6"],
                        "correct": 2,
                        "explanation": "На Земле 5 океанов: Тихий, Атлантический, Индийский, Южный и Северный Ледовитый."
                    }
                ]
            },
            {
                "id": 2,
                "title": "Климатические пояса",
                "description": "Проверьте знания о климате",
                "questions": [
                    {
                        "id": 1,
                        "question": "Какой климатический пояс является самым жарким?",
                        "options": ["Экваториальный", "Тропический", "Умеренный", "Арктический"],
                        "correct": 0,
                        "explanation": "Экваториальный пояс — самый жаркий и влажный."
                    }
                ]
            },
            {
                "id": 3,
                "title": "Население мира",
                "description": "Вопросы о населении",
                "questions": [
                    {
                        "id": 1,
                        "question": "Какая страна самая населённая в мире?",
                        "options": ["Индия", "Китай", "США", "Индонезия"],
                        "correct": 1,
                        "explanation": "Китай — более 1,4 млрд человек."
                    }
                ]
            }
        ]
    };

    // Посты в блоге
    const defaultBlog = [
        {
            "id": 1,
            "title": "Запуск ГеоАкадемии 7.0!",
            "date": new Date().toLocaleDateString('ru-RU'),
            "author": "Администратор",
            "content": "Мы рады представить интерактивный учебник географии для 7 класса. Здесь вы найдёте современные материалы, интерактивные карты и увлекательные тесты.",
            "excerpt": "Современный подход к изучению географии",
            "image": "news1.jpg"
        }
    ];

    // Гостевая книга (пустая)
    const defaultGuestbook = [];

    // Создаём файлы, если их нет
    if (!fs.existsSync('data/topics.json')) {
        fs.writeFileSync('data/topics.json', JSON.stringify(defaultTopics, null, 2));
    }
    if (!fs.existsSync('data/quiz-questions.json')) {
        fs.writeFileSync('data/quiz-questions.json', JSON.stringify(defaultQuiz, null, 2));
    }
    if (!fs.existsSync('data/blog-posts.json')) {
        fs.writeFileSync('data/blog-posts.json', JSON.stringify(defaultBlog, null, 2));
    }
    if (!fs.existsSync('data/guestbook.json')) {
        fs.writeFileSync('data/guestbook.json', JSON.stringify(defaultGuestbook, null, 2));
    }
};

// Запуск инициализации
initializeData();

// ==================== ПУБЛИЧНЫЕ МАРШРУТЫ ====================

// Главная страница
app.get('/', (req, res) => {
    try {
        const blogData = fs.readFileSync('data/blog-posts.json', 'utf8');
        const posts = JSON.parse(blogData).slice(0, 3);
        res.render('index', { 
            title: 'Главная',
            posts,
            user: req.session.user 
        });
    } catch (error) {
        res.render('index', { 
            title: 'Главная',
            posts: [],
            user: req.session.user 
        });
    }
});

// Страница всех тем
app.get('/topics', (req, res) => {
    try {
        const topicsData = fs.readFileSync('data/topics.json', 'utf8');
        const topics = JSON.parse(topicsData);
        res.render('topics', { 
            title: 'Темы',
            topics,
            user: req.session.user 
        });
    } catch (error) {
        res.render('topics', { 
            title: 'Темы',
            topics: [],
            user: req.session.user 
        });
    }
});

// Детальная страница темы
app.get('/topic/:id', (req, res) => {
    try {
        const topicId = parseInt(req.params.id);
        const topicsData = fs.readFileSync('data/topics.json', 'utf8');
        const topics = JSON.parse(topicsData);
        const topic = topics.find(t => t.id === topicId);
        
        if (topic) {
            res.render('topic-detail', { 
                title: topic.title,
                topic,
                user: req.session.user 
            });
        } else {
            res.redirect('/topics');
        }
    } catch (error) {
        res.redirect('/topics');
    }
});

// Интерактивная карта
app.get('/map', (req, res) => {
    res.render('map', { 
        title: 'Карта',
        user: req.session.user 
    });
});

// Список тестов
app.get('/quiz', (req, res) => {
    try {
        const quizData = fs.readFileSync('data/quiz-questions.json', 'utf8');
        const quizzes = JSON.parse(quizData).quizzes;
        res.render('quiz', { 
            title: 'Тесты',
            quizzes,
            user: req.session.user 
        });
    } catch (error) {
        res.render('quiz', { 
            title: 'Тесты',
            quizzes: [],
            user: req.session.user 
        });
    }
});

// Страница конкретного теста
app.get('/quiz/:id', (req, res) => {
    try {
        const quizId = parseInt(req.params.id);
        const quizData = fs.readFileSync('data/quiz-questions.json', 'utf8');
        const allQuizzes = JSON.parse(quizData).quizzes;
        const quiz = allQuizzes.find(q => q.id === quizId);
        
        if (quiz) {
            res.render('quiz-detail', { 
                title: quiz.title,
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

// Отправка ответов теста
app.post('/quiz/:id/submit', (req, res) => {
    try {
        const quizId = parseInt(req.params.id);
        const userAnswers = req.body.answers || {};
        
        const quizData = fs.readFileSync('data/quiz-questions.json', 'utf8');
        const allQuizzes = JSON.parse(quizData).quizzes;
        const quiz = allQuizzes.find(q => q.id === quizId);
        
        let score = 0;
        const results = [];
        
        if (quiz) {
            quiz.questions.forEach((question, index) => {
                const userAnswer = userAnswers[index] !== undefined ? parseInt(userAnswers[index]) : undefined;
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
        
        const percentage = quiz ? Math.round((score / quiz.questions.length) * 100) : 0;
        
        res.render('quiz-result', {
            title: 'Результат',
            quizTitle: quiz ? quiz.title : 'Тест',
            score,
            total: quiz ? quiz.questions.length : 0,
            percentage,
            results,
            user: req.session.user
        });
        
    } catch (error) {
        console.error(error);
        res.redirect('/quiz');
    }
});

// Блог
app.get('/blog', (req, res) => {
    try {
        const blogData = fs.readFileSync('data/blog-posts.json', 'utf8');
        const posts = JSON.parse(blogData);
        res.render('blog', { 
            title: 'Блог',
            posts,
            user: req.session.user 
        });
    } catch (error) {
        res.render('blog', { 
            title: 'Блог',
            posts: [],
            user: req.session.user 
        });
    }
});

// Гостевая книга
app.get('/guestbook', (req, res) => {
    try {
        const guestbookData = fs.readFileSync('data/guestbook.json', 'utf8');
        const messages = JSON.parse(guestbookData);
        res.render('guestbook', { 
            title: 'Гостевая',
            messages,
            user: req.session.user 
        });
    } catch (error) {
        res.render('guestbook', { 
            title: 'Гостевая',
            messages: [],
            user: req.session.user 
        });
    }
});

// Добавление сообщения в гостевую
app.post('/guestbook/add', (req, res) => {
    try {
        const { name, message } = req.body;
        const guestbookData = fs.readFileSync('data/guestbook.json', 'utf8');
        const messages = JSON.parse(guestbookData);
        
        const newMessage = {
            id: messages.length + 1,
            name: name.trim() || 'Аноним',
            message: message.trim(),
            date: new Date().toLocaleDateString('ru-RU'),
            time: new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
        };
        
        messages.push(newMessage);
        fs.writeFileSync('data/guestbook.json', JSON.stringify(messages, null, 2));
        
        res.redirect('/guestbook');
    } catch (error) {
        console.error(error);
        res.redirect('/guestbook');
    }
});

// ==================== АДМИН-ПАНЕЛЬ ====================

// Вход в админку
app.get('/admin/login', (req, res) => {
    res.render('admin-login', { 
        title: 'Вход',
        error: null,
        user: req.session.user 
    });
});

app.post('/admin/login', (req, res) => {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || 'geography2026';
    
    if (password === adminPassword) {
        req.session.user = { 
            username: 'admin', 
            isAdmin: true 
        };
        res.redirect('/admin');
    } else {
        res.render('admin-login', { 
            title: 'Вход',
            error: 'Неверный пароль',
            user: req.session.user 
        });
    }
});

// Главная страница админки
app.get('/admin', (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.redirect('/admin/login');
    }
    
    try {
        const topicsData = fs.readFileSync('data/topics.json', 'utf8');
        const blogData = fs.readFileSync('data/blog-posts.json', 'utf8');
        const guestbookData = fs.readFileSync('data/guestbook.json', 'utf8');
        
        const topics = JSON.parse(topicsData);
        const posts = JSON.parse(blogData);
        const messages = JSON.parse(guestbookData);
        
        res.render('admin-panel', { 
            title: 'Админ',
            topics,
            posts,
            messages,
            user: req.session.user 
        });
    } catch (error) {
        console.error(error);
        res.render('admin-panel', { 
            title: 'Админ',
            topics: [],
            posts: [],
            messages: [],
            user: req.session.user 
        });
    }
});

// ДОБАВЛЕНИЕ ТЕМЫ
app.post('/admin/add-topic', upload.single('image'), (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.redirect('/admin/login');
    }

    try {
        const { title, description, content, video } = req.body;
        const topicsData = fs.readFileSync('data/topics.json', 'utf8');
        const topics = JSON.parse(topicsData);

        const newTopic = {
            id: topics.length + 1,
            title,
            description,
            content,
            video: video || '',
            image: req.file ? req.file.filename : 'default.jpg',
            icon: 'fa-globe',
            quizId: topics.length + 1
        };

        topics.push(newTopic);
        fs.writeFileSync('data/topics.json', JSON.stringify(topics, null, 2));
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
});

// УДАЛЕНИЕ ТЕМЫ
app.post('/admin/delete-topic/:id', (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.redirect('/admin/login');
    }

    try {
        const topicId = parseInt(req.params.id);
        const topicsData = fs.readFileSync('data/topics.json', 'utf8');
        let topics = JSON.parse(topicsData);

        topics = topics.filter(t => t.id !== topicId);
        fs.writeFileSync('data/topics.json', JSON.stringify(topics, null, 2));

        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
});

// ДОБАВЛЕНИЕ ПОСТА В БЛОГ
app.post('/admin/add-post', upload.single('image'), (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.redirect('/admin/login');
    }

    try {
        const { title, content } = req.body;
        const blogData = fs.readFileSync('data/blog-posts.json', 'utf8');
        let posts = JSON.parse(blogData);

        const newPost = {
            id: posts.length + 1,
            title,
            content,
            excerpt: content.substring(0, 150) + '...',
            author: 'Администратор',
            date: new Date().toLocaleDateString('ru-RU'),
            image: req.file ? req.file.filename : 'news-default.jpg'
        };

        posts.unshift(newPost);
        fs.writeFileSync('data/blog-posts.json', JSON.stringify(posts, null, 2));
        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
});

// УДАЛЕНИЕ ПОСТА
app.post('/admin/delete-post/:id', (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.redirect('/admin/login');
    }

    try {
        const postId = parseInt(req.params.id);
        const blogData = fs.readFileSync('data/blog-posts.json', 'utf8');
        let posts = JSON.parse(blogData);

        posts = posts.filter(p => p.id !== postId);
        fs.writeFileSync('data/blog-posts.json', JSON.stringify(posts, null, 2));

        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
});

// УДАЛЕНИЕ СООБЩЕНИЯ ИЗ ГОСТЕВОЙ
app.post('/admin/delete-message/:id', (req, res) => {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.redirect('/admin/login');
    }

    try {
        const messageId = parseInt(req.params.id);
        const guestbookData = fs.readFileSync('data/guestbook.json', 'utf8');
        let messages = JSON.parse(guestbookData);

        messages = messages.filter(m => m.id !== messageId);
        fs.writeFileSync('data/guestbook.json', JSON.stringify(messages, null, 2));

        res.redirect('/admin');
    } catch (error) {
        console.error(error);
        res.redirect('/admin');
    }
});

// Выход из админки
app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// ==================== ЗАПУСК СЕРВЕРА ====================
app.listen(PORT, () => {
    console.log(`Сервер запущен: http://localhost:${PORT}`);
    console.log(`Админ: /admin/login | Пароль: ${process.env.ADMIN_PASSWORD || 'geography2026'}`);
});