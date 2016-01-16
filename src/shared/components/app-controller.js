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
        <link href='/css/post.css' rel='stylesheet' type='text/css'/>
        <link href='/css/bundle.css' rel='stylesheet' type='text/css'/>
        <div id='app-container'>
          <div className="nav-button-container">
            <div className="nav-button-container__bar">
              <li id='home' className='nav-button' onclick='window.location.href = "/"'><a href='/'></a></li>
              <li id='showPosts' className='nav-button' onclick="window.location.href = '/Tech'"><a href='/Tech'></a></li>
              <li id='showResume' className='nav-button'><a href='/resume'></a></li>
              <li id='showGallery' className='nav-button'><a href='/photos/gallery'></a></li>
              <li id='showAdventure' className='nav-button' onclick="window.location.href = '/Adventure'"><a href='/Adventure'></a></li>
            </div>
          </div>
          { this.props.children }
        </div>
      </div>
    );
  }
}
