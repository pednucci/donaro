const express = require('express')
const router = express.Router();
const db = require('../database/database');
const registerController = require('../controllers/registerController');
const passport = require('passport');

router.get('/cadastro', (req, res) => {
    res.render('login/cadastro')
})

router.post('/cadastro', registerController.register)

router.get('/login', (req, res) => {
    res.render('login/login')
})

router.post('/login', passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true})
)

module.exports = router;

