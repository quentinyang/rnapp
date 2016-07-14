'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/bindAlipay';
import * as actionsUser from '../actions/user';
import * as actionsApp from '../actions/app';
import BindAlipay from '../pages/BindAlipay';

class BindAlipayContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BindAlipay {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    const {aliInfo} = state.bindAlipay;
    return {
        aliInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actionsApp: bindActionCreators(actionsApp, dispatch),
        actionsUser: bindActionCreators(actionsUser, dispatch),
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BindAlipayContainer);