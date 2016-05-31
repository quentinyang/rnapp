'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actionsInput from '../actions/houseInput';
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
    let {houseForm, communityData} = state.houseInput;

    return {
        houseForm: houseForm,
        communityData: communityData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actionsInput: bindActionCreators(actionsInput, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchCommunityContainer);