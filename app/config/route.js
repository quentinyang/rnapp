import LoginContainer from '../containers/LoginContainer';
import HouseListContainer from '../containers/HouseListContainer';
import TabViewContainer from '../containers/TabViewContainer';
import PublishFirstStepContainer from '../containers/PublishFirstStepContainer';
import DetailContainer from '../containers/DetailContainer';
import TouchWebContainer from "../containers/TouchWebContainer";
import ScoreListContainer from "../containers/ScoreListContainer";
import * as actionType from '../constants/ActionLog';

global.routes = {
    "login": {
        component: LoginContainer,
        name: 'login',
        title: '登录',
        hideNavBar: true
    },
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
    },
    "webView": {
        url:'',
        title: '',
        name: 'webView',
        component: TouchWebContainer,
        hideNavBar: false,
    },
    "userCenter": {
        component: TabViewContainer,
        name: 'userCenter',
        title: '我的',
        hideNavBar: true,
        index: 2
    },
    "scoreList": {
        component: ScoreListContainer,
        name: 'scoreList',
        title: '积分明细',
        backLog: actionType.BA_MINE_POINTS_RETURN,
        //accountData: withdrawData
    }
}