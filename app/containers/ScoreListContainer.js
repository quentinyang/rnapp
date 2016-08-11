'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/user';
import ScoreList from '../pages/ScoreList';

class ScoreListContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScoreList {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    let {appUserConfig} = state.app;
    let {scoreData, userProfile, userControlData} = state.user;
    let money = scoreData.get('money'),
        flows = scoreData.get('flows'),
        pager = scoreData.get('pager');

    return {
        appConfig: appUserConfig,
        money: money,
        flows: flows,
        pager: pager,
        userProfile: userProfile,
        userControlData: userControlData
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoreListContainer);