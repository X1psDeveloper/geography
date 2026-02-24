const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render('guestbook', { 
        title: 'Гостевая книга',
        user: req.session.user 
    });
});

module.exports = router;