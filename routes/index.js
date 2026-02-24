const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');

// Главная страница
router.get('/', async (req, res) => {
  try {
    const blogData = await fs.readFile(
      path.join(__dirname, '../data/blog-posts.json'),
      'utf-8'
    );
    const posts = JSON.parse(blogData).slice(0, 3); // Последние 3 поста
    res.render('index', { 
      title: 'Главная | ГеоАкадемия 7.0',
      posts,
      user: req.session.user 
    });
  } catch (error) {
    res.render('index', { 
      title: 'Главная | ГеоАкадемия 7.0',
      posts: [],
      user: req.session.user 
    });
  }
});

// Карта
router.get('/map', (req, res) => {
  res.render('map', { 
    title: 'Интерактивная карта мира',
    user: req.session.user 
  });
});

// Блог
router.get('/blog', async (req, res) => {
  try {
    const blogData = await fs.readFile(
      path.join(__dirname, '../data/blog-posts.json'),
      'utf-8'
    );
    const posts = JSON.parse(blogData);
    res.render('blog', { 
      title: 'Блог и новости',
      posts,
      user: req.session.user 
    });
  } catch (error) {
    res.render('blog', { 
      title: 'Блог и новости',
      posts: [],
      user: req.session.user 
    });
  }
});

// О проекте
router.get('/about', (req, res) => {
  res.render('about', { 
    title: 'О проекте',
    user: req.session.user 
  });
});

module.exports = router;