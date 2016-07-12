'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionsApp from '../actions/app';
import Recharge from '../pages/Recharge';

class RechargeContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Recharge {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        actionsApp: bindActionCreators(actionsApp, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RechargeContainer);