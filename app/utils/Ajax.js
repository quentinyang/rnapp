'use strict';

function status(response, resolve, reject) {
    if((response.status >= 200 && response.status < 300) || response.status == 304) {
        resolve(response.json());
    } else {
        if (response.status == 400) {
            // TODO::go to login
        }
        response.json().then(reject);
    }
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

    return new Promise((resolve, reject) => {
        fetch(_createURL(url, data || {}), {
            method: 'GET',
            headers: {
                token: gtoken
            },
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

    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'token': gtoken
            },
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

let ajax = {
    get,
    post,
    put,
    remove
}

module.exports = ajax;
