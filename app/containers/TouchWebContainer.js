'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/user';
import TouchWeb from '../pages/TouchWeb';

class TouchWebContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TouchWeb {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    const {userProfile} = state.user;
    return {
        userProfile
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TouchWebContainer);