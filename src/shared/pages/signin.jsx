import React, { Component } from 'react';
import Login from '../components/auth/login';
import Register from '../components/auth/register';

export default class Signin extends Component {
  state = {
    isRegistering: false,
  };

  toggleDialog() {
    this.setState({
      isRegistering: !this.state.isRegistering,
    });
  }

  render() {
    return (
      <div className="auth-container" style={this.state.isRegistering ? { height: '350px' } : { height: '300px' }}>
        { this.state.isRegistering ?
          <Register switchToLogin={() => this.toggleDialog()} /> :
          <Login switchToRegister={() => this.toggleDialog()} />
        }
      </div>
    );
  }
};
