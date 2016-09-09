'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/authentication';
import * as actionsApp from '../actions/app';
import Authentication from '../pages/Authentication';

class AuthenticationContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Authentication {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    const {userInformation, autController} = state.aut;

    return {
        userinfo: userInformation,
        controller: autController
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        actionsApp: bindActionCreators(actionsApp, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationContainer);