import React, { Component, PropTypes } from 'react';
import styles from './styles.less';

export default class FeedHeader extends Component {
  static props = {
    onCreate: PropTypes.func.isRequired,
  }

  // create, filter, etc. feed.
  render() {
    return (
      <div className={styles.eventHeader}>
        <button className={styles.createButton} onClick={this.props.onCreate}>Create +</button>
      </div>
    );
  }
}
