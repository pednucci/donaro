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

app.use(session({
    secret: "19ejasdjn21sjia1",
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("successMsg");
    res.locals.errorMsg = req.flash("errorMsg");
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