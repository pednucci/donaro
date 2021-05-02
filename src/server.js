require('dotenv/config');
const express = require('express');
const app = express();
const path = require('path')
const PORT = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const hbs = require('express-handlebars');
const router = require('./routes');

app.use(express.static(path.join(__dirname, '..', 'public')))

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.engine('hbs', hbs({defaultLayout: 'main', extname: '.hbs'}));
app.set('view engine', 'hbs');

app.use(router)

app.listen(PORT, () => {
    console.log(`Server is running in port ${PORT}`)
})