'use strict';

let HOST = 'http://360.feature-fy360.dev.angejia.com/service/';

let urls = {
    detail: {
        baseInfo: HOST + 'property/detail',
        status: HOST + 'property/log'
    },
    user: {
        sendCode: HOST + 'passport/login/sms',
        login: HOST + 'passport/login'
    },
    house: {
        list: HOST + 'property-list',
        append: HOST + 'property-list',
        prepend: HOST + 'property-list',

        attention: HOST + 'attention/property-list',
        attentionAppend: HOST + 'attention/property-list',
        attentionPrepend: HOST + 'attention/property-list',

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
