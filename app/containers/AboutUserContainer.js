'use strict';

import {React, Component} from 'nuke';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import AboutUser from '../pages/AboutUser';

class AboutUserContainer extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <AboutUser {...this.props}/>
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

export default connect(mapStateToProps, mapDispatchToProps)(AboutUserContainer);