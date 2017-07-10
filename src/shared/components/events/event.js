import React from 'react';

let Google;

export default class Event extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      event: props.event
    };
  }

  render() {
    return (
      <div className="event-container">
        <span>{this.state.event.name}</span>
        <span>{this.state.event.latitude}+{this.state.event.longitude}</span>
        <span>{this.state.event.notes}</span>
      </div>
    );
  }
};