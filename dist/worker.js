'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

require('dotenv').config();
var request = require('request');
var cheerio = require('cheerio');

var options = {
    url: process.env.CUNYfirst_url,
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36' },
    jar: request.jar()
};

var getOptionsFromDropdown = function getOptionsFromDropdown(body, id) {
    var $ = cheerio.load(body);
    var options = $(id).children();
    var values = {};

    for (var i = 1; i < options.length; i++) {
        values[options[i].children[0].data] = options[i].attribs.value;
    }

    return values;
};

var getICValues = function getICValues(body) {
    var $ = cheerio.load(body);
    var id = '#win0divPSHIDDENFIELDS';
    var input = $(id).children();
    var ICValues = {};

    for (var i = 0; i < input.length; i++) {
        ICValues[input[i].attribs.name] = input[i].attribs.value;
    }

    return ICValues;
};

var urlProducer = function urlProducer(ICStateNum, ICSID, inst, term) {
    return 'https://hrsa.cunyfirst.cuny.edu/psc/cnyhcprd/GUEST/HRMS/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL?ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum=' + ICStateNum + '&ICAction=CLASS_SRCH_WRK2_STRM$35$&ICXPos=0&ICYPos=0&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus&ICSaveWarningFilter=0&ICChanged=-1&ICAutoSave=0&ICResubmit=0&ICSID=' + ICSID + '=&ICActionPrompt=false&ICBcDomData=undefined&ICFind&ICAddCount&ICAPPCLSDATA&CLASS_SRCH_WRK2_INSTITUTION$31$=' + inst + '&CLASS_SRCH_WRK2_STRM$35$=' + term;
};

var urlProducerAllClasses = function urlProducerAllClasses(ICStateNum, ICSID, term, subject) {
    return 'https://hrsa.cunyfirst.cuny.edu/psc/cnyhcprd/GUEST/HRMS/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL?ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum=' + ICStateNum + '&ICAction=CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH&ICXPos=0&ICYPos=0&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus&ICSaveWarningFilter=0&ICChanged=-1&ICAutoSave=0&ICResubmit=0&ICSID=' + ICSID + '=&ICActionPrompt=false&ICBcDomData=undefined&ICFind&ICAddCount&ICAPPCLSDATA&CLASS_SRCH_WRK2_STRM$35$=' + term + '&SSR_CLSRCH_WRK_SUBJECT_SRCH$0=' + subject + '&SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$1=G&SSR_CLSRCH_WRK_CATALOG_NBR$1=0&SSR_CLSRCH_WRK_SSR_OPEN_ONLY$chk$5=N';
};

var urlProducerSpecificCourse = function urlProducerSpecificCourse(ICStateNum, ICSID, term, subject, course) {
    return 'https://hrsa.cunyfirst.cuny.edu/psc/cnyhcprd/GUEST/HRMS/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL?ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum=' + ICStateNum + '&ICAction=CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH&ICXPos=0&ICYPos=98&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus=&ICSaveWarningFilter=0&ICChanged=-1&ICAutoSave=0&ICResubmit=0&ICSID=' + ICSID + '=&ICActionPrompt=false&ICBcDomData=undefined&ICFind=&ICAddCount=&ICAPPCLSDATA=&CLASS_SRCH_WRK2_STRM$35$=' + term + '&SSR_CLSRCH_WRK_SUBJECT_SRCH$0=' + subject + '&SSR_CLSRCH_WRK_CATALOG_NBR$1=' + course + '&SSR_CLSRCH_WRK_SSR_OPEN_ONLY$chk$5=N';
};

var urlProducerClassNumber = function urlProducerClassNumber(ICStateNum, ICSID, term, classNum) {
    return 'https://hrsa.cunyfirst.cuny.edu/psc/cnyhcprd/GUEST/HRMS/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL?ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum=' + ICStateNum + '&ICAction=CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH&ICXPos=0&ICYPos=142&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus=&ICSaveWarningFilter=0&ICChanged=-1&ICAutoSave=0&ICResubmit=0&ICSID=' + ICSID + '=&ICActionPrompt=false&ICBcDomData=undefined&ICFind=&ICAddCount=&ICAPPCLSDATA=&CLASS_SRCH_WRK2_STRM$35$=' + term + '&SSR_CLSRCH_WRK_CLASS_NBR$10=' + classNum;
};

