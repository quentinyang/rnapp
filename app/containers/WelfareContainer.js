'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Welfare from '../pages/Welfare';
import * as homeActions from '../actions/home';

class WelfareContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Welfare {...this.props}/>
        );
    }
}

function mapStateToProps(state) {
    return {

    }
}

function mapDispatchToProps(dispatch) {
    return {
        homeActions: bindActionCreators(homeActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(WelfareContainer);