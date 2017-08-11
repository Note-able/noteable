import React from 'react';
import ReactDOM from 'react-dom';
import { Route } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';

import App from '../shared/pages/app';

const node = document.getElementById('react-app');

ReactDOM.render(
  <div>
    <Router>
      <div className="app-container">
        <Route exact path="/" component={App} />
      </div>
    </Router>
  </div>
 , node);
