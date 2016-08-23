'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/user';
import User from '../pages/User';

class UserContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <User {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    const {appConfig, appUserConfig} = state.app;
    const {userProfile, userControlData, signInInfo} = state.user;
    return {
        userProfile,
        userControlData,
        signInInfo,
        appConfig,
        appUserConfig
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(UserContainer);