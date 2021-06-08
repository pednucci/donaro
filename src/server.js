require('dotenv/config');
const express = require('express');
const app = express();
const path = require('path')
const PORT = process.env.PORT || 3000;
const hbs = require('express-handlebars');
const router = require('./routes');
const flash = require('connect-flash');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const { format } = require('date-fns');
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const { isBanned } = require("./helpers/isBanned");
module.exports = {io};
require('./config/auth')(passport);
require('./Websocket');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(fileUpload())

const session = require('express-session')({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
});
const sharedsession = require('express-socket.io-session');

app.use(session)
io.use(sharedsession(session))

app.use(passport.initialize());
app.use(passport.session());

app.use(flash());

app.use((req, res, next) => {
    res.locals.successMsg = req.flash("successMsg");
    res.locals.errorMsg = req.flash("errorMsg");
    res.locals.error = req.flash("error");
    res.locals.user = req.user || null;
    if(req.user){
        if(req.user[0].cd_isAdmin_usuario == 1) res.locals.admin = 1;
    }
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
    onlyHour: (hour) => {
        return format(new Date(hour), 'HH:mm')
    },
    telNumber: (tel) => {
        const ddd = tel.slice(0,2); 
        const part1 = tel.slice(2,7);
        const part2 = tel.slice(7,11);
        return `(${ddd}) ${part1}-${part2}` //(XX) YYYYY-YYYY
    },
    dateIntFormat: (date) => {
        return format(new Date(date), 'yyyy-MM-dd')
    },
    resolvidoOrPendente: (text) => {
        if(text == 'Resolvida') return true
    },
    replaceSpace: (text) => {
        return text.split(" ").join("")
    },
    section: function(name, options){
        if(!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
    }
}}));
app.set('view engine', 'hbs');

app.use(isBanned, router);

server.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`)
})