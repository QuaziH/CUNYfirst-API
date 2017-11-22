'use strict';

require('dotenv').config();
var accountSid = process.env.ACCOUNT_SID;
var authToken = process.env.AUTH_TOKEN;

var nodemailer = require('nodemailer');
var htmlToText = require('nodemailer-html-to-text').htmlToText;
var client = require('twilio')(accountSid, authToken);

var twilio = function twilio(phone, body) {
    client.messages.create({
        to: phone,
        from: '+19082800331',
        body: body
    }).then(function (message) {
        return console.log(message.sid);
    });
};

var twilioBatch = function twilioBatch(phone, body) {
    client.messages.create({
        to: phone,
        from: '+19082800331',
        body: 'Your classes have been added: \n ' + body
    }).then(function (message) {
        return console.log(message.sid);
    });
};

var emailOpen = function emailOpen(phone, body) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EPASSWORD
        }
    });

    transporter.use('compile', htmlToText());

    var mailOptions = {
        from: 'noclosedclass@gmail.com',
        to: phone,
        html: '<bold></bold>',
        subject: 'Class Opened!',
        text: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
};

var emailConfirmation = function emailConfirmation(phone, body) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EPASSWORD
        }
    });

    transporter.use('compile', htmlToText());

    var mailOptions = {
        from: 'noclosedclass@gmail.com',
        to: phone,
        html: '<bold></bold>',
        subject: 'Confirmation',
        text: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
};

var emailError = function emailError(phone, body) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EPASSWORD
        }
    });

    var mailOptions = {
        from: 'noclosedclass@gmail.com',
        to: phone,
        html: '<bold></bold>',
        subject: 'Uh oh',
        text: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
};

var emailContact = function emailContact(email, subject, body) {
    var transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EPASSWORD
        }
    });

    var mailOptions = {
        from: email,
        to: 'noclosedclass@gmail.com',
        subject: subject,
        text: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
};

// let hello = [`1`, `\n 2`, `\n 4`, `\n 6`, `\n 7`];
//
// twilioBatch('3475276604', hello);

module.exports = {
    emailOpen: emailOpen,
    emailConfirmation: emailConfirmation,
    emailError: emailError,
    emailContact: emailContact,
    twilio: twilio
};
//# sourceMappingURL=text.js.map