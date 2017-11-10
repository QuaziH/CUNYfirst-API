require('dotenv').config();
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;

const nodemailer = require('nodemailer');
const htmlToText = require('nodemailer-html-to-text').htmlToText;
const client = require('twilio')(accountSid, authToken);

let twilio = (phone, body) => {
    client.messages
        .create({
            to: phone,
            from: '+19082800331',
            body: body
        })
        .then((message) => console.log(message.sid));
};

let emailOpen = (phone, body) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EPASSWORD
        }
    });

    transporter.use('compile', htmlToText());

    let mailOptions = {
        from: 'noclosedclass@gmail.com',
        to: phone,
        html: '<bold></bold>',
        subject: 'Class Opened!',
        text: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
};

let emailConfirmation = (phone, body) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EPASSWORD
        }
    });

    transporter.use('compile', htmlToText());

    let mailOptions = {
        from: 'noclosedclass@gmail.com',
        to: phone,
        html:'<bold></bold>',
        subject: 'Confirmation',
        text: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
};

let emailError = (phone, body) => {
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EPASSWORD
        }
    });

    let mailOptions = {
        from: 'noclosedclass@gmail.com',
        to: phone,
        html:'<bold></bold>',
        subject: 'Uh oh',
        text: body
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
};

// twilio('3475276604', 'test');
// emailOpen('9177160864@vtext.net', 'test');
// Only T-Mobile and MetroPCS works well
module.exports = {
    emailOpen,
    emailConfirmation,
    emailError,
    twilio
};