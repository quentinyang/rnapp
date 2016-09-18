import {getToken} from '../service/tokenService';

let QINIU_URL = 'http://upload.qiniu.com';
/*
* @params data 图片路径或图片base64编码
* @params suc_cb 成功时的回调
* @params err_cb 错误时的回调
*/
export function qiniuUpload(data, suc_cb, err_cb) {
    return getToken()
    .then((d) => d.items[0])
    .then(token => uploadImage(data, token))
    .then(response => response.json())
    // .then(data => suc_cb(data))
    // .catch(err => err_cb(err));
}

function uploadImage(data, token) {
    let formData = new FormData();
    formData.append('token', token);
    formData.append('file', {uri: data, type: 'application/octet-stream'});

    let myInit = {
        body: formData,
        method: 'POST'
    }

    return fetch(QINIU_URL, myInit);
}