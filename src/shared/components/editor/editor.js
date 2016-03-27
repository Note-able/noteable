'use strict';

const React = require('react');
const Section= require('./section');
const AJAX = require('../../ajax');
import { createStore } from 'redux';
const store = createStore(require('../../stores/store'));
import { connect } from 'react-redux';
import { initializeEditor } from './actions/editor-actions';

class EditorComponent extends React.Component {
  constructor (props, context) {
    super(props, context);

    console.log('editor created');
    this.sections = 0;
    this.lines = 0;
    this.state = { };
  }

  componentDidMount () {
    //setTimeout(this.submitRevision.bind(this), 1000);
    const sectionData = [this.addSection(this.sections, 'text')];
    this.props.dispatch(initializeEditor(sectionData));
  }

  addSection (sectionNumber, type) {
    return { sectionId : sectionNumber, type: type, lineData: [] };
  }

  newTextLine (id, text) {
    return { lineId: id, text: text, type: 'text' }
  }

  newRecordingLine (id) {
    return { lineId: id, type: 'recording'}
  }

  submitRevision () {
    // const data = sections.map((section) => )
    console.log('submitting revision');
    const sectionContents = [];
    for (const section in this.refs) {
      const sectionContent = this.refs[section].getDataForPost();
      sectionContents.push(sectionContent);
    }
    console.log(sectionContents);
    const postBody = { sectionContents: sectionContents };
    AJAX.Post(`/document/${this.props.routeParams.documentId}`, JSON.stringify(postBody), (response) => this.updated(JSON.parse(response)));
  }

  updated (response) {
    console.log(response);
  }

  render () {
    const sectionElements = this.props.sectionData.map((section) => {
      return (<Section
        sectionId = { section.sectionId }
        key={ section.sectionId }
        ref={`section${ section.sectionId }`}
        section = { section }
        lines = { this.lines }
        addSection = { this.addSection.bind(this) }
        newTextLine = { this.newTextLine }
        newRecordingLine = { this.newRecordingLine }
        dispatch = { this.props.dispatch }>
        </Section>);
    });
    return (
      <div className="editor" contentEditable="false">
      <button className="submitButton" onClick={this.submitRevision.bind(this)}> Submit Revision</button>
        { sectionElements }
      </div>);
  }
}

EditorComponent.propTypes = {
  sectionData: React.PropTypes.arrayOf(React.PropTypes.shape({
    sectionId: React.PropTypes.number.isRequired,
    type: React.PropTypes.string,
  }).isRequired).isRequired
}

function mapStateToProps(state) {
  return { sectionData: state.editor.sectionData ? state.editor.sectionData : [] }
}
const Editor = connect(mapStateToProps)(EditorComponent);

module.exports = Editor;