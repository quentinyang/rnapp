'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/authentication';
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
    const {userInformation} = state.aut;

    return {
        userinfo: userInformation
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthenticationContainer);