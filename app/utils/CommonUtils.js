'use strict';
import {Linking, Alert} from 'nuke'

export function NaviGoBack(navigator) {
    if (navigator && navigator.getCurrentRoutes().length > 1) {
        navigator.pop();
        return true;
  }
  return false;
}

export function isEmptyObject(obj) {
    for (var name in obj) {
        return false;
    }
    return true;
}

export function formatDate(date) {
    var date = new Date(date);
    var year = date.getFullYear();
    var month = parseInt(date.getMonth()) + 1;
    var day = date.getDate();

    return {
        year, month, day
    }
}

export function callUp(phone) {
    let url = "tel:" + phone;

    Linking.canOpenURL(url).then(supported => {
        if (!supported) {
            Alert.alert('温馨提示', '您的设备不支持打电话功能', [{text: '确定'}]);
        } else {
            return Linking.openURL(url);
        }
    }).catch(err => console.error('An error occurred', err));
}

export function parseUrlParam(paramStr) {
    let paramObj = {};
    let paramArr = paramStr.split("&");
    paramArr.map((item, i) => {
        let temp = item.split("=");
        paramObj[temp[0]] = temp[1];
    });
    return paramObj;
}

export function replaceJSONContent(obj, findStr, replaceStr) {
    let objStr = JSON.stringify(obj);
    let reg = new RegExp(findStr, "g");

    let resultStr = objStr.replace(reg, replaceStr);
    return JSON.parse(resultStr);
}