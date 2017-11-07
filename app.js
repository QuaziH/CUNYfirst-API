const express = require('express');
const hbs = require('hbs');
const db = require('./db/index');

let app = express();

app.set('view engine', 'hbs');

app.use(express.static(__dirname + 'public'));

app.get('/', (req, res) => {
   res.render('index.hbs');

    // db.query('SELECT * FROM classes', [], (error, response) => {
    //     if (error){
    //         return console.error('Error fetching', error);
    //     }
    //     res.send(response.rows);
    // })
});

app.post('/add', (req, res) => {
    // res.render('index.hbs');

    db.query("INSERT INTO classes (phone, institution, term, subject, class_num) VALUES ($1, $2, $3, $4, $5)",
        [req.phone, req.institution, req.term, req.subject, req.class_num], (error, response) => {
        console.log(req.phone);
        if (error){
            return console.error('Error fetching client', error);
        }
    });
    res.redirect('/');
});

app.listen(3000, function(){
    console.log(`Server started on port 3000`);
});