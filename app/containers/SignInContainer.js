'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/signIn';
import SignIn from '../pages/SignIn';

class SignInContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SignIn {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    const {signIn} = state.signIn;
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignInContainer);