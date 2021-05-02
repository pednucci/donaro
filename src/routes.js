const express = require('express');
const router = express.Router();
const auth = require('./routes/auth');
const dotenv = require('dotenv');
dotenv.config();

router.get('/', (req, res) => {
    res.render('landing-page/index')
})

router.use(auth);

module.exports = router;