'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import HouseInputEnter from '../pages/HouseInputEnter';
import * as actionsApp from '../actions/app';

class HouseInputEnterContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <HouseInputEnter {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    return {
    }
}

function mapDispatchToProps(dispatch) {
    return {
        actionsApp: bindActionCreators(actionsApp, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HouseInputEnterContainer);