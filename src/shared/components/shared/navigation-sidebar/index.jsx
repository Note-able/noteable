import React, { Component, PropTypes } from 'react';
import styles from './styles.less';

export default class NavigationSidebar extends Component {
  static propTypes = {
    activeTab: PropTypes.string,
    currentUser: PropTypes.shape({
      avatarUrl: PropTypes.string,
      firstName: PropTypes.string,
      lastName: PropTypes.string,
    }),
    navigateToPath: PropTypes.func.isRequired,
  }

  logout() {
    window.location.pathname = '/logout';
  }
  
  render() {
    const activeTab = this.props.activeTab;

    return (
      <div>
        <div className={styles.navigationContent}>
          <div className={styles.currentUser}>
            <img className={styles.currentAvatar} src={this.props.currentUser.avatarUrl} />
            <div className={styles.currentName}>{`${this.props.currentUser.firstName} ${this.props.currentUser.lastName}`}</div>
          </div>
          <div className={styles.navigationOptions}>
            <div className={`${styles.navigationOption} ${activeTab === '/' ? styles.activeTab : ''}`} onClick={(event) => { event.stopPropagation(); this.props.navigateToPath('/'); }}><i className="material-icons">home</i>Home</div>
            <div className={`${styles.navigationOption} ${activeTab === '/music' ? styles.activeTab : ''}`} onClick={() => { this.props.navigateToPath('/music'); }}><i className="material-icons">headset</i>Music</div>
            <div className={`${styles.navigationOption} ${activeTab === '/events' ? styles.activeTab : ''}`} onClick={() => { this.props.navigateToPath('/events'); }}><i className="material-icons">event</i>Events</div>
            <div className={`${styles.navigationOption} ${activeTab === '/messages' ? styles.activeTab : ''}`} onClick={() => { this.props.navigateToPath('/messages'); }}><i className="material-icons">forum</i>Messages</div>
            <div className={`${styles.navigationOption}`} onClick={() => this.logout()}><i className="material-icons">exit_to_app</i>Logout</div>            
          </div>
        </div>
      </div>
    );
  }
}