var getAllSections = function getAllSections(inst, term, subject) {
    return new Promise(function (resolve, reject) {
        request.get(options, function (error, response, body) {
            if (error) {
                reject('CUNYfirst is currently offline.');
            }

            var ICValues = getICValues(body);

            var ICStateNum = ICValues['ICStateNum'];
            var ICSID = ICValues['ICSID'];

            var submit_options = {
                url: urlProducer(ICStateNum, ICSID, inst, term),
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36' },
                jar: options.jar
            };

            request.get(submit_options, function (error, response, body) {
                submit_options['url'] = urlProducerAllClasses(++ICStateNum, ICSID, term, subject);
                request.get(submit_options, function (error, response, body) {
                    if (error) {
                        reject('CUNYfirst is currently offline.');
                    }

                    var classes = {};
                    var $ = cheerio.load(body);

                    var i = 0;
                    var idTitle = '#win0divSSR_CLSRSLT_WRK_GROUPBOX2GP\\$' + i;
                    var idTable = '#ACE_\\$ICField48\\$' + i;

                    var section = 0;

                    while ($(idTitle).text() !== '') {
                        classes[$(idTitle).text()] = {};

                        for (var j = 0; j < $(idTable).children()[0].children.length / 4; j++) {
                            var classNumber = $('#MTG_CLASS_NBR\\$' + section).text();
                            var className = $('#MTG_CLASSNAME\\$' + section).text();
                            var time = $('#MTG_DAYTIME\\$' + section).text();
                            var room = $('#MTG_ROOM\\$' + section).text();
                            var instructor = $('#MTG_INSTR\\$' + section).text();
                            var dates = $('#MTG_TOPIC\\$' + section).text();
                            var status = $('#win0divDERIVED_CLSRCH_SSR_STATUS_LONG\\$' + section).children()[0].children[3].attribs.alt;
                            var description = $('#DERIVED_CLSRCH_DESCRLONG\\$' + section).text();

                            classes[$(idTitle).text()][classNumber] = {};
                            classes[$(idTitle).text()][classNumber]['Class'] = classNumber;
                            classes[$(idTitle).text()][classNumber]['Section'] = className;
                            classes[$(idTitle).text()][classNumber]['Days & Time'] = time;
                            classes[$(idTitle).text()][classNumber]['Room'] = room;
                            classes[$(idTitle).text()][classNumber]['Instructor'] = instructor;
                            classes[$(idTitle).text()][classNumber]['Dates'] = dates;
                            classes[$(idTitle).text()][classNumber]['Status'] = status;
                            classes[$(idTitle).text()][classNumber]['Description'] = description;

                            section++;
                        }

                        i++;
                        idTitle = '#win0divSSR_CLSRSLT_WRK_GROUPBOX2GP\\$' + i;
                        idTable = '#ACE_\\$ICField48\\$' + i;
                    }

                    resolve(classes);
                });
            });
        });
    });
};

