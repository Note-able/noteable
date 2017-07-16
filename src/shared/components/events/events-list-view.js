import React from 'react';
import Event from './event';
import styles from './styles.less';

export default class EventsListView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={styles.eventListContainer}>
        {this.props.events.map(event => {
          return (
            <Event key={event.id} event={event}/>
          );
        })}
      </div>
    );
  }
};