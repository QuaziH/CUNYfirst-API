'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var text = require('./text');
var db = require('./db/index');
var worker = require('./worker');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
    res.render('index.hbs');
});

app.get('/subjects/:inst', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var term;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return worker.term(req.params.inst);

                    case 2:
                        term = _context.sent;

                        res.send(term);

                    case 4:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function (_x, _x2) {
        return _ref.apply(this, arguments);
    };
}());

app.get('/subjects/:inst/:term', function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(req, res) {
        var subject;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return worker.subject(req.params.inst, req.params.term);

                    case 2:
                        subject = _context2.sent;

                        res.send(subject);

                    case 4:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined);
    }));

    return function (_x3, _x4) {
        return _ref2.apply(this, arguments);
    };
}());
app.get('/subjects/:inst/:term/:subject/:classNum', function () {
    var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(req, res) {
        var classes;
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
                switch (_context3.prev = _context3.next) {
                    case 0:
                        _context3.next = 2;
                        return worker.getSpecificCourse(req.params.inst, req.params.term, req.params.subject, req.params.classNum);

                    case 2:
                        classes = _context3.sent;

                        res.send(classes);

                    case 4:
                    case 'end':
                        return _context3.stop();
                }
            }
        }, _callee3, undefined);
    }));

    return function (_x5, _x6) {
        return _ref3.apply(this, arguments);
    };
}());

app.post('/add', function (req, res) {
    db.query("INSERT INTO classes (institution, term, subject, topic, class_num, phone, carrier) VALUES ($1, $2, $3, $4, $5, $6, $7)", [req.body.institution, req.body.term, req.body.subject, req.body.topic, req.body.class_num, req.body.phone, req.body.carrier], function (error, response) {
        if (error) {
            return console.error('Error inserting into database: ', error);
        }
    });
    if (req.body.carrier === '@tmomail.net' || req.body.carrier === '@mymetropcs.com') {
        text.emailConfirmation('' + req.body.phone + req.body.carrier, 'Your classes have been added.');
    } else {
        text.twilio('' + req.body.phone, 'Your classes have been added.');
    }
    res.redirect('/');
});

app.listen(3000, function () {
    console.log('Server started on port 3000');
});
//# sourceMappingURL=app.js.map