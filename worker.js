require('dotenv').config();
const request = require('request');
const cheerio = require('cheerio');

let options = {
    url: process.env.CUNYfirst_url,
    headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'},
    jar: request.jar()
};

let getOptionsFromDropdown = (body, id) => {
    let $ = cheerio.load(body);
    let options = $(id).children();
    let values = {};

    for(let i = 1; i < options.length; i++){
        values[options[i].children[0].data] = options[i].attribs.value;
    }

    return values;
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

let urlProducer = (ICStateNum, ICSID, inst, term) => {
    return 'https://hrsa.cunyfirst.cuny.edu/psc/cnyhcprd/GUEST/HRMS/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL?ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum='
        +ICStateNum+
        '&ICAction=CLASS_SRCH_WRK2_STRM$35$&ICXPos=0&ICYPos=0&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus&ICSaveWarningFilter=0&ICChanged=-1&ICAutoSave=0&ICResubmit=0&ICSID='
        +ICSID+
        '=&ICActionPrompt=false&ICBcDomData=undefined&ICFind&ICAddCount&ICAPPCLSDATA&CLASS_SRCH_WRK2_INSTITUTION$31$='
        +inst+
        '&CLASS_SRCH_WRK2_STRM$35$='
        +term
};

let urlProducerAllClasses = (ICStateNum, ICSID, term, subject) => {
    return 'https://hrsa.cunyfirst.cuny.edu/psc/cnyhcprd/GUEST/HRMS/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL?ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum='
        +ICStateNum+
        '&ICAction=CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH&ICXPos=0&ICYPos=0&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus&ICSaveWarningFilter=0&ICChanged=-1&ICAutoSave=0&ICResubmit=0&ICSID='
        +ICSID+
        '=&ICActionPrompt=false&ICBcDomData=undefined&ICFind&ICAddCount&ICAPPCLSDATA&CLASS_SRCH_WRK2_STRM$35$='
        +term+
        '&SSR_CLSRCH_WRK_SUBJECT_SRCH$0='
        +subject+
        '&SSR_CLSRCH_WRK_SSR_EXACT_MATCH1$1=G&SSR_CLSRCH_WRK_CATALOG_NBR$1=0&SSR_CLSRCH_WRK_SSR_OPEN_ONLY$chk$5=N'
};

let urlProducerSpecificCourse = (ICStateNum, ICSID, term, subject, course) => {
    return 'https://hrsa.cunyfirst.cuny.edu/psc/cnyhcprd/GUEST/HRMS/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL?ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum='
        +ICStateNum+
        '&ICAction=CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH&ICXPos=0&ICYPos=98&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus=&ICSaveWarningFilter=0&ICChanged=-1&ICAutoSave=0&ICResubmit=0&ICSID='
        +ICSID+
        '=&ICActionPrompt=false&ICBcDomData=undefined&ICFind=&ICAddCount=&ICAPPCLSDATA=&CLASS_SRCH_WRK2_STRM$35$='
        +term+
        '&SSR_CLSRCH_WRK_SUBJECT_SRCH$0='
        +subject+
        '&SSR_CLSRCH_WRK_CATALOG_NBR$1='
        +course+
        '&SSR_CLSRCH_WRK_SSR_OPEN_ONLY$chk$5=N';
};

let urlProducerClassNumber = (ICStateNum, ICSID, term, classNum) => {
    return 'https://hrsa.cunyfirst.cuny.edu/psc/cnyhcprd/GUEST/HRMS/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL?ICAJAX=1&ICNAVTYPEDROPDOWN=0&ICType=Panel&ICElementNum=0&ICStateNum='
        +ICStateNum+
        '&ICAction=CLASS_SRCH_WRK2_SSR_PB_CLASS_SRCH&ICXPos=0&ICYPos=142&ResponsetoDiffFrame=-1&TargetFrameName=None&FacetPath=None&ICFocus=&ICSaveWarningFilter=0&ICChanged=-1&ICAutoSave=0&ICResubmit=0&ICSID='
        +ICSID+
        '=&ICActionPrompt=false&ICBcDomData=undefined&ICFind=&ICAddCount=&ICAPPCLSDATA=&CLASS_SRCH_WRK2_STRM$35$='
        +term+
        '&SSR_CLSRCH_WRK_CLASS_NBR$10='
        +classNum
};

let getAllSections = (inst, term, subject) => {
    return new Promise((resolve, reject) => {
        request.get(options, function(error, response, body){
            if(error){
                reject('CUNYfirst is currently offline.');
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
                submit_options['url'] = urlProducerAllClasses(++ICStateNum, ICSID, term, subject);
                request.get(submit_options, function(error, response, body) {
                    if(error){
                        reject('CUNYfirst is currently offline.');
                    }

                    let classes = {};
                    let $ = cheerio.load(body);

                    let i = 0;
                    let idTitle = `#win0divSSR_CLSRSLT_WRK_GROUPBOX2GP\\$${i}`;
                    let idTable = `#ACE_\\$ICField48\\$${i}`;

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
                            let status = $(`#win0divDERIVED_CLSRCH_SSR_STATUS_LONG\\$${section}`).children()[0].children[3].attribs.alt;
                            let description = $(`#DERIVED_CLSRCH_DESCRLONG\\$${section}`).text();

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
                        idTitle = `#win0divSSR_CLSRSLT_WRK_GROUPBOX2GP\\$${i}`;
                        idTable = `#ACE_\\$ICField48\\$${i}`;
                    }

                    resolve(classes);
                })
            })
        })
    })
};

