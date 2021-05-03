require('dotenv/config');
const express = require('express');
const app = express();
const path = require('path')
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const router = require('./routes');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
require('./config/auth')(passport);

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("successMsg");
    res.locals.errorMsg = req.flash("errorMsg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    next()
})

app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(router)

app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`)
})