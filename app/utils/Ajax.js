'use strict';

import deviceInfo from './DeviceInfo';

function status(response, resolve, reject) {

    if((response.status >= 200 && response.status < 300) || response.status == 304) {
        resolve(response.json());
        console.log('[AjaxSuccess]', response.status, response.url);
    } else {
        console.log('[AjaxError]', response.status, response.url);
        response.json().then((oData) => {
            oData.codeStatus = response.status;
            return oData;
        }).then(reject);
    }
}

var mobileAgent = (function() {
        var infos = {
            app: 'FangYuan360',//app APP 名称
            av: deviceInfo.version,//APP 版本号
            ccid: '1',//用户选择的城市 id
            gcid: '1',//定位到的城市 id
            ch: '',//发布的渠道 id
            lng: '',//经度
            lat: '',//纬度
            ip: '',
            net: '',//网络类型
            p: (deviceInfo.manufacturer == 'Apple') ? 'IOS' : 'Android',//Android or IOS
            pm: deviceInfo.manufacturer,//设备厂家或类型（三星，iPod, Touch)
            osv: deviceInfo.systemVersion,//操作系统版本
            // dvid 设备ID(DeviceID)，安卓:用IMEI+Mac地址表示，e.g.:447769804451095+c5ab204dc58739c482f413d2a22de442；
            // IOS:用udid表示，举例:8A9B2903-B0D8-4137-A8BC-5C7F32CE9F04
            dvinfo: deviceInfo.deviceInfo,
            dvid: deviceInfo.deviceId,
            // idfa optional, iOS 广告标志符，android 无此字段
            idfa: ''
        };

        var agent = [];
        for (let index in infos) {
            agent.push(index + '=' + infos[index]);
        }
        return agent.join(';');

})();

function _getHeader() {
    // Refer to: https://git.corp.angejia.com/service/design/wikis/Mobile-API/Spec
    var header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'token': global.gtoken || '',
            'Angejia-Signature': '',// 签名信息
            'Angejia-Auth': global.gtoken,// 用户认证信息
            'Angejia-MobileAgent': mobileAgent,// 移动设备信息
            'Angejia-CamelCase': '1',// JSON 数据使用驼峰形式的键
            'Angejia-Stringify': '1',// JSON 数据使用字符串形式的值
            'Angejia-Env': '',// 移动应用访问的 Mobile API 环境
            'Angejia-Payload': '',// 返回内容结构（兼容设置）
            'cid': global.gcid, // getui client id
    }
    console.log('Http Header', header);
    return header;
}

function _createURL(url, params) {
    let newUrl = [];

    for (var key in params) {
       newUrl.push(key + '=' + params[key])
    }

    let newUrlStr = newUrl.join('&');
    return newUrlStr ? url + '?' + newUrlStr : url;
}

function get(url, params = {}) {
    let {data, ...paramsOther} = params;
    console.log('Request Parameters', params);

    return new Promise((resolve, reject) => {
        fetch(_createURL(url, data || {}), {
            method: 'GET',
            headers: _getHeader(),
            ...paramsOther
        })
        .then((response) => {
            status(response, resolve, reject);
        })
        .catch((error) => {
            reject(error)
        })
    })
}

function post(url, params = {}) {
    let {body, ...paramsOther} = params;
    console.log('Request Parameters', params);

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: _getHeader(),
            body: JSON.stringify(body),
            ...paramsOther
        })
        .then((response) => {
            status(response, resolve, reject);
        })
        .catch((error) => {
            reject(error)
        })
    })
}

function remove(url, params) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'DELETE',
            ...params
        })
        .then((response) => {
            resolve(response.json());
        })
        .catch((error) => {
            reject(error)
        })
    })
}

function put(url, params) {
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'PUT',
            headers: _getHeader(),
            ...params
        })
        .then((response) => {
            status(response, resolve, reject);
        })
        .catch((error) => {
            reject(error)
        })
    })
}

let ajax = {
    get,
    post,
    put,
    remove
}

module.exports = ajax;
