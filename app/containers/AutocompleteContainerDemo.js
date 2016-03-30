'use strict';

import {React, Component} from 'nuke';
import { connect } from 'react-redux';
import { bindActionCreators} from 'redux';
import * as actions from '../actions/searchDemo';

import SearchDemo from '../pages/searchDemo'

class AutocompleteContainerDemo extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SearchDemo {...this.props} />
        );
    }
}

function mapStateToProps(state) {
    let data = state.searchDemo.searchData;
    return {
        keyword: data.get('pager').get('current_page').toString(),
        results: data.get('properties')
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AutocompleteContainerDemo)