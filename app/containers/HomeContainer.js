'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/home';
import * as actionsHouseList from '../actions/houseList';
import Home from '../pages/Home';

class HomeContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Home {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    const {houseData, attentionList, scoreModalInfo} = state.home;
    return {
        houseData,
        attentionList,
        scoreModalInfo
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        actionsHouseList: bindActionCreators(actionsHouseList, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);