var getSpecificCourse = function getSpecificCourse(inst, term, subject, course) {
    return new Promise(function (resolve, reject) {
        request.get(options, function (error, response, body) {
            if (error) {
                reject('CUNYfirst is currently offline.');
            }

            var ICValues = getICValues(body);

            var ICStateNum = ICValues['ICStateNum'];
            var ICSID = ICValues['ICSID'];

            var submit_options = {
                url: urlProducer(ICStateNum, ICSID, inst, term),
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36' },
                jar: options.jar
            };

            request.get(submit_options, function (error, response, body) {
                submit_options['url'] = urlProducerSpecificCourse(++ICStateNum, ICSID, term, subject, course);
                request.get(submit_options, function (error, response, body) {
                    if (error) {
                        reject('CUNYfirst is currently offline.');
                    }

                    var classes = {};
                    var $ = cheerio.load(body);

                    var i = 0;
                    var idTitle = '#win0divSSR_CLSRSLT_WRK_GROUPBOX2GP\\$' + i;
                    var idTable = '#ACE_\\$ICField48\\$' + i;

                    var section = 0;

                    while ($(idTitle).text() !== '') {
                        classes[$(idTitle).text()] = {};

                        for (var j = 0; j < $(idTable).children()[0].children.length / 4; j++) {
                            var classNumber = $('#MTG_CLASS_NBR\\$' + section).text();
                            var className = $('#MTG_CLASSNAME\\$' + section).text();
                            var time = $('#MTG_DAYTIME\\$' + section).text();
                            var room = $('#MTG_ROOM\\$' + section).text();
                            var instructor = $('#MTG_INSTR\\$' + section).text();
                            var dates = $('#MTG_TOPIC\\$' + section).text();
                            var status = $('#win0divDERIVED_CLSRCH_SSR_STATUS_LONG\\$' + section).children()[0].children[3].attribs.alt;
                            var description = $('#DERIVED_CLSRCH_DESCRLONG\\$' + section).text();

                            classes[$(idTitle).text()][classNumber] = {};
                            classes[$(idTitle).text()][classNumber]['Class'] = classNumber;
                            classes[$(idTitle).text()][classNumber]['Section'] = className;
                            classes[$(idTitle).text()][classNumber]['Days & Time'] = time;
                            classes[$(idTitle).text()][classNumber]['Room'] = room;
                            classes[$(idTitle).text()][classNumber]['Instructor'] = instructor;
                            classes[$(idTitle).text()][classNumber]['Dates'] = dates;
                            classes[$(idTitle).text()][classNumber]['Status'] = status;
                            classes[$(idTitle).text()][classNumber]['Description'] = description;

                            section++;
                        }

                        i++;
                        idTitle = '#win0divSSR_CLSRSLT_WRK_GROUPBOX2GP\\$' + i;
                        idTable = '#ACE_\\$ICField48\\$' + i;
                    }

                    resolve(classes);
                });
            });
        });
    });
};

var getClassByClassNumber = function getClassByClassNumber(inst, term, classNum) {
    return new Promise(function (resolve, reject) {
        request.get(options, function (error, response, body) {
            if (error) {
                reject('CUNYfirst is currently offline.');
            }

            var ICValues = getICValues(body);

            var ICStateNum = ICValues['ICStateNum'];
            var ICSID = ICValues['ICSID'];

            var submit_options = {
                url: urlProducer(ICStateNum, ICSID, inst, term),
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36' },
                jar: options.jar
            };

            request.get(submit_options, function (error, response, body) {
                submit_options['url'] = urlProducerClassNumber(++ICStateNum, ICSID, term, classNum);
                request.get(submit_options, function (error, response, body) {
                    if (error) {
                        reject('CUNYfirst is currently offline.');
                    }

                    var classes = {};
                    var $ = cheerio.load(body);

                    var i = 0;
                    var idTitle = '#win0divSSR_CLSRSLT_WRK_GROUPBOX2GP\\$' + i;
                    var idTable = '#ACE_\\$ICField48\\$' + i;

                    var section = 0;

                    while ($(idTitle).text() !== '') {
                        classes[$(idTitle).text()] = {};

                        for (var j = 0; j < $(idTable).children()[0].children.length / 4; j++) {
                            var classNumber = $('#MTG_CLASS_NBR\\$' + section).text();
                            var className = $('#MTG_CLASSNAME\\$' + section).text();
                            var time = $('#MTG_DAYTIME\\$' + section).text();
                            var room = $('#MTG_ROOM\\$' + section).text();
                            var instructor = $('#MTG_INSTR\\$' + section).text();
                            var dates = $('#MTG_TOPIC\\$' + section).text();
                            var status = $('#win0divDERIVED_CLSRCH_SSR_STATUS_LONG\\$' + section).children()[0].children[3].attribs.alt;
                            var description = $('#DERIVED_CLSRCH_DESCRLONG\\$' + section).text();

                            classes[$(idTitle).text()][classNumber] = {};
                            classes[$(idTitle).text()][classNumber]['Class'] = classNumber;
                            classes[$(idTitle).text()][classNumber]['Section'] = className;
                            classes[$(idTitle).text()][classNumber]['Days & Time'] = time;
                            classes[$(idTitle).text()][classNumber]['Room'] = room;
                            classes[$(idTitle).text()][classNumber]['Instructor'] = instructor;
                            classes[$(idTitle).text()][classNumber]['Dates'] = dates;
                            classes[$(idTitle).text()][classNumber]['Status'] = status;
                            classes[$(idTitle).text()][classNumber]['Description'] = description;

                            section++;
                        }

                        i++;
                        idTitle = '#win0divSSR_CLSRSLT_WRK_GROUPBOX2GP\\$' + i;
                        idTable = '#ACE_\\$ICField48\\$' + i;
                    }

                    resolve(classes);
                });
            });
        });
    });
};

