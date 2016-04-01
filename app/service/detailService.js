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
