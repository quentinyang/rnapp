'use strict';

let HOST = 'http://192.168.163.101:8081/app/fakedata/';
let HOST1 = 'http://360.feature-fy360.dev.angejia.com/service/';

let urls = {
    test: {
        list: HOST +  'property-list.json'
    },
    detail: {
        baseInfo: HOST + 'property-detail.json'
    },
    user: {
        // sendCode: HOST1 + 'sendcode.json',
        // login: HOST1 + 'login.json',
        sendCode: HOST1 + 'passport/login/sms',
        login: HOST1 + 'passport/login'
    },
    house: {
        list: HOST + 'house-list.json',
        append: HOST + 'house-append.json',
        prepend: HOST + 'house-prepend.json',
        attention: HOST + 'house-attention.json',
        attentionAppend: HOST + 'house-attention-append.json',
        attentionPrepend: HOST + 'house-attention-prepend.json',
        similar: HOST + 'house-similar.json'
    },
    blocks: {
        attention: HOST1 + 'get-attention-block',
        saveAttention: HOST1 + 'set-attention-block'
    },
    attention: {
        blockAndCommunity: HOST1 + 'get-attention-community-block',
        saveAttentionCommunity: HOST1 + 'set-attention-community'
    }
}

module.exports = urls;