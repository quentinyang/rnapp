'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import RechargeSuccess from '../pages/RechargeSuccess';

class RechargeSuccessContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <RechargeSuccess {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(RechargeSuccessContainer);