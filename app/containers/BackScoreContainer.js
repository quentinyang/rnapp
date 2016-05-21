'use strict';

import {React, Component} from 'nuke';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as actions from '../actions/backScore';
import BackScore from '../pages/BackScore';
import Immutable from 'immutable';

class BackScoreContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BackScore {...this.props} />
        );
    }
}

function mapStateToProps(state) {
    const {pageData} = state.backScore;

    return {
        pageInfo: pageData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(BackScoreContainer)