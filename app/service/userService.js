import * as ajax from '../utils/Ajax';
let urls = require('../config/urls');

module.exports=function(){

    function sendCodeService(data) {
        return ajax.post(urls.user.sendCode, data);
    }

    function loginService(data) {
        return ajax.post(urls.user.login, {
            body: data
        });
    }

    function getUserProfile(data) {
        return ajax.get(urls.user.profile, data);
    }


    function fetchScoreModalStatusService() {
        return ajax.get(urls.user.isFirst)
    }

    return {
        sendCodeService: sendCodeService,
        loginService: loginService,
        profileService: getUserProfile,
        fetchScoreModalStatusService: fetchScoreModalStatusService,
    };
}();