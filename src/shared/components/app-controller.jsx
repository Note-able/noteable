import { connect } from 'react-redux';
import React, { Component, PropTypes } from 'react';
import Home from './home.jsx';
import { Newsfeed } from './newsfeed';
import { NavigationSidebar } from './shared';
import AudioComponent from './record-audio-component.js';
import styles from './app-styles/app-controller.less';

const mapStateToProps = (state) => ({
  isAuthenticated: state.profile.id !== -1,
  profile: state.profile,
});


class AppController extends Component {
  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string.isRequired,
    }),
    children: PropTypes.object,
  }

  state = {
    activeTab: this.props.location.pathname,
    isRecording: false,
  }

  componentDidMount() {
    window.onbeforeunload = () => this.saveState();
    this.setState(JSON.parse(window.localStorage.getItem('state') || '{}'))
  }

  componentWillUnmount() {
    this.saveState();
  }

  saveState() {
    window.localStorage.setItem('state', JSON.stringify({ ...this.state, isRecording: false }));
  }

  renderChildren() {
    if (this.props.isAuthenticated && this.props.location.pathname === '/') {
      return (
        <Newsfeed activeTab={this.state.activeTab}>
          {this.renderSidebar()}
        </Newsfeed>
      );
    }

    if (this.props.isAuthenticated) {
      return this.props.children;
    }

    return <Home />;
  }

  renderGrid() {
    return (
      <div>
        <div className={styles.testingVertical} />
        <div className={styles.testingVertical1} />
        <div className={styles.testingHorizontal} />
        <div className={styles.testingHorizontal1} />
      </div>
    );
  }

  renderSidebar() {
    return (
      <NavigationSidebar
        activeTab={this.state.activeTab}
        currentUser={this.props.profile}
        navigateToPath={url => this.setState({ activeTab: url})}
      />
    );
  }

  renderNavbar() {
    return (
      <div className="navbar navbar__no-home">
        <a href="/home"><div className="home-button">Noteable</div></a>
        <div className={styles.searchBarContainer}>
          <div className={styles.searchBarBox}>
            <input className={styles.searchBar} placeholder="Search people, events, or songs" />
          </div>
        </div>
        {this.state.isRecording ? 
          <div className={styles.recordContainer}>
            <AudioComponent />
          </div>
          : <div className={styles.record} onClick={() => this.setState({ isRecording: true })}>Record</div>}
      </div>
    );
  }

  render() {
    return (
      <div>
        <link href="/css/bundle.css" rel="stylesheet" type="text/css" />
        <link href="https://fonts.googleapis.com/css?family=Lobster" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/draft-js/0.7.0/Draft.min.css" />
        {this.renderNavbar()}
        {this.renderChildren()}
      </div>
    );
  }
};


module.exports = connect(mapStateToProps)(AppController);