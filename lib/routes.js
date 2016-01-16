var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var React = require('react');
var ReactDOM = require('react-dom');
var IndexRoute = ReactRouter.IndexRoute;

var AppController = require('./shared/components/app-controller');
//var ServerErrorController = require('./shared/components/ServerErrorController');

module.exports = React.createElement(Route, { path: '/', component: AppController });