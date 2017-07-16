import { connect } from 'react-redux';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Login from '../auth/login';
import Register from '../auth/register';

import styles from './styles.less';

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
        <Link to="/profile"><div className={styles.dropdownButton}>>Profile</div></Link>
        <Link to="/logout"><div className={styles.dropdownButton}>Sign out</div></Link>
      </div>
    );
  }

  renderAuthenticationOptions() {
    if (this.props.isAuthenticated) {
      return (
        <a className={styles.userOptionsMenu} onClick={this.state.showUserOptions ? null : this.showOptions}><div className={styles.home} /></a>
      );
    }

    return (
      <a onClick={() => this.showSignIn()}><div className={styles.signinButton}>Sign in</div></a>
    );
  }

  renderSignInDialog() {
    return [
      <div className={styles.signinBackground} onClick={() => this.hideOverlay()} />,
      <div className={styles.signinDialog}>
        {this.state.showSignInDialog ? <Login switchToRegister={() => this.showRegister()} /> : <Register registerUser={() => this.registerUser()} switchToLogin={() => this.showSignIn()} />}
      </div>,
    ];
  }

  renderAccountRegistration() {
    return (
      <div className={styles.accountRegistration}>
        <button className={styles.registerButton} onClick={() => this.showRegister()}>Register</button>
        <button className={styles.signinButton} onClick={() => { window.location.href = 'editor'; }}>Try the Editor</button>
      </div>
    );
  }

  render() {
    return (
      <div className={styles.homeContainer}>
        <div className={styles.navbar}>
          <Link to="/"><div className={styles.homeButton}>Noteable</div></Link>
          {this.renderAuthenticationOptions()}
          {this.state.showUserOptions ? this.renderUserOptions() : null}
          {this.state.showAccountDialog ? this.renderSignInDialog() : null}
        </div>
        <div className={styles.mainContent}>
          <div className={styles.mainBackground} />
          <div className={styles.header}>
            <div className={styles.headerContainer}>
              <h1 className={styles.headerContainerTitle}><span className="cursor">Noteable. Be inspired</span></h1>
              <h5 className={styles.headerContainerSubTitle}>Connect, Create, and Collaborate with artists near you.</h5>
              {this.props.isAuthenticated ? <div className={styles.accountRegistration} /> : this.renderAccountRegistration() }
            </div>
          </div>
          <div className={styles.connect}>
            <div className={styles.graphic} />
            <div className={styles.content}>
              <h1>Connect</h1>
              <div>Meet other aspiring songwriters as you grow your network. Get to know established or new songwriters and start creating content together right away.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat.
              Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper. Nullam ullamcorper nisi non
              libero laoreet, id pulvinar augue sodales. Suspendisse hendrerit venenatis mattis.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat.
              Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper.</div>
            </div>
          </div>
          <div className={styles.collaborate}>
            <div className={styles.content}>
              <h1>Collaborate</h1>
              <div>Meet other aspiring songwriters as you grow your network. Get to know established or new songwriters and start creating content together right away.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat.
              Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper. Nullam ullamcorper nisi non
              libero laoreet, id pulvinar augue sodales. Suspendisse hendrerit venenatis mattis.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat.
              Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper.</div>
            </div>
            <div className={styles.graphic} />
          </div>
          <div className={styles.create}>
            <div className={styles.graphic} />
            <div className={styles.content}>
              <h1>Create</h1>
              <div>Meet other aspiring songwriters as you grow your network. Get to know established or new songwriters and start creating content together right away.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat.
              Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper. Nullam ullamcorper nisi non
              libero laoreet, id pulvinar augue sodales. Suspendisse hendrerit venenatis mattis.</div>
              <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut placerat neque quis enim convallis, non accumsan nunc posuere. Nam pulvinar laoreet volutpat.
              Quisque vitae fringilla tellus, quis eleifend diam. Duis eget nisl et metus porta faucibus. Maecenas efficitur eu erat et semper.</div>
            </div>
          </div>
          <Link to="/contact"><div className={[styles.signinButton, styles.contact]} style={{ 'margin-right': '10px' }}>Contact Us</div></Link>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(Home);
