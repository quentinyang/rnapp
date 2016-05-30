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

    function getUserAlipayAccount() {
        return ajax.get(urls.user.alipay);
    }

    function fetchScoreModalStatusService() {
        return ajax.get(urls.user.isFirst)
    }

    function withdrawService(data) {
        return ajax.post(urls.user.withdraw, data);
    }

    return {
        sendCodeService: sendCodeService,
        loginService: loginService,
        profileService: getUserProfile,
        getUserAlipayAccount: getUserAlipayAccount,
        fetchScoreModalStatusService: fetchScoreModalStatusService,
        withdrawService: withdrawService
    };
}();