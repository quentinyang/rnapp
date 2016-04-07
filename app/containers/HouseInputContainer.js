'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/houseInput';
import * as searchActions from '../actions/communitySearch';
import HouseInput from '../pages/HouseInput';

class HouseInputContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HouseInput {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    const {houseInput, communitySearch} = state;
    return {
        houseInput,
        communitySearch
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch),
        searchActions: bindActionCreators(searchActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HouseInputContainer);