import React, { Component } from 'react';
import Login from './auth/login.jsx';
import Register from './auth/register.jsx';

const initialState = window.__INITIAL_STATE__ ? JSON.parse(window.__INITIAL_STATE__) : null;

module.exports = class HomeController extends Component {
  state = {
    isAuthenticated: initialState ? initialState.isAuthenticated : false,
    showUserOptions: false,
    userId: initialState ? initialState.userId : -1,
  };

  flipped = false;

  componentDidMount() {
    document.body.onclick = event => { this.bodyClickListener(event); };
  }

  bodyClickListener(event) {
    let parentNode = event.target.parentNode;

    if (event.target.className.indexOf('user-options-menu') !== -1 || event.target.className.indexOf('home') !== -1) {
      this.setState({
        showUserOptions: !this.state.showUserOptions,
      });

      this.flipped = true;
      return;
    }

    if (event.target.className.indexOf('user-options') === -1) {
      while (parentNode != null) {
        if (parentNode.className && parentNode.className.indexOf('user-options') !== -1) {
          return;
        }
        parentNode = parentNode.parentNode;
      }

      this.setState({
        showUserOptions: false,
      });
    }
  }

  hideOverlay() {
    this.setState({
      showAccountDialog: false,
    });
  }

  showRegister() {
    this.setState({
      showAccountDialog: true,
      showSignInDialog: false,
    });
  }

  showSignIn() {
    this.setState({
      showAccountDialog: true,
      showSignInDialog: true,
    });
  }

  showOptions() {
    if (this.flipped) {
      this.flipped = false;
      return;
    }
    this.setState({
      showUserOptions: true,
    });
  }

  registerUser() {
    return null;
  }

  renderUserOptions() {
    return (
      <div className="user-options">
        <a href={'/profile'}><div className="dropdown-button">Profile</div></a>
        <a href="/editor"><div className="dropdown-button">Editor</div></a>
        <a href="/logout"><div className="dropdown-button">Sign out</div></a>
      </div>
    );
  }

  renderAuthenticationOptions() {
    if (this.state.isAuthenticated) {
      return (
        <a className="user-options-menu" onClick={this.state.showUserOptions ? null : this.showOptions}><div className="home" /></a>
      );
    }

    return (
      <a onClick={() => this.showSignIn()}><div className="signin-button">Sign in</div></a>
    );
  }

  renderSignInDialog() {
    return [
      <div className="signin-background" onClick={() => this.hideOverlay()} />,
      <div className="signin-dialog">
        {this.state.showSignInDialog ? <Login switchToRegister={() => this.showRegister()} /> : <Register registerUser={() => this.registerUser()} switchToLogin={() => this.showSignIn()} />}
      </div>,
    ];
  }

  renderAccountRegistration() {
    return [
      <div className="account-registration">
        <button className="register-button" onClick={() => this.showRegister()}>Register</button>
        <button className="signin-button">Learn more</button>
      </div>,
      <div className="demo-container">
        <a href="/editor">
          <button className="demo-container__button">Try the Editor</button>
        </a>
      </div>,
    ];
  }

  render() {
    return (
      <div className="home-container">
        <div className="navbar">
          <a href="/"><div className="home-button">Noteable</div></a>
          {this.renderAuthenticationOptions()}
          {this.state.showUserOptions ? this.renderUserOptions() : null}
          {this.state.showAccountDialog ? this.renderSignInDialog() : null}
        </div>
        <div className="main-content">
          <div className="header">
            <div className="header-container">
              <h1 className="header-container__title"><span className="cursor">Noteable. Be inspired</span></h1>
              <h5 className="header-container__sub-title">Connect, Create, and Collaborate with artists near you.</h5>
              {this.state.isAuthenticated ? <div className="account-registration" /> : this.renderAccountRegistration() }
            </div>
          </div>
          <div className="connect">
            <div className="graphic" />
            <div className="content">
              <h1>Connect</h1>
              <div>Meet other aspiring songwriters as you grow your network. Get to know established or new songwriters and start creating content together right away.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat.
              Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper. Nullam ullamcorper nisi non
              libero laoreet, id pulvinar augue sodales. Suspendisse hendrerit venenatis mattis.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat.
              Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper.</div>
            </div>
          </div>
          <div className="collaborate">
            <div className="content">
              <h1>Collaborate</h1>
              <div>Meet other aspiring songwriters as you grow your network. Get to know established or new songwriters and start creating content together right away.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat.
              Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper. Nullam ullamcorper nisi non
              libero laoreet, id pulvinar augue sodales. Suspendisse hendrerit venenatis mattis.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat.
              Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper.</div>
            </div>
            <div className="graphic" />
          </div>
          <div className="create">
            <div className="graphic" />
            <div className="content">
              <h1>Create</h1>
              <div>Meet other aspiring songwriters as you grow your network. Get to know established or new songwriters and start creating content together right away.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat.
              Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper. Nullam ullamcorper nisi non
              libero laoreet, id pulvinar augue sodales. Suspendisse hendrerit venenatis mattis.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat.
              Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper.</div>
            </div>
          </div>
          <a href="/contact"><div className="signin-button contact" style={{ 'margin-right': '10px' }}>Contact Us</div></a>
        </div>
      </div>
    );
  }
}