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

    function login(data) {
        var params = {
            type: 'POST',
            url: urls.user.login
        };
        ajax($.extend(params, data, true));
    }

    return {
        sendCode: sendCode,
        login: login
    };
}();