'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/withdraw';
import * as actionsUser from '../actions/user';
import Withdraw from '../pages/Withdraw';

class WithdrawContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Withdraw {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    const {withdrawInfo} = state.withdraw;
    return {
        withdrawInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actionsUser: bindActionCreators(actionsUser, dispatch),
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawContainer);