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
            <div className={`${styles.navigationOption} ${activeTab.indexOf('profile') !== -1 || activeTab.length === 0 ? styles.activeTab : ''}`} onClick={(event) => { event.stopPropagation(); this.props.navigate(''); }}><i className={styles.materialIcons}>home</i>Home</div>
            <div className={`${styles.navigationOption} ${activeTab === 'documents' ? styles.activeTab : ''}`} onClick={() => this.props.navigate('editor')}><i className={styles.materialIcons}>insert_drive_file</i>Editor</div>
            <div className={`${styles.navigationOption} ${activeTab === 'messages' ? styles.activeTab : ''}`} onClick={() => this.props.navigate('messages')}><i className={styles.materialIcons}>headset</i>Music</div>
            <div className={`${styles.navigationOption} ${activeTab === 'events' ? styles.activeTab : ''}`} onClick={() => this.props.navigate('events')}><i className={styles.materialIcons}>event</i>Events</div>
            <div className={`${styles.navigationOption} ${activeTab === 'events' ? styles.activeTab : ''}`} onClick={() => this.props.navigate('nearby')}><i className={styles.materialIcons}>my_location</i>Nearby</div>
            <div className={`${styles.navigationOption}`} onClick={() => this.logout()}><i className={styles.materialIcons}>exit_to_app</i>Logout</div>            
          </div>
        </div>
      </div>
    );
  }
}

module.exports = NavigationSidebar;