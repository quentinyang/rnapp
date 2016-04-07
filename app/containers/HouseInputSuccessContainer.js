'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/houseInput';
import * as searchActions from '../actions/communitySearch';
import HouseInputSuccess from '../pages/HouseInputSuccess';

class HouseInputSuccessContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HouseInputSuccess {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    const {houseInput} = state;
    return {
        houseInput
    }
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(HouseInputSuccessContainer);