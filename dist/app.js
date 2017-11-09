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

app.get('/subjects/:inst/:term', function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(req, res) {
        var test;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        console.log(req.params);
                        _context.next = 3;
                        return worker.subject(req.params.inst, req.params.term);

                    case 3:
                        test = _context.sent;

                        console.log(test);
                        res.send(test);

                    case 6:
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

app.post('/add', function (req, res) {
    db.query("INSERT INTO classes (phone, institution, term, subject, class_num) VALUES ($1, $2, $3, $4, $5)", [req.body.phone, req.body.institution, req.body.term, req.body.subject, req.body.class_num], function (error, response) {
        console.log(req.body.phone);
        if (error) {
            return console.error('Error inserting into database: ', error);
        }
    });
    res.redirect('/');
});

app.listen(3000, function () {
    console.log('Server started on port 3000');
});
//# sourceMappingURL=app.js.map