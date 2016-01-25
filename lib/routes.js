var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var React = require('react');
var IndexRoute = ReactRouter.IndexRoute;

var AppController = require('./shared/components/app-controller');
//var ServerErrorController = require('./shared/components/ServerErrorController');
var SuccessDisplayController = require('./shared/components/success-display-controller'); //use this as a placeholder for successful requests.
var EditorController = require('./shared/components/editor-controller');

module.exports = React.createElement(
	Route,
	{ path: '/', component: AppController },
	React.createElement(Route, { path: '/success', component: SuccessDisplayController }),
	React.createElement(Route, { path: '/editor', component: EditorController })
);