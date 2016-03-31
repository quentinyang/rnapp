'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/home';
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
    const {houseData, attentionList} = state.home;
    return {
        houseData,
        attentionList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeContainer);