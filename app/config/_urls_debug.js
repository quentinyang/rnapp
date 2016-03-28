'use strict';

let HOST = 'http://192.168.163.110:8081/app/fakedata/';

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
    },
    house: {
        list: HOST + 'house-list.json',
        append: HOST + 'house-append.json'
    }
}

module.exports = urls;