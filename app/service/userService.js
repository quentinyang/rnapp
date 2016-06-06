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

    function getUserAlipayStatus() {
        return ajax.get(urls.user.alipayStatus);
    }

    function fetchScoreModalStatusService() {
        return ajax.get(urls.user.isFirst)
    }

    function withdrawService(data) {
        return ajax.post(urls.user.withdraw, data);
    }

    function alipayLoginService() {
        return ajax.get(urls.user.alipayLogin);
    }

    function scoreListService(params) {
        return ajax.get(urls.user.scoreList, {
            data: params
        });
    }

    return {
        sendCodeService: sendCodeService,
        loginService: loginService,
        profileService: getUserProfile,
        getUserAlipayStatus: getUserAlipayStatus,
        fetchScoreModalStatusService: fetchScoreModalStatusService,
        withdrawService: withdrawService,
        alipayLoginService: alipayLoginService,
        scoreListService: scoreListService
    };
}();