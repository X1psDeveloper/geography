const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('topics', { 
        title: 'Темы для изучения',
        user: req.session.user 
    });
});

module.exports = router;