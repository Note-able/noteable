const ReactRouter = require(`react-router`);
const Route = ReactRouter.Route;
const IndexRoute = ReactRouter.IndexRoute;

const AppController = require(`./shared/components/app-controller`);
//var ServerErrorController = require('./shared/components/ServerErrorController');
const SuccessDisplayController = require(`./shared/components/success-display-controller`); //use this as a placeholder for successful requests.
const EditorController = require(`./shared/components/editor-controller`);
const AudioComponent = require('./shared/components/record-audio-component');
const SongsController = require('./shared/components/songs-controller');

module.exports = React.createElement(
  Route,
  { path: '/', component: AppController },
  React.createElement(IndexRoute, { path: '/', component: AppController }),
  React.createElement(Route, { path: '/success', component: SuccessDisplayController }),
  React.createElement(Route, { path: '/editor', component: EditorController }),
  React.createElement(Route, { path: '/audio', component: AudioComponent }),
  React.createElement(Route, { path: '/songs', component: SongsController })
);