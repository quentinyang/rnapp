import * as ajax from '../utils/Ajax';
let urls = require('../config/urls');

module.exports=function(){

    function sendCodeService(data) {
        return ajax.post(urls().user.sendCode, data);
    }

    function loginService(data) {
        return ajax.post(urls().user.login, {
            body: data
        });
    }

    function getUserProfile(data) {
        return ajax.get(urls().user.profile, data);
    }

    function getUserAlipayStatus() {
        return ajax.get(urls().user.alipayStatus);
    }

    function withdrawService(data) {
        return ajax.post(urls().user.withdraw, data);
    }

    function alipayLoginService() {
        return ajax.get(urls().user.alipayLogin);
    }

    function scoreListService(params) {
        return ajax.get(urls().user.scoreList, {
            data: params
        });
    }

    function getSignInInfo() {
        return ajax.get(urls().user.signIn)
    }

    function signInStatusService() {
        return ajax.get(urls().user.signInStatus);
    }

    function expRuleService() {
        return ajax.get(urls().user.expRule);
    }

    function userInputListService(params) {
        return ajax.get(urls().user.inputList, {
            data: params
        });
    }

    function getAuthenticationService() {
        return ajax.get(urls().user.getAut);
    }

    function sendAuthenticationService(params) {
        return ajax.post(urls().user.postAut, {
            body: params
        });
    }



    return {
        sendCodeService: sendCodeService,
        loginService: loginService,
        profileService: getUserProfile,
        getUserAlipayStatus: getUserAlipayStatus,
        withdrawService: withdrawService,
        alipayLoginService: alipayLoginService,
        scoreListService: scoreListService,
        getSignInInfo: getSignInInfo,
        signInStatusService: signInStatusService,
        expRuleService: expRuleService,
        userInputListService: userInputListService,
        sendAuthenticationService: sendAuthenticationService
    };
}();