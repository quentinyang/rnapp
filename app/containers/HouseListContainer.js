'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/houseList';
import HouseList from '../pages/HouseList';

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
    const {houseData} = state.houseList;
    return {
        houseData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HouseListContainer);