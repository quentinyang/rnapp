import HouseListContainer from '../containers/HouseListContainer';
import TabViewContainer from '../containers/TabViewContainer';
import PublishFirstStepContainer from '../containers/PublishFirstStepContainer'

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
    }
}