'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/welfare';
import Welfare from '../pages/Welfare';
import * as homeActions from '../actions/home';

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
    return {
        list: welfareInfo.get('list'),
        pager: welfareInfo.get('pager'),
        current: welfareInfo.get('current')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        homeActions: bindActionCreators(homeActions, dispatch),
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelfareContainer);