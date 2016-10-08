import React from 'react';
import { render } from 'react-dom';
import { Router, Route } from 'react-router';
import { appReducer } from '../shared/reducers';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import ProfileCreate from '../shared/components/profile/create.jsx';

const createBrowserHistory = require('history/lib/createBrowserHistory');
const AppController = require(`../shared/components/app-controller.jsx`);
//var ServerErrorController = require('./shared/components/ServerErrorController');
const SuccessDisplayController = require(`../shared/components/success-display-controller`); // use this as a placeholder for successful requests.
const EditorController = require(`../shared/components/editor-controller`)
const AudioComponent = require('../shared/components/record-audio-component');
const SigninController = require('../shared/components/signin-controller.jsx');
const SongsController = require('../shared/components/songs-controller');
const EventController = require('../shared/components/event-controller');
const BrowseEvents = require('../shared/components/events/browse-events');
const CreateEvent = require('../shared/components/events/create-event');
const Editor = require('../shared/components/editor/editor');
const Profile = require('../shared/components/profile/profile.jsx');
const DemoProfile = require('../shared/components/profile/demo');

// -v x.13.x
/** Router.run(routes, Router.HistoryLocation, function (Handler, state) {
  React.render(<Handler/>, document.getElementById('react-app'));
});**/
const node = document.getElementById('react-app');
const props = JSON.parse(node.getAttribute('data-current-user'));
const store = compose(applyMiddleware(thunk), typeof window !== 'undefined' && window.devToolsExtension ? window.devToolsExtension() : args => args)
  (createStore)
  (appReducer, {
    currentUser: { isAuthenticated: props.isAuthenticated, userId: props.profile.id },
    profile: { ...props.profile },
  });

// ReactDOM.render(App(), node);
// -v 1.0.0

render(
  <Provider store={store}>
    <Router history={createBrowserHistory()}>
      <Route path="/" component={AppController}>
        <Route path="/signin" component={SigninController} />
        <Route path="/success" component={SuccessDisplayController} />
        <Route path="/editor" component={Editor} />
        <Route path="/editor/:documentId" component={EditorController} />
        <Route path="/audio" component={AudioComponent} />
        <Route path="/events" component={EventController} />
        <Route path="/events/browse" components={BrowseEvents} />
        <Route path="/events/create" components={CreateEvent} />
        <Route path="/profile(/:profileId)" components={Profile}>
          <Route path="/profile/create" component={ProfileCreate} />
        </Route>
        <Route path="/profile/demo" components={DemoProfile} />
      </Route>
      <Route path="/songs" component={SongsController} />
    </Router>
  </Provider>
 , node);