var subject = function subject(inst, term) {
    return new Promise(function (resolve, reject) {
        request.get(options, function (error, response, body) {
            if (error) {
                reject('CUNYfirst is currently offline.');
            }

            var ICValues = getICValues(body);

            var ICStateNum = ICValues['ICStateNum'];
            var ICSID = ICValues['ICSID'];

            var submit_options = {
                url: urlProducer(ICStateNum, ICSID, inst, term),
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36' },
                jar: options.jar
            };

            request.get(submit_options, function (error, response, body) {
                var id = '#SSR_CLSRCH_WRK_SUBJECT_SRCH\\$0';
                resolve(getOptionsFromDropdown(body, id));
            });
        });
    });
};

var term = function term(inst) {
    return new Promise(function (resolve, reject) {
        request.get(options, function (error, response, body) {
            if (error) {
                reject('CUNYfirst is currently offline.');
            }

            var ICValues = getICValues(body);

            var ICStateNum = ICValues['ICStateNum'];
            var ICSID = ICValues['ICSID'];

            var submit_options = {
                url: urlProducer(ICStateNum, ICSID, inst, ''),
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36' },
                jar: options.jar
            };

            request.get(submit_options, function (error, response, body) {
                var id = '#CLASS_SRCH_WRK2_STRM\\$35\\$';
                resolve(getOptionsFromDropdown(body, id));
            });
        });
    });
};

var institutions = function institutions() {
    return new Promise(function (resolve, reject) {
        request.get(options, function (error, response, body) {
            if (error) {
                reject('CUNYfirst is currently offline.');
            }

            var id = '#CLASS_SRCH_WRK2_INSTITUTION\\$31\\$';
            resolve(getOptionsFromDropdown(body, id));
        });
    });
};

var getClasses = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        var instObj, inst, termObj, term1, subjObj, subj;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.next = 2;
                        return institutions();

                    case 2:
                        instObj = _context.sent;
                        inst = instObj['Queens College'];
                        _context.next = 6;
                        return term(inst);

                    case 6:
                        termObj = _context.sent;
                        term1 = termObj['2018 Spring Term'];
                        _context.next = 10;
                        return subject(inst, term1);

                    case 10:
                        subjObj = _context.sent;
                        subj = subjObj['PHYS - Physics'];
                        _context.next = 14;
                        return getAllSections(inst, term1, subj);

                    case 14:
                        return _context.abrupt('return', _context.sent);

                    case 15:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined);
    }));

    return function getClasses() {
        return _ref.apply(this, arguments);
    };
}();

var start = new Date().getTime();

// getClasses().then((classes) => {
//     console.log(JSON.stringify(classes, undefined, 2));
//     let end = new Date().getTime();
//     let time = end - start;
//     console.log('Execution time: ' + time);
// }).catch((error) => {
//     console.log(error);
// });

getAllSections('QNS01', '1182', 'CSCI').then(function (classes) {
    console.log(JSON.stringify(classes, undefined, 2));
    var end = new Date().getTime();
    var time = end - start;
    console.log('Execution time: ' + time);
}).catch(function (error) {
    console.log(error);
});

// getSpecificCourse('QNS01', '1182', 'ANTH', '102').then((classes) => {
//     console.log(JSON.stringify(classes, undefined, 2));
//     let end = new Date().getTime();
//     let time = end - start;
//     console.log('Execution time: ' + time);
// }).catch((error) => {
//     console.log(error);
// });

// getClassByClassNumber('QNS01', '1182', '22453').then((classes) => {
//     console.log(JSON.stringify(classes, undefined, 2));
//     let end = new Date().getTime();
//     let time = end - start;
//     console.log('Execution time: ' + time);
// }).catch((error) => {
//     console.log(error);
// });

module.exports = {
    getAllSections: getAllSections
};
//# sourceMappingURL=worker.js.map