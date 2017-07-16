import React from 'react';
import styles from './styles.less';

export default class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      event: props.event
    };
  }

  render() {
    return (
      <div className={styles.eventContainer}>
        <span>{this.state.event.name}</span>
        <span>{this.state.event.latitude}+{this.state.event.longitude}</span>
        <span>{this.state.event.notes}</span>
      </div>
    );
  }
};