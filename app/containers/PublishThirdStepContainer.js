'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/houseInput';
import LandlordInfo from '../pages/publishInventoryStep/LandlordInfo';

class PublishThirdStepContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <LandlordInfo {...this.props}/>
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
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(PublishThirdStepContainer);