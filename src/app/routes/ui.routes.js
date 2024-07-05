const express = require('express');
const path = require('node:path');
const { isAuthenticated } = require('../../middleware/isAuthenticated');

const router = express.Router();

const publicDir = path.join(__dirname, '../../public/');

router.get('/', (req, res) => {
    page = req.session.user ? '/welcome' : '/login'
    res.redirect(page)
})

router.get('/login', (req, res) => {
    if (req.session.user) return res.redirect('/welcome')
    res.sendFile('login.html', { root: publicDir });
})

router.get('/welcome', isAuthenticated, (req, res) => {
    console.log("Req come to /welcome")
    res.sendFile('welcome.html', { root: publicDir });
});

router.get('/dummy', (req, res) => {
    console.error("something is fishy....")
    console.error("ERROR:01", { ok:'01', message: 'no no no'})

    res.status(400).send('ha ha ha failed!')
})

module.exports = router;