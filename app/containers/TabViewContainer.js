'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionsUser from '../actions/user';
import * as actionsHome from '../actions/home';
import TabView from '../pages/TabView';

class TabViewContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <TabView {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    const {appUserConfig} = state.app;
    return {
        appUserConfig
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actionsUser: bindActionCreators(actionsUser, dispatch),
        actionsHome: bindActionCreators(actionsHome, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabViewContainer);