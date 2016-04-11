'use strict';

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