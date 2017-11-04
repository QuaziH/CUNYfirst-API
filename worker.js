const request = require('request');

let options = {
    url: '',
    headers: {'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'},
    jar: request.jar()
};

let institutions = (callback) => {
    request.get(options, function(error, response, body){
        if(error){
            console.log('CUNYfirst is currently offline.');
        }
    })
};
