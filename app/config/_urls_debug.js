'use strict';

let HOST = 'http://192.168.164.112:8081/app/fakedata/';

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
        append: HOST + 'house-append.json',
        prepend: HOST + 'house-prepend.json',
        attention: HOST + 'house-attention.json',
        attentionAppend: HOST + 'house-attention-append.json',
        attentionPrepend: HOST + 'house-attention-prepend.json'
    }
}

module.exports = urls;