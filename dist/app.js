'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var express = require('express');
var hbs = require('hbs');
var bodyParser = require('body-parser');
var db = require('./db/index');
var worker = require('./worker');

var app = express();

hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + 'public'));

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

app.post('/add', function (req, res) {
    db.query("INSERT INTO classes (institution, term, subject, class_num, phone, carrier) VALUES ($1, $2, $3, $4, $5, $6)", [req.body.institution, req.body.term, req.body.subject, req.body.class_num, req.body.phone, req.body.carrier], function (error, response) {
        if (error) {
            return console.error('Error inserting into database: ', error);
        }
    });
    /********************
    add text to email confirmation here
    ********************/
    res.redirect('/');
});

app.listen(3000, function () {
    console.log('Server started on port 3000');
});
//# sourceMappingURL=app.js.map