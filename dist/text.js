'use strict';

require('dotenv').config();
var nodemailer = require('nodemailer');

var email = function email(phone, body) {
    nodemailer.createTestAccount(function (err) {
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
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        });
    });
};
//# sourceMappingURL=text.js.map