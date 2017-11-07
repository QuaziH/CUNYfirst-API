const express = require('express');
const hbs = require('hbs');
const db = require('./db/index');

let app = express();

app.set('view engine', 'hbs');

app.use(express.static(__dirname + 'public'));

app.get('/', (req, res) => {
   // res.render('index.hbs');
    db.query('SELECT * FROM classes', [], (err, res) => {
        if (err){
            return console.error('Error fetching client from pool', err);
        }
        res.send(res.rows[0]);
    })
});

app.listen(3000, function(){
    console.log(`Server started on port 3000`);
});