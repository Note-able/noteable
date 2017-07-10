import React from 'react';
import Event from './event';

let Google;

export default class EventsListView extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="events-list-container">
        {this.props.events.map(event => {
          return (
            <Event key={event.id} event={event}/>
          );
        })}
      </div>
    );
  }
};