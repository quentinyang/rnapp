'use strict';

let RCTDeviceEventEmitter = require('RCTDeviceEventEmitter');
import AsyncStorageComponent from '../utils/AsyncStorageComponent';
import { NativeModules } from 'nuke'
import { replaceJSONContent } from '../utils/CommonUtils'
import * as common from '../constants/Common'

global.gDebug = NativeModules.Utils.isDebug;
let HOST = global.ghost = NativeModules.Utils.host;

let urls = {
    detail: {
        baseInfo: HOST + 'property/detail',
        call: HOST + 'wash/call',
        feedback: HOST + 'property/feedback',
        refund: HOST + 'appeal/refund',
        contactLog: HOST + 'property/contact/log',
        userInfo: HOST + 'property/input-user/info',
        sellerPhone: HOST + 'wash/seller-phone',
        getRecord: HOST + 'property/record',
    },
    user: {
        sendCode: HOST + 'passport/login/sms',
        login: HOST + 'passport/login',
        profile: HOST + 'user/profile',
        isFirst: HOST + 'point/notify',
        alipayStatus: HOST + 'user/binding/alipay/status',
        withdraw: HOST + 'withdrawals',
        scoreList: HOST + 'my/account/flow',
        alipayLogin: HOST + 'alipay/quick/login/url',

        signIn: HOST + 'user/sign-in',
        signInStatus: HOST + 'user/sign-in/status',

        expRule: HOST + 'user/level/rule',

        inputList: HOST + 'user/house/checked/success/list'
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
        enter: HOST + 'set-attention-enter',
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
        setConfig: HOST + 'configs',
        setUserConfig: HOST + 'configs',
        setLoginDay: HOST + 'user/login/days',
        inputRule: HOST + 'property/rule'
    },
    pay: {
        order: HOST + 'recharge',
        result: HOST + 'recharge/notify',
        realName: HOST + 'user/info/edit',
        aliStatus: HOST + 'recharge/binding/alipay/status'
    },
    card: {
        welfare: HOST + 'my-welfare-cards',
        getNewWelfare: HOST + 'my-welfare-card/latest'
    }
}

gDebug && AsyncStorageComponent.get(common.API_HOST)
    .then((value) => {
        if (value) {
            if (value !== global.ghost) {
                urls = replaceJSONContent(urls, ghost, value);
                ghost = value;
            }
        }
    })
    .catch((error) => {
        console.log(error);
    });

RCTDeviceEventEmitter.addListener(common.HOST_CHANGE, (newHost) => {
    urls = replaceJSONContent(urls, ghost, newHost);
    ghost = newHost;
});

module.exports = () => {
    return urls
};
