'use strict';

let HOST = 'http://360.feature-fy360.dev.angejia.com/service/';

let urls = {
    detail: {
        baseInfo: HOST + 'property/detail',
        status: HOST + 'property/log'
    },
    user: {
        // sendCode: HOST + 'sendcode.json',
        // login: HOST + 'login.json',
        sendCode: HOST + 'passport/login/sms',
        login: HOST + 'passport/login'
    },
    house: {
        // list: HOST + 'house-list.json',
        // append: HOST + 'house-append.json',
        // prepend: HOST + 'house-prepend.json',

        // attention: HOST + 'house-attention.json',
        // attentionAppend: HOST + 'house-attention-append.json',
        // attentionPrepend: HOST + 'house-attention-prepend.json',

        list: HOST + 'property-list',
        append: HOST + 'property-list',
        prepend: HOST + 'property-list',

        attention: HOST + 'attention/property-list',
        attentionAppend: HOST + 'attention/property-list',
        attentionPrepend: HOST + 'attention/property-list',

        //similar: HOST + 'house-similar.json'
        similar: HOST + 'community/property-list'
    },
    blocks: {
        attention: HOST + 'get-attention-block',
        saveAttention: HOST + 'set-attention-block'
    },
    attention: {
        blockAndCommunity: HOST + 'get-attention-community-block',
        saveAttentionCommunity: HOST + 'set-attention-community'
    }
}

module.exports = urls;
