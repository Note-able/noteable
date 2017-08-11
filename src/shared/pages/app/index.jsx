import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Home from '../../components/home/index';
import Login from '../../components/auth/login';
import Register from '../../components/auth/register';
import styles from './styles.less';


export default class App extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }).isRequired,
  }

  state = {
    showRegister: false,
    showSignIn: false,
    user: {},
  }

  showSignIn = () => {
    this.setState({
      showSignIn: true,
      showRegister: false,
    });
  }

  hideOverlay = () => {
    this.setState({
      showSignIn: false,
      showRegister: false,
    });
  }

  showRegister = () => {
    this.setState({
      showRegister: true,
      showSignIn: false,
    });
  }

  renderAccountDialog() {
    return [
      <div className={styles.signinBackground} onClick={() => this.hideOverlay()} />,
      <div className={styles.signinDialog}>
        {this.state.showSignIn ? <Login switchToRegister={() => this.showRegister()} /> : <Register registerUser={() => this.registerUser()} switchToLogin={() => this.showSignIn()} />}
      </div>,
    ];
  }

  renderNavbar = () => (
    <div className={[styles.navbar, styles.navbarNoHome].join(' ')}>
      <Link className={styles.homeButton} to="/">Noteable</Link>
      {this.state.isAuthenticated ?
        <button className={styles.signinButton} onClick={() => { console.log('sign out'); }}>Sign Out</button> :
        <button className={styles.signinButton} onClick={this.showSignIn}>Sign In</button>}
    </div>
  )

  render() {
    return (
      <div>
        <link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet" />
        {this.renderNavbar()}
        {this.state.showRegister || this.state.showSignIn ? this.renderAccountDialog() : null}
        <Home user={this.state.user} showAccountDialog={this.showRegister} isAuthenticated={this.state.isAuthenticated} />
      </div>
    );
  }
};