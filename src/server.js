require('dotenv/config');
const express = require('express');
const app = express();
const path = require('path')
const PORT = process.env.PORT || 3000;
const hbs = require('express-handlebars');
const router = require('./routes');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const { format } = require('date-fns');
require('./config/auth')(passport);

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(fileUpload())

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

app.set('views', path.join(__dirname, 'views'));
app.engine('hbs', hbs({defaultLayout: 'main', extname: '.hbs', helpers: {
    formatDate: (date) => {
        return format(new Date(date), 'dd/MM/yyyy - HH:mm:ss')
    },
    dateNoHour: (date) => {
        return format(new Date(date), 'dd/MM/yyyy')
    },
    donationNoti: (msg) => {
        if(msg == 'PENDENTE'){
            return 'accepted';
        }
        if(msg == 'RECUSADA'){
            return undefined;
        }
    }
}}));
app.set('view engine', 'hbs');

app.use(router)

app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`)
})