import React from 'react';
import ReactDOM from 'react-dom'
import { Route } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import { appReducer } from '../shared/reducers';

import App from '../shared/pages/app';
import ProfileCreate from '../shared/pages/profile-create';
import DemoProfile from '../shared/pages/demo-profile';
import RecordAudio from '../shared/pages/record-audio';
import Signin from '../shared/pages/signin';
import Songs from '../shared/pages/songs';
import Profile from '../shared/pages/profile';

const node = document.getElementById('react-app');
const props = JSON.parse(decodeURIComponent(node.getAttribute('data-current-user')));
const store = compose(applyMiddleware(thunk), typeof window !== 'undefined' && window.devToolsExtension ? window.devToolsExtension() : args => args)
  (createStore)
  (appReducer, {
    currentUser: { isAuthenticated: props.isAuthenticated, userId: props.profile.id },
    profile: { ...props.profile },
  });

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <div className="app-container">
        <Route exact path="/" component={App} />
        <Route path="/signin" component={Signin} />
        <Route path="/audio" component={RecordAudio} />
        <Route path="/profile/:profileId" components={Profile} />
        <Route path="/profile/create" component={ProfileCreate} />
        <Route path="/profile/demo" components={DemoProfile} />
        <Route path="/songs" component={Songs} />
      </div>
    </Router>
  </Provider>
 , node);
