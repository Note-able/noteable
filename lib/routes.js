/*
	<Route path="/" component={ AppController }>
    <IndexRoute path="/" component={ AppController }/>
    <Route path="/signin" component={ SigninController }/>
		<Route path="/success" component={ SuccessDisplayController }/>
		<Route path="/editor" component= { EditorController }/>
    <Route path="/audio" component= { AudioComponent }/>
	</Route>
);*/

/*eslint-disable no-unused-vars */
const React = require('react');
const render = require('react-dom').render;
const Router = require('react-router').Router;
const browserHistory = require('react-router').browserHistory;
const AppController = require('./shared/components/app-controller');

module.exports = {
  component: 'div',
  childRoutes: [{
    path: '/',
    component: AppController,
    childRoutes: [require('./routes/signin'), require('./routes/editor'), require('./routes/profile')]
  }]
};

/*render(
  <Router history={browserHistory} routes={rootRoute} />,
  document.getElementById('example')
)*/