let getSpecificCourse = (inst, term, subject, course) => {
    return new Promise((resolve, reject) => {
        request.get(options, function(error, response, body){
            if(error){
                reject('CUNYfirst is currently offline.');
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
                submit_options['url'] = urlProducerSpecificCourse(++ICStateNum, ICSID, term, subject, course);
                request.get(submit_options, function(error, response, body) {
                    if(error){
                        reject('CUNYfirst is currently offline.');
                    }

                    let classes = {};
                    let $ = cheerio.load(body);

                    let i = 0;
                    let idTitle = `#win0divSSR_CLSRSLT_WRK_GROUPBOX2GP\\$${i}`;
                    let idTable = `#ACE_\\$ICField48\\$${i}`;

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
                            let status = $(`#win0divDERIVED_CLSRCH_SSR_STATUS_LONG\\$${section}`).children()[0].children[3].attribs.alt;
                            let description = $(`#DERIVED_CLSRCH_DESCRLONG\\$${section}`).text();

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
                        idTitle = `#win0divSSR_CLSRSLT_WRK_GROUPBOX2GP\\$${i}`;
                        idTable = `#ACE_\\$ICField48\\$${i}`;
                    }

                    resolve(classes);
                })
            })
        })
    })
};

let getClassByClassNumber = (inst, term, classNum) => {
    return new Promise((resolve, reject) => {
        request.get(options, function(error, response, body){
            if(error){
                reject('CUNYfirst is currently offline.');
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
                submit_options['url'] = urlProducerClassNumber(++ICStateNum, ICSID, term, classNum);
                request.get(submit_options, function(error, response, body) {
                    if(error){
                        reject('CUNYfirst is currently offline.');
                    }

                    let classes = {};
                    let $ = cheerio.load(body);

                    let i = 0;
                    let idTitle = `#win0divSSR_CLSRSLT_WRK_GROUPBOX2GP\\$${i}`;
                    let idTable = `#ACE_\\$ICField48\\$${i}`;

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
                            let status = $(`#win0divDERIVED_CLSRCH_SSR_STATUS_LONG\\$${section}`).children()[0].children[3].attribs.alt;
                            let description = $(`#DERIVED_CLSRCH_DESCRLONG\\$${section}`).text();

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
                        idTitle = `#win0divSSR_CLSRSLT_WRK_GROUPBOX2GP\\$${i}`;
                        idTable = `#ACE_\\$ICField48\\$${i}`;
                    }

                    resolve(classes);
                })
            })
        })
    })
};

let subject = (inst, term) => {
    return new Promise((resolve, reject) => {
        request.get(options, function(error, response, body){
            if(error){
                reject('CUNYfirst is currently offline.');
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
                resolve(getOptionsFromDropdown(body, id));
            })
        })
    })
};

let term = (inst) => {
    return new Promise((resolve, reject) => {
        request.get(options, function(error, response, body){
            if(error){
                reject('CUNYfirst is currently offline.');
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
                resolve(getOptionsFromDropdown(body, id));
            })
        })
    })

};

let institutions = () => {
    return new Promise((resolve, reject) => {
        request.get(options, function(error, response, body){
            if(error){
                reject('CUNYfirst is currently offline.');
            }

            let id = `#CLASS_SRCH_WRK2_INSTITUTION\\$31\\$`;
            resolve(getOptionsFromDropdown(body, id));
        })
    })
};

let getClasses = async () => {
    let instObj = await institutions();
    let inst = instObj['Queens College'];

    let termObj = await term(inst);
    let term1 = termObj['2018 Spring Term'];

    let subjObj = await subject(inst, term1);
    let subj = subjObj['PHYS - Physics'];

    return await getAllSections(inst, term1, subj);
};

let start = new Date().getTime();

// getClasses().then((classes) => {
//     console.log(JSON.stringify(classes, undefined, 2));
//     let end = new Date().getTime();
//     let time = end - start;
//     console.log('Execution time: ' + time);
// }).catch((error) => {
//     console.log(error);
// });

getAllSections('QNS01', '1182', 'CSCI').then((classes) => {
    console.log(JSON.stringify(classes, undefined, 2));
    let end = new Date().getTime();
    let time = end - start;
    console.log('Execution time: ' + time);
}).catch((error) => {
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