import * as ajax from '../utils/Ajax'
import * as urls from '../config/urls'

export function getBaseInfoService(params) {
    return ajax.get(urls.detail.baseInfo, {
        data: params
    });
}

export function getStatusService(params) {
    return ajax.get(urls.detail.status, {
        data: params
    });
}

export function callSellerPhone(params) {
    return ajax.post(urls.detail.call, {
        body: {
            property_id: params
        }
    });
}

export function postFeedback(params) {
    return ajax.post(urls.detail.feedback, {
        body: params
    });
}

export function getContactLogService(params) {
    return ajax.get(urls.detail.contactLog, {
        data: params
    });
}
