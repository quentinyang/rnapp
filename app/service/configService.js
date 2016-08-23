import * as ajax from '../utils/Ajax';
let urls = require('../config/urls');

export function setWebStartConfigService(params) {
    return ajax.post(urls().app.config, {
        body: {
            cid: params.cId
        }
    });
};

export function deletePushService() {
    return ajax.put(urls().app.deletePush);
}

export function setConfigService() {
    return ajax.get(urls().app.setConfig);
}

export function setUserConfigService() {
    return ajax.get(urls().app.setUserConfig);
}

export function setLoginDaysService() {
    return ajax.put(urls().app.setLoginDay);
}

export function fetchRuleStatusService() {
    return ajax.get(urls().app.inputRule)
}