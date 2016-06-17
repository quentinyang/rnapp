'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/user';
import ScoreList from '../pages/ScoreList';

class ScoreListContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <ScoreList {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    let scores = state.user.scoreData;
    let money = scores.get('money'),
        flows = scores.get('flows'),
        pager = scores.get('pager');

    return {
        money: money,
        flows: flows,
        pager: pager
    };
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(ScoreListContainer);