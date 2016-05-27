'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Login from '../pages/Login';
import * as actions from '../actions/login';

class LoginContainer extends Component {
    render() {
        return (
            <Login {...this.props} />
        );
    }
}

function mapStateToProps(state) {
    const {login} = state;
    return {
        login
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer);