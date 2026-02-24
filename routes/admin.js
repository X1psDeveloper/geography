const express = require('express');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('admin-login', { 
        title: 'Вход в админку',
        user: req.session.user 
    });
});

router.post('/login', (req, res) => {
    if (req.body.password === 'geography2026') {
        req.session.user = { username: 'admin', isAdmin: true };
        res.redirect('/');
    } else {
        res.render('admin-login', { 
            title: 'Вход в админку',
            error: 'Неверный пароль',
            user: req.session.user 
        });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;