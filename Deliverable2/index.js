var nunjucks = require("nunjucks");
var path = require('path');
var express = require('express');
var useragent = require('express-useragent');
const db = require('./db');

var app = express();

nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app
});

app.use(express.static(path.join(__dirname, 'public')));
// render the templates
app.use(useragent.express())

app.get('/', (req, res) => {
    res.render('index.njk', {title: 'Home'});
});

app.get('/Booking', (req, res) => {
    res.render('booking.njk', {title: 'Booking'});
});

app.get('/About', (req, res) => {
    res.render('about.njk', {title: 'About'});
});

app.get('/Contact', (req, res) => {
    res.render('contact.njk', {title: 'Contact'});
});

app.get('/Services', (req, res) => {
    res.render('services.njk', {title: 'Services'});
});

app.get('/Login', (req, res) => {
    res.render('login.njk', {title: 'Login'});
});

app.get('/SignUp', (req, res) => {
    res.render('signup.njk', {title: 'Sign Up'});
});

app.get('/ResetPassword', (req, res) => {
    res.render('resetpassword.njk', {title: 'Reset Password'});
});

// Local Testing
app.listen(3000, function(){
    console.log("Node application started localhost:3000");
});