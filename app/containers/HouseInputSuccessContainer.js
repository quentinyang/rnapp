'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
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
    return {}
}

function mapDispatchToProps(dispatch) {
    return {}
}

export default connect(mapStateToProps, mapDispatchToProps)(HouseInputSuccessContainer);