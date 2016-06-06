'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionsInput from '../actions/houseInput';
import * as actionsApp from '../actions/app';
import SearchCommunity from '../pages/SearchCommunity';

class SearchCommunityContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SearchCommunity {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    let {communityData} = state.houseInput;
    let {appData} = state.app;
    let inputSearchHistory = appData.get('inputSearchHistory');

    return {
        communityData: communityData,
        inputSearchHistory: inputSearchHistory
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actionsInput: bindActionCreators(actionsInput, dispatch),
        actionsApp: bindActionCreators(actionsApp, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchCommunityContainer);