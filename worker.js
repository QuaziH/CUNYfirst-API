const request = require('request');
const HTML = require('html-parse-stringify');

let options = {
    url: '',
    headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'},
    jar: request.jar()
};

let getOptionsFromDropdown = (body, id, callback) => {
    let startingIndex = body.indexOf(id);
    let selectHtml = body.substring(startingIndex, body.indexOf("</select>"));
    let ast = HTML.parse(selectHtml);

    let values = {};
    for(let i = 2; i < ast[0].children.length; i++){
        if(ast[0].children[i].type === 'text')
            continue;
        values[ast[0].children[i].children[0].content] = ast[0].children[i].attrs.value;
    }
    callback(values);
};

let institutions = (callback) => {
    request.get(options, function(error, response, body){
        if(error){
            console.log('CUNYfirst is currently offline.');
        }
        let id = '<select name=\'CLASS_SRCH_WRK2_INSTITUTION$31$\'';
        getOptionsFromDropdown(body, id, callback);
    })
};

institutions(function(r){
    console.log(r);
});