import React from 'react';
import styles from './styles.less';

export default class Logout extends React.Component {
  logout() {
    const xhr = new XMLHttpRequest();
    xhr.onload = (response) => {
      if (response.target.status === 200) {
        window.location.href = `/`;
      } else {
        window.alert(`sorry you failed to log out`);
      }
    }
    xhr.open(`GET`, `/logout`, true);
    xhr.send(null);
  }
  render() {
    return(
      <div className={styles.logoutButton}>
        <button className={styles.logoutButtonSubmitButton} onClick={this.logout}>Logout of Facebook</button>
      </div>
    );
  }
}
