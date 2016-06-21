/*
    *   本js文件中不应该包含引用该js文件的Container，
    * example: pages/Login.js 中引用了本文件，因此本文件中不应该包含LoginContainer，否做会报错
*/
import HouseListContainer from '../containers/HouseListContainer';
import TabViewContainer from '../containers/TabViewContainer';
import PublishFirstStepContainer from '../containers/PublishFirstStepContainer'
import DetailContainer from '../containers/DetailContainer'

export var routes = {
    "home": {
        component: TabViewContainer,
        name: 'home',
        title: '首页',
        hideNavBar: true,
        index: 0
    },
    "houseList": {
        component: HouseListContainer,
        name: 'houseList',
        title: '房源列表',
        hideNavBar: true
    },
    "publishHouse": {
        component: TabViewContainer,
        name: 'publishHouse',
        title: '发房',
        hideNavBar: true,
        index: 1
    },
    "detail": {
        component: DetailContainer,
        name: 'detail',
        title: '房源详情',
        hideNavBar: false
    } 
}