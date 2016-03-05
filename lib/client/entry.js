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
const EditorController = require(`../shared/components/editor-controller`);
const AudioComponent = require('../shared/components/record-audio-component');
const SigninController = require('../shared/components/signin-controller');
const SongsController = require('../shared/components/songs-controller');

// -v x.13.x
/**Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  React.render(<Handler/>, document.getElementById('react-app'));
});**/
const node = document.getElementById(`react-app`);

//ReactDOM.render(App(), node);
// -v 1.0.0

render(React.createElement(
  Router,
  { history: createBrowserHistory() },
  React.createElement(
    Route,
    { path: '/', component: AppController },
    React.createElement(Route, { path: '/signin', component: SigninController }),
    React.createElement(Route, { path: '/success', component: SuccessDisplayController }),
    React.createElement(Route, { path: '/editor/:documentId', component: EditorController }),
    '//send userid in via req later.',
    React.createElement(Route, { path: '/audio', component: AudioComponent }),
    React.createElement(Route, { path: '/songs', component: SongsController })
  )
), node);