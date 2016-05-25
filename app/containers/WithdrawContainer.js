'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
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
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WithdrawContainer);