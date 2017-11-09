'use strict';

require('dotenv').config();
var accountSid = process.env.ACCOUNT_SID;
var authToken = process.env.AUTH_TOKEN;

var nodemailer = require('nodemailer');
var client = require('twilio')(accountSid, authToken);

//+19082800331

var twilio = function twilio(phone, body) {
    client.messages.create({
        to: phone,
        from: '+19082800331',
        body: body
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

    var mailOptions = {
        from: 'noclosedclass@gmail.com',
        to: phone,
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

    var mailOptions = {
        from: 'noclosedclass@gmail.com',
        to: phone,
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

// twilio('3475276604', 'test');
emailOpen('5164581826@messaging.sprintpcs.com', 'heyyyyy ;););)');

module.exports = {
    emailOpen: emailOpen,
    emailConfirmation: emailConfirmation,
    emailError: emailError,
    twilio: twilio
};
//# sourceMappingURL=text.js.map