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

app.get('/subjects/:inst/:term', async (req, res) => {
    console.log(req.params);
    let test = await worker.subject(req.params.inst, req.params.term);
    console.log(test);
    res.send(test);
});

app.post('/add', (req, res) => {
    db.query("INSERT INTO classes (phone, institution, term, subject, class_num) VALUES ($1, $2, $3, $4, $5)",
        [req.body.phone, req.body.institution, req.body.term, req.body.subject, req.body.class_num], (error, response) => {
        console.log(req.body.phone);
        if (error){
            return console.error('Error inserting into database: ', error);
        }
    });
    res.redirect('/');
});

app.listen(3000, function(){
    console.log(`Server started on port 3000`);
});