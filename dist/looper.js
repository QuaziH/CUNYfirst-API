'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('dotenv').config();
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
                        console.log(response);
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

                                            db.query('SELECT phone, carrier, class_num FROM classes WHERE institution=\'' + response.rows[i].institution + '\' AND term=\'' + response.rows[i].term + '\' AND subject=\'' + response.rows[i].subject + '\'', function (error, response) {
                                                if (error) {
                                                    return console.error('Error fetching client', error);
                                                }

                                                for (var j = 0; j < response.rows.length; j++) {
                                                    var status = void 0;
                                                    try {
                                                        status = allClasses[response.rows[j].class_num].Status;
                                                    } catch (err) {
                                                        //text them that their class might not exist anymore in CUNYfirst
                                                        //delete
                                                        // db.query(`DELETE FROM classes WHERE phone='${response.row[j].phone}' AND class_num=${response.row[j].class_num}`, (err, res) => {
                                                        //     if(err) {
                                                        //         console.error(`Error deleting from database: ${err}`);
                                                        //     }
                                                        // });
                                                    }
                                                    console.log(response.rows[j].class_num + ' ' + status);
                                                    //
                                                    // if(status === 'Closed') {
                                                    //     //do nothing...?
                                                    // } else if (status === 'Open'){
                                                    //     //text
                                                    //     //delete by class num and phone num
                                                    //     db.query(`DELETE FROM classes WHERE phone='${response.row[j].phone}' AND class_num=${response.row[j].class_num}`, (err, res) => {
                                                    //         if(err) {
                                                    //             console.error(`Error deleting from database: ${err}`);
                                                    //         }
                                                    //     });
                                                    // } else {
                                                    //     //text if status doesn't exist
                                                    //     //delete
                                                    //     //^ might not need this cause of catch
                                                    // }
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

                    case 5:
                        if (!(i < response.rows.length)) {
                            _context2.next = 10;
                            break;
                        }

                        return _context2.delegateYield(_loop(i), 't0', 7);

                    case 7:
                        i++;
                        _context2.next = 5;
                        break;

                    case 10:
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
//# sourceMappingURL=looper.js.map