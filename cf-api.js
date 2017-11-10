require('dotenv').config();
const request = require('request');
const cheerio = require('cheerio');

let options = {
    url: process.env.CUNYfirst_url,
    headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'},
    jar: request.jar()
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
                        for(let j = 0; j < ($(idTable).children()[0].children.length)/4; j++) {
                            let classNumber = $(`#MTG_CLASS_NBR\\$${section}`).text();
                            let className = $(`#MTG_CLASSNAME\\$${section}`).text();
                            let time = $(`#MTG_DAYTIME\\$${section}`).text();
                            let room = $(`#MTG_ROOM\\$${section}`).text();
                            let instructor = $(`#MTG_INSTR\\$${section}`).text();
                            let dates = $(`#MTG_TOPIC\\$${section}`).text();
                            let status = $(`#win0divDERIVED_CLSRCH_SSR_STATUS_LONG\\$${section}`).children()[0].children[3].attribs.alt;
                            let description = $(`#DERIVED_CLSRCH_DESCRLONG\\$${section}`).text();
                            let topic = $(idTitle).text().substring(1, $(idTitle).text().indexOf('-'));

                            classes[classNumber] = {};
                            classes[classNumber]['Class'] = classNumber;
                            classes[classNumber]['Section'] = className;
                            classes[classNumber]['Days & Time'] = time;
                            classes[classNumber]['Room'] = room;
                            classes[classNumber]['Instructor'] = instructor;
                            classes[classNumber]['Dates'] = dates;
                            classes[classNumber]['Status'] = status;
                            classes[classNumber]['Description'] = description;
                            classes[classNumber]['Topic'] = topic;

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

module.exports = {
    getAllSections
};