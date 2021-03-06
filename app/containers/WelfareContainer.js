'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/welfare';
import * as actionsApp from '../actions/app';
import Welfare from '../pages/Welfare';

class WelfareContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Welfare {...this.props} />
        );
    }
}

function mapStateToProps(state) {
    let {welfareInfo} = state.card;
    let netWork = state.app.appData.get('net');
    return {
        list1: welfareInfo.get('list1'),
        pager1: welfareInfo.get('pager1'),
        list2: welfareInfo.get('list2'),
        pager2: welfareInfo.get('pager2'),
        list3: welfareInfo.get('list3'),
        pager3: welfareInfo.get('pager3'),
        current: welfareInfo.get('current'),
        netWork
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actionsApp: bindActionCreators(actionsApp, dispatch),
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelfareContainer);