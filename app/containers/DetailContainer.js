'use strict';

import {React, Component} from 'nuke';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as actions from '../actions/detail';
import * as actionsApp from '../actions/app';
import * as actionsHouseList from '../actions/houseList';
import * as actionsHome from '../actions/home';
import * as actionsNavigation from '../actions/navigation';
import Detail from '../pages/Detail';
import Immutable from 'immutable';

class DetailContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Detail {...this.props} />
        );
    }
}

function mapStateToProps(state) {
    const {baseInfo, houseData, callInfo} = state.detail;
    const {appUserConfig, messageNotice} = state.app;
    return {
        appUserConfig: appUserConfig,
        messageNotice: messageNotice,
        baseInfo: baseInfo,
        sameCommunityList: houseData,
        callInfo: callInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        actionsApp: bindActionCreators(actionsApp, dispatch),
        actionsHome: bindActionCreators(actionsHome, dispatch),
        actionsHouseList: bindActionCreators(actionsHouseList, dispatch),
        actionsNavigation: bindActionCreators(actionsNavigation, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailContainer)