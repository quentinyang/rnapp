'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/attentionBlockSetOne';
import * as actionsHome from '../actions/home';
import AttentionBlockSetOne from '../pages/AttentionBlockSetOne';

class AttentionBlockSetOneContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AttentionBlockSetOne {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    const {attentionList} = state.attentionBlockSetOne;
    return {
        attentionList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        actionsHome: bindActionCreators(actionsHome, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AttentionBlockSetOneContainer);