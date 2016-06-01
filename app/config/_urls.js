'use strict';

// let HOST = 'http://360.master.stage.angejia.com/service/';
// let HOST = 'http://360.master.dev.angejia.com/service/';
//let HOST = 'https://api.fangyuan360.cn/service/';
let HOST = 'http://360.feature-bureau-20160531.dev.angejia.com/service/';

let urls = {
    detail: {
        baseInfo: HOST + 'property/detail',
        status: HOST + 'property/log',
        call: HOST + 'wash/call',
        feedback: HOST + 'wash/status',
        contactLog: HOST + 'property/contact/log'
    },
    user: {
        sendCode: HOST + 'passport/login/sms',
        login: HOST + 'passport/login',
        profile: HOST + 'user/profile',
        isFirst: HOST + 'point/notify',
    },
    house: {
        list: HOST + 'property-list',
        append: HOST + 'property-list',
        prepend: HOST + 'property-list',

        attention: HOST + 'attention/property-list',
        attentionAppend: HOST + 'attention/property-list',
        attentionPrepend: HOST + 'attention/property-list',

        similar: HOST + 'community/property-list',
        filters: HOST + 'house/filter',

        input: HOST + 'house/input',
        newCount: HOST + 'property/new/count',
        baseDuplicate: HOST + 'house/duplicate',
        allowToInput: HOST + 'house/can/input'
    },
    blocks: {
        attention: HOST + 'get-attention-block',
        saveAttention: HOST + 'set-attention-block'
    },
    attention: {
        blockAndCommunity: HOST + 'get-attention-community-block',
        saveAttentionCommunity: HOST + 'set-attention-community',
        enter: HOST + 'set-attention-enter'
    },
    community: {
        list: HOST + 'community/search/app'
    },
    settings: {
        contactHouse: HOST + 'my/house/contact',
        inputHouse: HOST + 'my/house/input'
    },
    app: {
        config: HOST + 'update/push',
        deletePush: HOST + 'delete/push',
        setConfig: HOST + 'configs'
    },
    pay: {
        order: HOST + 'recharge',
        result: HOST + 'recharge/notify'
    }
}

module.exports = urls;
