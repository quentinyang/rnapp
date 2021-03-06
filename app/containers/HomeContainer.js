'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/home';
import * as actionsHouseList from '../actions/houseList';
import * as actionsDetail from '../actions/detail';
import Home from '../pages/Home';

class HomeContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Home {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    const {houseData, attentionList, baseInfo} = state.home;
    const {appData, appUserConfig} = state.app;
    let netWork = state.app.appData.get('net');
    return {
        houseData,
        attentionList,
        baseInfo,
        netWork,
        appUserConfig,
        appConfig: appData.get('config')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        actionsHouseList: bindActionCreators(actionsHouseList, dispatch),
        actionsDetail: bindActionCreators(actionsDetail, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);