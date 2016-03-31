'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/attentionBlockSet';
import * as actionsOne from '../actions/attentionBlockSetOne';
import AttentionBlockSetTwo from '../pages/AttentionBlockSetTwo';

class AttentionBlockSetTwoContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AttentionBlockSetTwo {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    const {attentionBlockSet} = state.attentionBlockSet;
    return {
        attentionBlockSet
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        actionsOne: bindActionCreators(actionsOne, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AttentionBlockSetTwoContainer);