'use strict';
let HOST = 'http://192.168.163.67:8081/app/fakedata/';
//let HOST = 'http://192.168.162.61:8081/app/fakedata/';

let urls = {
    test: {
        list: HOST +  'property-list.json'
    },
    detail: {
        baseInfo: HOST + 'property-detail.json'
    }
}

module.exports = urls;