const request = require('request');
const HTML = require('html-parse-stringify');
const cheerio = require('cheerio');

let options = {
    url: 'https://hrsa.cunyfirst.cuny.edu/psc/cnyhcprd/GUEST/HRMS/c/COMMUNITY_ACCESS.CLASS_SEARCH.GBL',
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

let term = (inst, callback) => {
    request.get(options, function(error, response, body){
        if(error){
            console.log('CUNYfirst is currently offline.');
        }

        let id ='#win0divPSHIDDENFIELDS';
        getICValues(body, id, callback);

        let key = body.split("id=\'ICSID\' value=\'")[1].substring(0, 44);
        let ICStateNum = body.split("id=\'ICStateNum\' value=\'")[1].split("\'")[0];
        let submit_options = {
            url: urlProducer(ICStateNum, key, inst, ''),
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

term('QNS01', function(r){
    console.log(r);
});

// institutions(function(_){
//     term('QNS01', function(_){
//         console.log(_);
//     });
// });