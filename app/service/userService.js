import * as ajax from '../utils/Ajax';
let urls = require('../config/urls');

module.exports=function(){

    function sendCode(data) {
        var params = {
            type: 'POST',
            url: urls.user.sendcode
        };
        ajax($.extend(params, data, true));
    }

    function loginService(data) {
        return ajax.post(urls.user.login, data);
    }

    return {
        sendCode: sendCode,
        loginService: loginService
    };
}();