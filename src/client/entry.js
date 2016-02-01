const React = require(`react`);
import { render } from 'react-dom';
const ReactRouter = require(`react-router`);
const Router = ReactRouter.Router;
const Route = ReactRouter.Route;
const IndexRoute = ReactRouter.IndexRoute;
//var routes = require('../routes');
const createBrowserHistory = require(`history/lib/createBrowserHistory`);

const AppController = require(`../shared/components/app-controller`);
//var ServerErrorController = require('./shared/components/ServerErrorController');
const SuccessDisplayController = require(`../shared/components/success-display-controller`); //use this as a placeholder for successful requests.
const EditorController = require(`../shared/components/editor-controller`)

// -v x.13.x
/**Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  React.render(<Handler/>, document.getElementById('react-app'));
});**/

const node = document.getElementById(`react-app`);

// -v 1.0.0
render(
  <Router history={createBrowserHistory()}>
    <Route path="/" component={ AppController } isLoggedIn={node.attributes[1].value} >
  		<Route path="/success" component={ SuccessDisplayController }/>
			<Route path="/editor" component= { EditorController }/>
  	</Route>
  </Router>
   , node);
