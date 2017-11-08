'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var db = require('./db/index');
// const text = require('./text');
var api = require('./cf-api');

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

                                            db.query('SELECT class_num FROM classes WHERE institution=\'' + response.rows[i].institution + '\' AND term=\'' + response.rows[i].term + '\' AND subject=\'' + response.rows[i].subject + '\'', function (error, response) {
                                                if (error) {
                                                    return console.error('Error fetching client', error);
                                                }
                                                // console.log(response);
                                                for (var j = 0; j < response.rows.length; j++) {
                                                    var status = allClasses[response.rows[j].class_num].Status;
                                                    console.log(response.rows[j].class_num + ' ' + status);
                                                    if (status === 'Closed') {
                                                        //go to the next number
                                                    } else if (status === 'Open') {
                                                        //text
                                                        //delete by class num and phone num
                                                    } else {
                                                            //text if status doesn't exist
                                                            //delete
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

                    case 4:
                        if (!(i < response.rows.length)) {
                            _context2.next = 9;
                            break;
                        }

                        return _context2.delegateYield(_loop(i), 't0', 6);

                    case 6:
                        i++;
                        _context2.next = 4;
                        break;

                    case 9:
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

// db.query("SELECT phone FROM classes WHERE institution='QNS01' AND term='1182' AND subject='CSCI'",(error, response) => {
//     if (error) {
//         return console.error('Error fetching client', error);
//     }
//     console.log(response);
// });
//# sourceMappingURL=looper.js.map