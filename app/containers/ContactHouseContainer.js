'use strict';

import {React, Component} from 'nuke';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as actions from '../actions/settings';
import ContactHouse from '../pages/ContactHouse';

class ContactHouseContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ContactHouse {...this.props} />
        );
    }
}

function mapStateToProps(state) {
    let {houseData} = state.settings;
    let contactHouse = houseData.get('contactHouse');
    let timeVisible = houseData.get('timeVisible');
    let netWork = state.app.appData.get('net');
    return {
        houseList: contactHouse.get('properties'),
        pager: contactHouse.get('pager'),
        timeVisible,
        netWork
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ContactHouseContainer)