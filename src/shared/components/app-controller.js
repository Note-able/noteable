'use strict';

var React = require('react');
var Router = require('react-router');
var Login = require('./login/login');

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
        <div className=''>
          <Login/>
          { this.props.children }
        </div>
      </div>
    );
  }
}
