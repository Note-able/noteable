'use strict';

var React = require("react");
var Router = require("react-router");

module.exports = class AppController extends React.Component {
  renderGrid() {
    return (
      <div>
        <div className='testing-vertical'></div>
        <div className='testing-horizontal'></div>
      </div>
    );
  }
  render() {
    return(
      <div>
        <link href='/css/bundle.css' rel='stylesheet' type='text/css'/>
        <div className='app-container'>
          <div className="nav-button-container">
          </div>
          { this.props.children }
        </div>
      </div>
    );
  }
}
