var React = require('react');
import { render } from 'react-dom';
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var IndexRoute = ReactRouter.IndexRoute;
//var routes = require('../routes');
var createBrowserHistory = require('history/lib/createBrowserHistory');

var AppController = require('../shared/components/app-controller');
//var ServerErrorController = require('./shared/components/ServerErrorController');
var SuccessDisplayController = require('../shared/components/success-display-controller'); //use this as a placeholder for successful requests.
var EditorController = require('../shared/components/editor-controller');

// -v x.13.x
/**Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  React.render(<Handler/>, document.getElementById('react-app'));
});**/

var node = document.getElementById('react-app');

// -v 1.0.0
render(React.createElement(
  Router,
  { history: createBrowserHistory() },
  React.createElement(
    Route,
    { path: '/', component: AppController, isLoggedIn: node.attributes[1].value },
    React.createElement(Route, { path: '/success', component: SuccessDisplayController }),
    React.createElement(Route, { path: '/editor', component: EditorController })
  )
), node);