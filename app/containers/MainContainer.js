'use strict';

import React, {Component} from 'react-native';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/test';
import Main from '../pages/Main';

class MainContainer extends Component {
    componentDidMount() {
    }

    render() {
        return (
            <Main {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    const {test} = state;
    return {
        test
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MainContainer);
