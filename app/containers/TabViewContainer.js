'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionsApp from '../actions/app';
import * as actionsUser from '../actions/user';
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
    const {clickStatus} = state.app;
    return {
        clickStatus
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actionsApp: bindActionCreators(actionsApp, dispatch),
        actionsUser: bindActionCreators(actionsUser, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(TabViewContainer);