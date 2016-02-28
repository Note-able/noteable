'use strict';

const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');
const Section = require('./editor/section');

module.exports = class EditorController extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.sections = 0;
    const sectionData = [this.addSection(this.sections, 'text')]
    this.state = { sectionData: sectionData };
  }

  newSection (sectionNumber, type) {
    return { sectionId : sectionNumber, type: type };
  }

  addSection (type) {
    return type;
  }

  render () {
    const sectionElements = this.state.sectionData.map((section) => {
      return (<Section sectionId = { section.sectionId } sectionType = { section.type } addSection = { this.addSection.bind(this) }></Section>);
    });
    return (
    <div className="editor" contentEditable="false">
      { sectionElements }
    </div>
    );
  }
}
