import React, { Component, PropTypes } from 'react';
import styles from './styles.less';
import { CreateEvent, FeedHeader } from '../../index.js';

export default class EventsFeed extends Component {
  state = {
    createEvent: false,
  }

  componentDidMount() {
    window.onbeforeunload = () => this.saveState();
    this.setState(JSON.parse(window.localStorage.getItem('events') || '{}'))
  }

  componentWillUnmount() {
    this.saveState();
  }

  saveState() {
    window.localStorage.setItem('events', JSON.stringify(this.state));
  }

  render() {
    return (
      <div className={styles.eventsContainer}>
        <FeedHeader onCreate={() => this.setState({ createEvent: true })} />
        {!this.state.createEvent ? null : (
          <CreateEvent />
        )}
      </div>
    );
  }
}
