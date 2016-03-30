'use strict';

import {React, Component} from 'nuke';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as actions from '../actions/detail';
import Detail from '../pages/Detail';

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
    const {houseData} = state.detail;
    return {
        baseInfo: {},
        sameCommunityList: houseData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DetailContainer)