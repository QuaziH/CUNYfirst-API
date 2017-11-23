'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function addToDatabase(classNmbr, topic) {
    if (document.querySelector('#institution').value !== '' && document.querySelector('#term').value !== '' && document.querySelector('#subject').value !== '' && document.querySelector('#phone_num').value !== '' && document.querySelector('#carrier').value !== '') {
        fetch('/add/' + document.querySelector('#institution').value + '/' + document.querySelector('#term').value + '/' + document.querySelector('#subject').value + '/' + topic + '/' + classNmbr + '/' + document.querySelector('#phone_num').value + '/' + document.querySelector('#carrier').value + '/').then(function () {
            document.getElementById('confirmation').innerHTML = 'Your class has been added. You will be notified shortly.';
        });
    }
}

function getSpecificCourse(event) {
    var _this = this;

    document.getElementById('confirmation').innerHTML = '';
    if (document.querySelector('#institution').value !== '' && document.querySelector('#term').value !== '' && document.querySelector('#subject').value !== '' && document.querySelector('#course_num').value !== '') {
        document.getElementById('loader').style.visibility = "visible";
        fetch('/subjects/' + document.querySelector('#institution').value + '/' + document.querySelector('#term').value + '/' + document.querySelector('#subject').value + '/' + document.querySelector('#course_num').value + '/').then(function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(res) {
                var classes, key, secKey, classNmbr, dayTime, room, instructor, topic;
                return regeneratorRuntime.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return res.json();

                            case 2:
                                classes = _context.sent;

                                document.getElementById('table').style.visibility = "visible";
                                document.querySelectorAll("tbody tr").forEach(function (tr) {
                                    return tr.remove();
                                });
                                for (key in classes) {
                                    if (classes.hasOwnProperty(key)) {
                                        document.getElementById('topic').innerHTML = '' + Object.keys(classes)[0];
                                        for (secKey in classes[key]) {
                                            if (classes[key].hasOwnProperty(secKey)) {
                                                classNmbr = classes[key][secKey].Class;
                                                dayTime = classes[key][secKey]['Days & Time'];
                                                room = classes[key][secKey].Room;
                                                instructor = classes[key][secKey].Instructor;
                                                topic = classes[key][secKey].Topic;

                                                document.getElementById("table_body").insertRow(-1).innerHTML = '<td class="classNmbr">' + classNmbr + '</td>' + ('<td>' + dayTime + '</td>') + ('<td>' + room + '</td>') + ('<td>' + instructor + '</td>') + ('<td><button type="button" class="btn btn-primary submit-data" onclick="addToDatabase(\'' + classNmbr + '\', \'' + topic + '\')">Submit</button></td>');
                                            }
                                        }
                                    }
                                }
                                document.getElementById('loader').style.visibility = "hidden";
                                document.getElementById('topic').scrollIntoView();

                            case 8:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, _this);
            }));

            return function (_x) {
                return _ref.apply(this, arguments);
            };
        }());
    }
}

function getSubject(event) {
    var _this2 = this;

    document.getElementById('subject').options.length = 0;
    $('#subject').append('<option value="">Choose Subject...</option>');

    if (document.querySelector('#institution').value !== '' && document.querySelector('#term').value !== '') {
        document.getElementById('loader').style.visibility = "visible";
        fetch('/subjects/' + document.querySelector('#institution').value + '/' + document.querySelector('#term').value).then(function () {
            var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(res) {
                var subject, key;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return res.json();

                            case 2:
                                subject = _context2.sent;

                                for (key in subject) {
                                    if (subject.hasOwnProperty(key)) {
                                        $('#subject').append($('<option>', {
                                            value: subject[key],
                                            text: key
                                        }));
                                    }
                                }
                                document.getElementById('loader').style.visibility = "hidden";

                            case 5:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, _this2);
            }));

            return function (_x2) {
                return _ref2.apply(this, arguments);
            };
        }());
    }
}

$(".submit-data").click(function () {
    $('.fadeOut').toggleClass('fadeOut-active');
});

/*
    function getInst(event) {
        fetch(`/subjects/`).then(async (res) => {
            let term = await res.json();
            for(let key in term){
                if(term.hasOwnProperty(key)){
                    $('#institution').append($('<option>', {
                        value: term[key],
                        text : key
                    }));
                }
            }
        });

    } //Only use for pulling Institutions

    function getTerm(event) {
        document.getElementById('term').options.length = 0;
        $('#term').append('<option value="">Choose Term...</option>');

        if (document.querySelector('#institution').value !== '') {
            fetch(`/subjects/${document.querySelector('#institution').value}/${document.querySelector('#term').value}/`).then(async (res) => {
                let term = await res.json();
                for(let key in term){
                    if(term.hasOwnProperty(key)){
                        $('#term').append($('<option>', {
                            value: term[key],
                            text : key
                        }));
                    }
                }
            });
        }
    }
*/
//# sourceMappingURL=index.js.map