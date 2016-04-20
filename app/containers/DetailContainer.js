'use strict';

import {React, Component} from 'nuke';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as actions from '../actions/detail';
import * as actionsHouseList from '../actions/houseList';
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
    return {
        baseInfo: baseInfo,
        sameCommunityList: houseData,
        callInfo: callInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        actionsHouseList: bindActionCreators(actionsHouseList, dispatch),
        actionsNavigation: bindActionCreators(actionsNavigation, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailContainer)