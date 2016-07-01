'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AboutUser from '../pages/AboutUser';
import * as actions from '../actions/user';

class AboutUserContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AboutUser {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    const {baseInfo} = state.detail;
    const {userHouseData} = state.user;
    return {
        userInfo: baseInfo.get('userInfo'),
        properties: userHouseData.get('properties'),
        pager: userHouseData.get('pager')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AboutUserContainer);