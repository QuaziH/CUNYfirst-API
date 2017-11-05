'use strict';

var request = require('request');
var cheerio = require('cheerio');

var options = {
    url: 'https://hrsa.cunyfirst.cuny.edu/psc/cnyhcprd/GUEST/HRMS/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL',
    headers: { 'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36' },
    jar: request.jar()
};

var getOptionsFromDropdown = function getOptionsFromDropdown(body, id, callback) {
    var $ = cheerio.load(body);
    var options = $(id).children();
    var values = {};

    for (var i = 1; i < options.length; i++) {
        values[options[i].children[0].data] = options[i].attribs.value;
    }

    callback(values);
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

var urlProducer = function urlProducer(ICStateNum, ICSID, inst, session) {
    return 'https://hrsa.cunyfirst.cuny.edu/psc/cnyhcprd/GUEST/HRMS/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL?ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum=' + ICStateNum + '&ICAction=CLASS_SRCH_WRK2_STRM$35$&ICXPos=0&ICYPos=0&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus&ICSaveWarningFilter=0&ICChanged=-1&ICAutoSave=0&ICResubmit=0&ICSID=' + ICSID + '=&ICActionPrompt=false&ICBcDomData=undefined&ICFind&ICAddCount&ICAPPCLSDATA&CLASS_SRCH_WRK2_INSTITUTION$31$=' + inst + '&CLASS_SRCH_WRK2_STRM$35$=' + session;
};

var urlProducerClasses = function urlProducerClasses(ICStateNum, ICSID, session, subject) {
    return 'https://hrsa.cunyfirst.cuny.edu/psc/cnyhcprd/GUEST/HRMS/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL?ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum=' + ICStateNum + '&ICAction=CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH&ICXPos=0&ICYPos=0&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus&ICSaveWarningFilter=0&ICChanged=-1&ICAutoSave=0&ICResubmit=0&ICSID=' + ICSID + '=&ICActionPrompt=false&ICBcDomData=undefined&ICFind&ICAddCount&ICAPPCLSDATA&CLASS_SRCH_WRK2_STRM$35$=' + session + '&SSR_CLSRCH_WRK_SUBJECT_SRCH$0=' + subject + '&SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$1=G&SSR_CLSRCH_WRK_CATALOG_NBR$1=0&SSR_CLSRCH_WRK_SSR_OPEN_ONLY$chk$5=N';
};

var section = function section(inst, term, subject, callback) {
    request.get(options, function (error, response, body) {
        if (error) {
            console.log('CUNYfirst is currently offline.');
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
            submit_options['url'] = urlProducerClasses(++ICStateNum, ICSID, term, subject);
            request.get(submit_options, function (error, response, body) {
                var classes = {};
                var $ = cheerio.load(body);
                console.log($('#ACE_\\$ICField\\$4\\$\\$0').children().length);
            });
        });
    });
};

var subject = function subject(inst, term, callback) {
    request.get(options, function (error, response, body) {
        if (error) {
            console.log('CUNYfirst is currently offline.');
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
            getOptionsFromDropdown(body, id, callback);
        });
    });
};

var term = function term(inst, callback) {
    request.get(options, function (error, response, body) {
        if (error) {
            console.log('CUNYfirst is currently offline.');
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
            getOptionsFromDropdown(body, id, callback);
        });
    });
};

var institutions = function institutions(callback) {
    request.get(options, function (error, response, body) {
        if (error) {
            console.log('CUNYfirst is currently offline.');
        }

        var id = '#CLASS_SRCH_WRK2_INSTITUTION\\$31\\$';
        getOptionsFromDropdown(body, id, callback);
    });
};

section('QNS01', '1182', 'CSCI', function () {
    console.log();
});

// subject('QNS01', '1182', function(r){
//     console.log(r);
// });

// term('QNS01', function(r){
//     console.log(r);
// });

// institutions(function(r){
//     console.log(r);
// });
//# sourceMappingURL=worker.js.map