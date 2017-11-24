const express = require('express');
const hbs = require('hbs');
const bodyParser = require('body-parser');
const text = require('./text');
const db = require('./db/index');
const worker = require('./worker');
const nodemailer = require('nodemailer');

const port = process.env.PORT || 3000;

let app = express();

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('index.hbs');
});

app.get('/help', (req, res) => {
    res.render('help.hbs');
});

app.get('/contact', (req, res) => {
    res.render('contact.hbs');
});

app.get('/contact-confirmation', (req, res) => {
    res.render('contact-confirmation.hbs');
});

app.get('/subjects/:inst', async (req, res) => {
    let term = await worker.term(req.params.inst);
    res.send(term);
});

app.get('/subjects/:inst/:term', async (req, res) => {
    let subject = await worker.subject(req.params.inst, req.params.term);
    res.send(subject);
});
app.get('/subjects/:inst/:term/:subject/:courseNum', async (req, res) => {
    let classes = await worker.getSpecificCourse(req.params.inst, req.params.term, req.params.subject, req.params.courseNum);
    res.send(classes);
});

app.get('/add/:inst/:term/:subj/:topic/:classNum/:phone/:carrier', async (req, res) => {
    db.query("INSERT INTO classes (institution, term, subject, topic, class_num, phone, carrier) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [req.params.inst, req.params.term, req.params.subj, req.params.topic, req.params.classNum, req.params.phone, req.params.carrier], (error, response) => {
            if (error){
                return res.status(500).send(`Error inserting into database: ${error}`);
            }
        });
    if(req.params.carrier === '@tmomail.net' || req.params.carrier === '@mymetropcs.com'){
        text.emailConfirmation(`${req.params.phone}${req.params.carrier}`, `Your class ${req.params.topic}- ${req.params.classNum} has been added.`);
    } else {
        text.twilio(`${req.params.phone}`, `Your class ${req.params.topic}- ${req.params.classNum} has been added.`);
    }
    res.end('Success');
});

app.post('/contact', (req, res) => {
    console.log(req.body.email);
    // text.emailContact(`${req.body.first}${req.body.last}, ${req.body.email}`, `${req.body.subject}`, `${req.body.message} \n - ${req.body.first} ${req.body.last} ${req.body.email}`);
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EPASSWORD
        }
    });

    let mailOptions = {
        from: `${req.body.first} ${req.body.last} <${req.body.email}>`,
        to: `noclosedclass@gmail.com`,
        subject: req.body.subject,
        text: `${req.body.message} \n - ${req.body.first} ${req.body.last} ${req.body.email}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
        }
        // console.log('Message sent: %s', info.messageId);
        transporter.close();
    });
    res.redirect('/contact-confirmation');
});

app.listen(port, function(){
    console.log(`Server started on port ${port}`);
});