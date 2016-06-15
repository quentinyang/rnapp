'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/user';
import AboutEXP from '../pages/AboutEXP';

class AboutEXPContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AboutEXP {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    return {
        expLevel: state.user.expLevel
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutEXPContainer);