import * as ajax from '../utils/Ajax'
let urls = require('../config/urls');

export function getBaseInfoService(params) {
    return ajax.get(urls().detail.baseInfo, {
        data: params
    });
}

export function callSellerPhone(params) {
    return ajax.post(urls().detail.call, {
        body: params
    });
}

export function postFeedback(params) {  //单页去反馈
    return ajax.post(urls().detail.feedback, {
        body: params
    });
}
export function postRefund(params) {  //联系的房源申请退积分
    return ajax.post(urls().detail.refund, {
        body: params
    });
}

export function getContactLogService(params) {
    return ajax.get(urls().detail.contactLog, {
        data: params
    });
}

export function getUserInfoService(params) {
    return ajax.get(urls().detail.userInfo, {
        data: params
    });
}

export function getSellerPhoneService(params) {
    return ajax.post(urls().detail.sellerPhone, {
        body: params
    });
}