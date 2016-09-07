'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import * as actions from '../actions/attentionBlockSet';
import SelectCity from '../pages/SelectCity';

class SelectCityContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <SelectCity {...this.props} />
        );
    }
}

function mapStateToProps(state) {
    let {cityInfo} = state.attentionBlockSet;
    let {userData} = state.login;
    return {
        cityInfo: cityInfo,
        userData: userData
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(SelectCityContainer);