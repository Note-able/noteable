import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import styles from './styles.less';

export default class Home extends Component {
  static propTypes = {
    showAccountDialog: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
  }

  state = {
    showUserOptions: false,
    showAccountDialog: false,
    showSignInDialog: false,
  };

  renderLearnMore = () => (
    <div className={styles.accountRegistration}>
      <button className={styles.registerButton} onClick={() => this.props.showAccountDialog()}>Learn More</button>
    </div>
  )

  render() {
    return (
      <div className={styles.homeContainer}>
        <div className={styles.mainContent}>
          <div className={styles.mainBackground} />
          <div className={styles.header}>
            <div className={styles.headerContainer}>
              <h1 className={styles.headerContainerTitle}><span className="cursor">Noteable. Be inspired</span></h1>
              <h5 className={styles.headerContainerSubTitle}>Connect, Create, and Collaborate with artists near you.</h5>
              {this.props.isAuthenticated ? null : this.renderLearnMore() }
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
          <Link to="/contact" className={[styles.signinButton, styles.contact]}>Contact Us</Link>
        </div>
      </div>
    );
  }
}
