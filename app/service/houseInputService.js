import * as ajax from '../utils/Ajax';
let urls = require('../config/urls');

module.exports=function(){

    function inputHouseService(data) {
        return ajax.post(urls.house.input, data);
    }

    return {
        inputHouseService: inputHouseService
    };
}();