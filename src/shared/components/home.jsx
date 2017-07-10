import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Login from './auth/login';
import Register from './auth/register';

const mapStateToProps = (state) => ({
  isAuthenticated: state.profile.id !== -1,
  userId: state.profile.id,
});

class Home extends Component {
  state = {
    showUserOptions: false,
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
        <Link to="/profile"><div className="dropdown-button">Profile</div></Link>
        <Link to="/logout"><div className="dropdown-button">Sign out</div></Link>
      </div>
    );
  }

  renderAuthenticationOptions() {
    if (this.props.isAuthenticated) {
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
    return (
      <div className="account-registration">
        <button className="register-button" onClick={() => this.showRegister()}>Register</button>
        <button className="signin-button" onClick={() => { window.location.href = 'editor'; }}>Try the Editor</button>
      </div>
    );
  }

  render() {
    return (
      <div className="home-container">
        <div className="navbar">
          <Link to="/"><div className="home-button">Noteable</div></Link>
          {this.renderAuthenticationOptions()}
          {this.state.showUserOptions ? this.renderUserOptions() : null}
          {this.state.showAccountDialog ? this.renderSignInDialog() : null}
        </div>
        <div className="main-content">
          <div className="main-background" />
          <div className="header">
            <div className="header-container">
              <h1 className="header-container__title"><span className="cursor">Noteable. Be inspired</span></h1>
              <h5 className="header-container__sub-title">Connect, Create, and Collaborate with artists near you.</h5>
              {this.props.isAuthenticated ? <div className="account-registration" /> : this.renderAccountRegistration() }
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
          <Link to="/contact"><div className="signin-button contact" style={{ 'margin-right': '10px' }}>Contact Us</div></Link>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Home);
