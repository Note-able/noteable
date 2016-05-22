'use strict';

const React = require(`react`);
const Router = require('react-router');
const Login = require(`./auth/login`);
const Register = require('./auth/register');

module.exports = class HomeController extends React.Component {
  constructor(props) {
    super(props);

    const initialState = window.__INITIAL_STATE__ ? JSON.parse(window.__INITIAL_STATE__) : null;

    this.state = {
      isAuthenticated: initialState ? initialState.isAuthenticated : false,
      showUserOptions: false,
      userId: initialState ? initialState.userId : -1
    };

    this.showOptions = this._showOptions.bind(this);
    this.bodyClickListener = this._bodyClickListener.bind(this);
    this.showSignIn = this._showSignIn.bind(this);
    this.showRegister = this._showRegister.bind(this);
    this.registerUser = this._registerUser.bind(this);
    this.hideOverlay = this._hideOverlay.bind(this);
  }

  componentDidMount() {
    document.body.onclick = this.bodyClickListener;
  }

  _bodyClickListener(event) {
    let parentNode = event.target.parentNode;

    if (event.target.className.indexOf('user-options') === -1) {
      while (parentNode != null) {
        if (parentNode.className && parentNode.className.indexOf('user-options') !== -1) {
          return;
        }
        parentNode = parentNode.parentNode;
      }

      this.setState({
        showUserOptions: false
      });
    }
  }

  _hideOverlay() {
    this.setState({
      showAccountDialog: false
    });
    document.body.style.overflow = 'scroll';
  }

  _showRegister() {
    this.setState({
      showAccountDialog: true,
      showSignInDialog: false
    });
    document.body.style.overflow = 'hidden';
  }

  _showSignIn() {
    this.setState({
      showAccountDialog: true,
      showSignInDialog: true
    });
    document.body.style.overflow = 'hidden';
  }

  _showOptions() {
    this.setState({
      showUserOptions: !this.state.showUserOptions
    });
  }

  _registerUser() {
    return null;
  }

  renderUserOptions () {
    return (
      <div className="user-options">
        <a href={`/profile`}><div className="dropdown-button">Profile</div></a>
        <a href="/editor"><div className="dropdown-button">Editor</div></a>
        <a href="/logout"><div className="dropdown-button">Sign out</div></a>
      </div>
    );
  }

  renderAuthenticationOptions() {
    if (this.state.isAuthenticated) {
      return (
        <a onClick={this.showOptions}><div className="home"></div></a>
      );
    }

    return (
      <a href="#" onClick={this.showSignIn}><div className="signin-button">Sign in</div></a>
    );
  }

  renderSignInDialog() {
    return [
      <div className="signin-background" onClick={this.hideOverlay}/>,
      <div className="signin-dialog">
        {this.state.showSignInDialog ? <Login switchToRegister={this.showRegister}/> : <Register registerUser={this.registerUser} switchToLogin={this.showSignIn}/>}
      </div>
    ];
  }

  render() {
    return(
      <div className="home-container">
        <div className="navbar">
          {this.renderAuthenticationOptions()}
          {this.state.showUserOptions ? this.renderUserOptions() : null}
          {this.state.showAccountDialog ? this.renderSignInDialog() : null}
        </div>
        <div className="main-content">
          <div className="header">
            <div className="darken" />
            <h1 className="header__title"><span className="cursor">Be Inspired.</span></h1>
            <h5 className="header__sub-title">Connect, Create, and Collaborate with artists near you</h5>
            <div className="account-registration">
              <div className="account-registration__component">
                <input className="email" placeholder="Email"/>
              </div>
              <div className="account-registration__component">
                <input className="password" type="password" placeholder="Password"/>
              </div>
              <div className="account-registration__submit">
                <button className="submit-button" type="submit">Register</button>
              </div>
            </div>
          </div>
          <div className="connect">
            <div className="graphic">
            </div>
            <div className="content">
              <h1>Connect</h1>
              <div>Meet other aspiring songwriters as you grow your network. Get to know established or new songwriters and start creating content together right away.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat. Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper. Nullam ullamcorper nisi non libero laoreet, id pulvinar augue sodales. Suspendisse hendrerit venenatis mattis.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat. Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper.</div>
            </div>
          </div>
          <div className="create">
            <div className="content">
              <h1>Create</h1>
              <div>Meet other aspiring songwriters as you grow your network. Get to know established or new songwriters and start creating content together right away.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat. Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper. Nullam ullamcorper nisi non libero laoreet, id pulvinar augue sodales. Suspendisse hendrerit venenatis mattis.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat. Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper.</div>
            </div>
            <div className="graphic">
            </div>
          </div>
        </div>
      </div>
    );
  }
}
