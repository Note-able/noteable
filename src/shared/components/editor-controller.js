'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const Section = require('./editor/section');

module.exports = class EditorController extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.sections = 0;
  }

  render () {
    ++this.sections;
    return (
    <div className="editor" contentEditable="false">
      <Section sectionId={this.sections}></Section>
    </div>
    );
  }
}
