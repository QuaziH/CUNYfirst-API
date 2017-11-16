'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var db = require('./db/index');
var text = require('./text');
var api = require('./cf-api');

var looper = function looper() {
    db.query('SELECT DISTINCT institution, term, subject FROM classes', function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(error, response) {
            var _loop, i;

            return regeneratorRuntime.wrap(function _callee$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            if (!error) {
                                _context2.next = 2;
                                break;
                            }

                            return _context2.abrupt('return', console.error('Error fetching client', error));

                        case 2:
                            if (!(response.rowCount === 0)) {
                                _context2.next = 6;
                                break;
                            }

                            console.log('Table is empty');
                            _context2.next = 13;
                            break;

                        case 6:
                            _loop = /*#__PURE__*/regeneratorRuntime.mark(function _loop(i) {
                                var allClasses;
                                return regeneratorRuntime.wrap(function _loop$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                _context.next = 2;
                                                return api.getAllSections('' + response.rows[i].institution, '' + response.rows[i].term, '' + response.rows[i].subject);

                                            case 2:
                                                allClasses = _context.sent;

                                                db.query('SELECT phone, carrier, topic, class_num FROM classes WHERE institution=\'' + response.rows[i].institution + '\' AND term=\'' + response.rows[i].term + '\' AND subject=\'' + response.rows[i].subject + '\'', function (error, response) {
                                                    if (error) {
                                                        return console.error('Error fetching client', error);
                                                    }

                                                    for (var j = 0; j < response.rows.length; j++) {
                                                        var status = void 0;
                                                        try {
                                                            status = allClasses[response.rows[j].class_num].Status;
                                                        } catch (e) {
                                                            if (response.rows[j].carrier === '@tmomail.net' || response.rows[j].carrier === '@mymetropcs.com') {
                                                                text.emailError('' + response.rows[j].phone + response.rows[j].carrier, 'Your class ' + response.rows[j].topic + '- ' + response.rows[j].class_num + ' does not exist in CUNYfirst anymore');
                                                            } else {
                                                                text.twilio('' + response.rows[j].phone, 'Uh oh! \n Your class ' + response.rows[j].topic + '- ' + response.rows[j].class_num + ' does not exist in CUNYfirst anymore');
                                                            }
                                                            db.query('DELETE FROM classes WHERE phone=\'' + response.rows[j].phone + '\' AND class_num=' + response.rows[j].class_num, function (err, res) {
                                                                if (err) {
                                                                    console.error('Error deleting from database: ' + err);
                                                                }
                                                            });
                                                            continue;
                                                        }

                                                        if (status === 'Closed') {
                                                            console.log('Class is still closed ' + response.rows[j].topic + '- ' + response.rows[j].class_num);
                                                        } else if (status === 'Open') {
                                                            if (response.rows[j].carrier === '@tmomail.net' || response.rows[j].carrier === '@mymetropcs.com') {
                                                                text.emailOpen('' + response.rows[j].phone + response.rows[j].carrier, 'Your class ' + response.rows[j].topic + '- ' + response.rows[j].class_num + ' is now open!');
                                                            } else {
                                                                text.twilio('' + response.rows[j].phone, 'Class Opened! \n Your class ' + response.rows[j].topic + '- ' + response.rows[j].class_num + ' is now open!');
                                                            }
                                                            db.query('DELETE FROM classes WHERE phone=\'' + response.rows[j].phone + '\' AND class_num=' + response.rows[j].class_num, function (err, res) {
                                                                if (err) {
                                                                    console.error('Error deleting from database: ' + err);
                                                                }
                                                            });
                                                        }
                                                    }
                                                });

                                            case 4:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _loop, undefined);
                            });
                            i = 0;

                        case 8:
                            if (!(i < response.rows.length)) {
                                _context2.next = 13;
                                break;
                            }

                            return _context2.delegateYield(_loop(i), 't0', 10);

                        case 10:
                            i++;
                            _context2.next = 8;
                            break;

                        case 13:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee, undefined);
        }));

        return function (_x, _x2) {
            return _ref.apply(this, arguments);
        };
    }());
};

setInterval(looper, 300000);
//# sourceMappingURL=looper.js.map