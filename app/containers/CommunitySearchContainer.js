'use strict';

import {React, Component} from 'nuke';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as actions from '../actions/communitySearch';
import * as actionsOne from '../actions/attentionBlockSetOne';
import CommunitySearch from '../pages/CommunitySearch';

class CommunitySearchContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <CommunitySearch {...this.props} />
        );
    }
}

function mapStateToProps(state) {
    let {communityData} = state.communitySearch;
    const {attentionList} = state.attentionBlockSetOne;
    return {
        keyword: communityData.get('keyword'),
        results: communityData.get('results'),
        attentionList: attentionList
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        actionsOne: bindActionCreators(actionsOne, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CommunitySearchContainer)