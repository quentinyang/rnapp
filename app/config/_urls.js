'use strict';

let HOST = 'http://360.feature-fy360.dev.angejia.com/service/';

let urls = {
    test: {
        list: HOST + 'showapi_open_bus/weixin/weixin_article_list'
    },
    house: {
        list: HOST + 'house/list'
    },
    user: {
        sendCode: HOST + 'passport/login/sms',
        login: HOST + 'passport/login'
    },

};

module.exports = urls;
