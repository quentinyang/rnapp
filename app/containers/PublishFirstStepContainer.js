'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/houseInput';
import BaseInfo from '../pages/publishInventoryStep/BaseInfo';

class PublishFirstStepContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <BaseInfo {...this.props}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(PublishFirstStepContainer);