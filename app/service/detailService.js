import * as ajax from '../utils/Ajax'
import * as urls from '../config/urls'

export function getBaseInfo() {
    return ajax.get(urls.detail.baseInfo, {
        id: 1
    });
}
