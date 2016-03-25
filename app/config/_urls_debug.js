'use strict';

let HOST = 'http://192.168.164.116:8081/app/fakedata/';

let urls = {
    test: {
        list: HOST +  'property-list.json'
    },
    detail: {
        baseInfo: HOST + 'property-detail.json'
    },
    user: {
        sendCode: HOST + 'sendcode.json',
        login: HOST + 'login.json'
    }
}

module.exports = urls;