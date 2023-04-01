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

// Local Testing
app.listen(3000, function(){
    console.log("Node application started");
});