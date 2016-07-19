'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/houseList';
import * as actionsHome from '../actions/home';
import * as actionsDetail from '../actions/detail';
import * as actionsApp from '../actions/app';
import HouseList from '../pages/HouseList';
import * as actionsNavigation from '../actions/navigation';

class HouseListContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HouseList {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    const {houseData, filterData, uiData, queryParamsData, communityData} = state.houseList;
    let {appData} = state.app;
    let listSearchHistory = appData.get('listSearchHistory'),
        netWork = appData.get('net');

    return {
        houseData, filterData, uiData, queryParamsData, communityData, listSearchHistory, netWork
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        actionsHome: bindActionCreators(actionsHome, dispatch),
        actionsDetail: bindActionCreators(actionsDetail, dispatch),
        actionsNavigation: bindActionCreators(actionsNavigation, dispatch),
        actionsApp: bindActionCreators(actionsApp, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HouseListContainer);