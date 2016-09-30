'use strict';

const React = require(`react`);

module.exports = class EventController extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="event-controller-container">
        {this.props.children}
      </div>
    );
  }
};
