'use strict';

import {React, Component} from 'nuke';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as actions from '../actions/settings';
import InputHouse from '../pages/InputHouse';

class InputHouseContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <InputHouse {...this.props} />
        );
    }
}

function mapStateToProps(state) {
    let inputHouse = state.settings.houseData.get('inputHouse');
    let netWork = state.app.appData.get('net');
    return {
        houseList: inputHouse.get('properties'),
        pager: inputHouse.get('pager'),
        netWork
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(InputHouseContainer)