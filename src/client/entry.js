var React = require('react');
import { render }  from 'react-dom';
var ReactRouter = require('react-router');
var Router = ReactRouter.Router;
var Route = ReactRouter.Route;
var routes = require('../routes');
var createBrowserHistory = require('history/lib/createBrowserHistory');

// -v x.13.x
/**Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  React.render(<Handler/>, document.getElementById('react-app'));
});**/

var node = document.getElementById('react-app');
// -v 1.0.0
render(<Router history={createBrowserHistory()} routes={routes}/> , node);
