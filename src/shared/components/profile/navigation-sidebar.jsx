import React, { Component, PropTypes } from 'react';
import styles from '../app-styles/navigation.less';

class NavigationSidebar extends Component {
  static propTypes = {
    activeTab: PropTypes.string,
    navigate: PropTypes.func.isRequired,
  }

  logout() {
    window.location.pathname = '/logout';
  }
  
  render() {
    const activeTab = this.props.activeTab.length === 0 ? 'profile' : this.props.activeTab;

    return (
      <div>
        <div className={styles.navigationContent}>
          <div className={styles.currentUser}>
            <img className={styles.currentAvatar} src={this.props.currentUser.avatarUrl} />
            <div className={styles.currentName}>{`${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`}</div>
          </div>
          <div className={styles.navigationOptions}>
            <div className={`${styles.navigationOption} ${activeTab.indexOf('profile') !== -1 || activeTab.length === 0 ? styles.activeTab : ''}`} onClick={(event) => { event.stopPropagation(); this.props.navigate('profile'); }}>Home</div>
            <div className={`${styles.navigationOption} ${activeTab === 'documents' ? styles.activeTab : ''}`} onClick={() => this.props.navigate('documents')}>Editor</div>
            <div className={`${styles.navigationOption} ${activeTab === 'messages' ? styles.activeTab : ''}`} onClick={() => this.props.navigate('messages')}>Music</div>
            <div className={`${styles.navigationOption} ${activeTab === 'events' ? styles.activeTab : ''}`} onClick={() => this.props.navigate('events')}>Events</div>
            <div className={`${styles.navigationOption} ${activeTab === 'events' ? styles.activeTab : ''}`} onClick={() => this.props.navigate('nearby')}>Nearby</div>
            <div className={`${styles.navigationOption}`} onClick={() => this.logout()}>Logout</div>            
          </div>
        </div>
      </div>
    );
  }
}

module.exports = NavigationSidebar;