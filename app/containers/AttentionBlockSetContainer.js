'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/attentionBlockSet';
import AttentionBlockSet from '../pages/AttentionBlockSet';

class AttentionBlockSetContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AttentionBlockSet {...this.props}/>
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
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AttentionBlockSetContainer);