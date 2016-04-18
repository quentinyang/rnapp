'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/app';
import * as actionsHome from '../actions/home';
import App from '../containers/app';

class AppContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <App {...this.props}/>
        )
    }
}

function mapStateToProps(state) {
    const {appData} = state.app;
    return {
        appData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actionsApp: bindActionCreators(actions, dispatch),
        actionsHome: bindActionCreators(actionsHome, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AppContainer);