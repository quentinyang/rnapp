'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/houseList';
import * as actionsHome from '../actions/home';
import * as actionsDetail from '../actions/detail';
import HouseList from '../pages/HouseList';
import * as actionsNavigation from '../actions/navigation';

class HouseListContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HouseList {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    const {houseData, filterData, uiData, queryParamsData, communityData} = state.houseList;
    return {
        houseData, filterData, uiData, queryParamsData, communityData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        actionsHome: bindActionCreators(actionsHome, dispatch),
        actionsDetail: bindActionCreators(actionsDetail, dispatch),
        actionsNavigation: bindActionCreators(actionsNavigation, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HouseListContainer);