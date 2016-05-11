'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import HouseInputEnter from '../pages/HouseInputEnter';

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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HouseInputEnterContainer);