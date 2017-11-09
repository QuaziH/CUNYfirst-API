const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const db = require('./db/index');
const worker = require('./worker');

let app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + 'public'));

app.get('/', (req, res) => {
    res.render('index.hbs');
});

app.get('/subjects/:inst', async (req, res) => {
    let term = await worker.term(req.params.inst);
    res.send(term);
});

app.get('/subjects/:inst/:term', async (req, res) => {
    let subject = await worker.subject(req.params.inst, req.params.term);
    res.send(subject);
});

app.post('/add', (req, res) => {
    db.query("INSERT INTO classes (institution, term, subject, class_num, phone, carrier) VALUES ($1, $2, $3, $4, $5, $6)",
        [req.body.institution, req.body.term, req.body.subject, req.body.class_num, req.body.phone, req.body.carrier], (error, response) => {
        if (error){
            return console.error('Error inserting into database: ', error);
        }
    });
    /********************
    add text to email confirmation here
    ********************/
    res.redirect('/');
});

app.listen(3000, function(){
    console.log(`Server started on port 3000`);
});