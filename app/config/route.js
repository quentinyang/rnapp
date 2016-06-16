import HouseListContainer from '../containers/HouseListContainer';
import TabViewContainer from '../containers/TabViewContainer';

export var routes = {
    "Home": {
        component: TabViewContainer,
        name: 'home',
        title: '首页',
        hideNavBar: true,
        index: 0
    },
    "HouseList": {
        component: HouseListContainer,
        name: 'houseList',
        title: '房源列表',
        hideNavBar: true
    },
    "InputHouse": {
        component: TabViewContainer,
        name: 'inputHouse',
        title: '房源基本信息',
        hideNavBar: false,
        index: 1
    }
}