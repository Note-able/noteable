import { Editor, EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { stateFromHTML } from 'draft-js-import-html';
import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { EventsFeed } from '../';

export default class Newsfeed extends Component {
  static propTypes = {
    activeTab: PropTypes.string,
  };

  renderFeed() {
    switch (this.props.activeTab) {
      case '/events':
        return (
          <EventsFeed />
        );
    }
  }

  render() {
    return (
      <div>
        {this.renderFeed()}
        {this.props.children}
      </div>
    );
  }
}
