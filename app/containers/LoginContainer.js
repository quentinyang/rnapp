'use strict';

import React from 'react-native';
const {
  Component
} = React;
import {connect} from 'react-redux';

import Login from '../pages/Login';

class LoginContainer extends Component {
  render() {
    return (
      <Login {...this.props} />
    );
  }
}

function mapStateToProps(state) {
  const {login} = state;
  return {
    login
  }
}

export default connect(mapStateToProps)(LoginContainer);