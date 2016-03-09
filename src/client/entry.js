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
const AudioComponent = require('../shared/components/record-audio-component');
const SigninController = require('../shared/components/signin-controller');
const SongsController = require('../shared/components/songs-controller');
const EventController = require('../shared/components/event-controller');
const BrowseEvents = require('../shared/components/events/browse-events');
const CreateEvent = require('../shared/components/events/create-event');

// -v x.13.x
/**Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  React.render(<Handler/>, document.getElementById('react-app'));
});**/
const node = document.getElementById(`react-app`);

//ReactDOM.render(App(), node);
// -v 1.0.0

render(
    <Router history={createBrowserHistory()}>
      <Route path="/" component={ AppController }>
        <Route path="/signin" component={ SigninController }/>
    		<Route path="/success" component={ SuccessDisplayController }/>
  			<Route path="/editor/:documentId" component= { EditorController }/>//send userid in via req later.
        <Route path="/audio" component={ AudioComponent }/>
        <Route path="/events" component={ EventController }>
          <Route path="/events/browse" components={ BrowseEvents }/>
          <Route path="/events/create" components={ CreateEvent }/>
        </Route>
      <Route path="/songs" component={ SongsController }/>
    	</Route>
    </Router>
   , node);
