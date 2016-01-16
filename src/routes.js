var ReactRouter = require('react-router');
var Route = ReactRouter.Route;
var React = require('react');
var IndexRoute = ReactRouter.IndexRoute;

var AppController = require('./shared/components/app-controller');
//var ServerErrorController = require('./shared/components/ServerErrorController');


module.exports =  (
	<Route path='/' component={ AppController }>
	</Route>
);
