'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionsApp from '../actions/app';
import Setting from '../pages/Setting';

class SettingContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Setting {...this.props}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(SettingContainer);