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
    res.render('index.njk', {index: true, title: 'Home'});
});

app.get('/rooms', (req, res) => {
    db.query('SELECT * FROM rooms', (err, result) => {
        if (err) {
            res.status(401);
        } else {
            res.render('rooms.njk', {rooms: true, title: 'Rooms', rooms: result});
        }
    });
});

// Local Testing
app.listen(3000, function(){
    console.log("Node application started");
});