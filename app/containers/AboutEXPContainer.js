'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionsApp from '../actions/app';
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

    }
}

function mapDispatchToProps(dispatch) {
    return {
        actionsApp: bindActionCreators(actionsApp, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutEXPContainer);