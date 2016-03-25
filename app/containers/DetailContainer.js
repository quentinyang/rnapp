'use strict';

import React from 'react-native'
import { Component } from 'nuke'
import { connect } from 'react-redux'
import { bindActionCreators} from 'redux'
import * as actions from '../actions/test'
import Detail from '../pages/Detail'

class DetailContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Detail {...this.props} />
        );
    }
}

function mapStateToProps(state) {
    return {
        baseInfo: {},
        sameCommunityList: {}
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailContainer)