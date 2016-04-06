'use strict';

let HOST = 'http://localhost:8081/app/fakedata/';

let urls = {
    detail: {
        baseInfo: HOST + 'property-detail.json',
        status: HOST + 'house-status.json'
    },
    user: {
        sendCode: HOST + 'sendcode.json',
        login: HOST + 'login.json',
    },
    house: {
        list: HOST + 'house-list.json',
        append: HOST + 'house-append.json',
        prepend: HOST + 'house-prepend.json',

        attention: HOST + 'house-attention.json',
        attentionAppend: HOST + 'house-attention-append.json',
        attentionPrepend: HOST + 'house-attention-prepend.json',

        similar: HOST + 'house-similar.json',
        filters: HOST + 'filter.json'
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
