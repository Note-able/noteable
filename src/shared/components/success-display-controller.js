'use strict';

const React = require(`react`);

module.exports = class SuccessDisplayController extends React.Component {
  checkLoginState () {
    FB.getLoginStatus(response => {
      if (response.status === `not_authorized`) {
        alert(`Login failed, please try again.`);
      } else {
        window.location.href = `/success`;
      }
    });
  }
  render () {
    return (
      <div className="success-container" style={{position: `absolute`, top: 0, bottom: 0, left: 0, right: 0, margin: `auto`}}>
        <div>SUCCESS</div>
      </div>
    );
  }
}
