'use strict';

const React = require(`react`);

module.exports = class Logout extends React.Component {
  logout() {
    const xhr = new XMLHttpRequest();
    xhr.onload = response => {
      if (response.target.status === 200) {
        window.location.href = `/`;
      } else {
        window.alert(`sorry you failed to log out`);
      }
    };
    xhr.open(`GET`, `/logout`, true);
    xhr.send(null);
  }
  render() {
    return React.createElement(
      "div",
      { className: "logout-button" },
      React.createElement(
        "button",
        { className: "logout-button__submit-button", onClick: this.logout },
        "Logout of Facebook"
      )
    );
  }
};