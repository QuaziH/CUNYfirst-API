const request = require('request');
const cheerio = require('cheerio');

let options = {
    url: '',
    headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'},
    jar: request.jar()
};

let getOptionsFromDropdown = (body, id, callback) => {
    let $ = cheerio.load(body);
    let options = $(id).children();
    let values = {};

    for(let i = 1; i < options.length; i++){
        values[options[i].children[0].data] = options[i].attribs.value;
    }

    callback(values);
};

let getICValues = (body) => {
    let $ = cheerio.load(body);
    let id ='#win0divPSHIDDENFIELDS';
    let input = $(id).children();
    let ICValues = {};

    for(let i = 0; i < input.length; i++){
        ICValues[input[i].attribs.name] = input[i].attribs.value;
    }

    return ICValues;
};

let urlProducer = (ICStateNum, ICSID, inst, session) => {
    return 'https://hrsa.cunyfirst.cuny.edu/psc/cnyhcprd/GUEST/HRMS/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL?ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum='
        +ICStateNum+
        '&ICAction=CLASS_SRCH_WRK2_STRM$35$&ICXPos=0&ICYPos=0&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus&ICSaveWarningFilter=0&ICChanged=-1&ICAutoSave=0&ICResubmit=0&ICSID='
        +ICSID+
        '=&ICActionPrompt=false&ICBcDomData=undefined&ICFind&ICAddCount&ICAPPCLSDATA&CLASS_SRCH_WRK2_INSTITUTION$31$='
        +inst+
        '&CLASS_SRCH_WRK2_STRM$35$='
        +session
};

let urlProducerClasses = (ICStateNum, ICSID, session, subject) => {
    return 'https://hrsa.cunyfirst.cuny.edu/psc/cnyhcprd/GUEST/HRMS/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL?ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum='
        +ICStateNum+
        '&ICAction=CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH&ICXPos=0&ICYPos=0&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus&ICSaveWarningFilter=0&ICChanged=-1&ICAutoSave=0&ICResubmit=0&ICSID='
        +ICSID+
        '=&ICActionPrompt=false&ICBcDomData=undefined&ICFind&ICAddCount&ICAPPCLSDATA&CLASS_SRCH_WRK2_STRM$35$='
        +session+
        '&SSR_CLSRCH_WRK_SUBJECT_SRCH$0='
        +subject+
        '&SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$1=G&SSR_CLSRCH_WRK_CATALOG_NBR$1=0&SSR_CLSRCH_WRK_SSR_OPEN_ONLY$chk$5=N'
};

let section = (inst, term, subject, callback) => {
    request.get(options, function(error, response, body){
        if(error){
            console.log('CUNYfirst is currently offline.');
        }

        let ICValues = getICValues(body);

        let ICStateNum = ICValues['ICStateNum'];
        let ICSID = ICValues['ICSID'];

        let submit_options = {
            url: urlProducer(ICStateNum, ICSID, inst, term),
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'},
            jar: options.jar
        };

        request.get(submit_options, function(error, response, body){
            submit_options['url'] = urlProducerClasses(++ICStateNum, ICSID, term, subject);
            request.get(submit_options, function(error, response, body) {
                let classes = {};
                let $ = cheerio.load(body);

                let i = 0;
                let idTitle = `#win0divSSR_CLSRSLT_WRK_GROUPBOX2GP\\$${i}`;
                let idTable = `#ACE_\\$ICField48\\$${i}`;

                console.log($(`#win0divDERIVED_CLSRCH_SSR_STATUS_LONG\\${3}`).children()[0]);

                let section = 0;

                while ($(idTitle).text() !== '') {
                    classes[$(idTitle).text()] = {};

                    for(let j = 0; j < ($(idTable).children()[0].children.length)/4; j++) {
                        let classNumber = $(`#MTG_CLASS_NBR\\$${section}`).text();
                        let className = $(`#MTG_CLASSNAME\\$${section}`).text();
                        let time = $(`#MTG_DAYTIME\\$${section}`).text();
                        let room = $(`#MTG_ROOM\\$${section}`).text();
                        let instructor = $(`#MTG_INSTR\\$${section}`).text();
                        let dates = $(`#MTG_TOPIC\\$${section}`).text();
                        // let status =
                        let description = $(`#DERIVED_CLSRCH_DESCRLONG\\$${section}`).text();

                        classes[$(idTitle).text()][classNumber] = {};
                        classes[$(idTitle).text()][classNumber]['Class'] = classNumber;
                        classes[$(idTitle).text()][classNumber]['Section'] = className;
                        classes[$(idTitle).text()][classNumber]['Days & Time'] = time;
                        classes[$(idTitle).text()][classNumber]['Room'] = room;
                        classes[$(idTitle).text()][classNumber]['Instructor'] = instructor;
                        classes[$(idTitle).text()][classNumber]['Dates'] = dates;
                        // classes[$(idTitle).text()][classNumber]['Status'] = status;
                        classes[$(idTitle).text()][classNumber]['Description'] = description;

                        section++;
                    }

                    i++;
                    idTitle = `#win0divSSR_CLSRSLT_WRK_GROUPBOX2GP\\$${i}`;
                    idTable = `#ACE_\\$ICField48\\$${i}`;
                }

                callback(classes);
            })
        })
    })
};

let subject = (inst, term, callback) => {
    request.get(options, function(error, response, body){
        if(error){
            console.log('CUNYfirst is currently offline.');
        }

        let ICValues = getICValues(body);

        let ICStateNum = ICValues['ICStateNum'];
        let ICSID = ICValues['ICSID'];

        let submit_options = {
            url: urlProducer(ICStateNum, ICSID, inst, term),
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'},
            jar: options.jar
        };

        request.get(submit_options, function(error, response, body){
            let id = `#SSR_CLSRCH_WRK_SUBJECT_SRCH\\$0`;
            getOptionsFromDropdown(body, id, callback);
        })
    })
};

let term = (inst, callback) => {
    request.get(options, function(error, response, body){
        if(error){
            console.log('CUNYfirst is currently offline.');
        }

        let ICValues = getICValues(body);

        let ICStateNum = ICValues['ICStateNum'];
        let ICSID = ICValues['ICSID'];

        let submit_options = {
            url: urlProducer(ICStateNum, ICSID, inst, ''),
            headers: {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36'},
            jar: options.jar
        };

        request.get(submit_options, function(error, response, body){
            let id = `#CLASS_SRCH_WRK2_STRM\\$35\\$`;
            getOptionsFromDropdown(body, id, callback);
        })
    })
};

let institutions = (callback) => {
    request.get(options, function(error, response, body){
        if(error){
            console.log('CUNYfirst is currently offline.');
        }

        let id = `#CLASS_SRCH_WRK2_INSTITUTION\\$31\\$`;
        getOptionsFromDropdown(body, id, callback);
    })
};

let start = new Date().getTime();

institutions(function(){
    term('QNS01', function(){
        subject('QNS01', '1182', function(){
            section('QNS01', '1182', 'CSCI', function(r){
                console.log(JSON.stringify(r, undefined, 2));
                let end = new Date().getTime();
                let time = end - start;
                console.log('Execution time: ' + time);
            });
        });
    });
});