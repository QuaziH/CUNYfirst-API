'use strict';

var express = require('express');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var db = require('./db/index');

var app = express();

app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + 'public'));

app.get('/', function (req, res) {
    res.render('index.hbs');
});

app.post('/add', function (req, res) {
    // res.render('index.hbs');

    db.query("INSERT INTO classes (phone, institution, term, subject, class_num) VALUES ($1, $2, $3, $4, $5)", [req.body.phone, req.body.institution, req.body.term, req.body.subject, req.body.class_num], function (error, response) {
        console.log(req.body.phone);
        if (error) {
            return console.error('Error fetching client', error);
        }
    });
    res.redirect('/');
});

app.listen(3000, function () {
    console.log('Server started on port 3000');
});
//# sourceMappingURL=app.js.map