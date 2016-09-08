import { React, Component, PropTypes } from 'react';

const Section = require('./section');
const AJAX = require('../../ajax');

class EditorComponent extends Component {
  static propTypes = {
    routeParams: PropTypes.shape({
      documentId: PropTypes.string,
    }).isRequired,
    sectionData: PropTypes.arrayOf(PropTypes.shape({
      sectionId: PropTypes.number.isRequired,
      type: PropTypes.string,
    }).isRequired).isRequired,
    sectionDispatch: PropTypes.shape({
      initializeEditor: PropTypes.func.isRequired,
    }).isRequired,
  };

  constructor(props, context) {
    super(props, context);

    this.sections = 0;
    this.lines = 0;
    this.state = { };
  }

  componentDidMount() {
    if (this.props.routeParams.documentId) {
      AJAX.Get(`/document/${this.props.routeParams.documentId}`, (response) => {
        const sectionData = JSON.parse(JSON.parse(response).contents).sectionData;
        sectionData[0] = Object.assign({}, sectionData[0], { selectedIndex: 0, selectedLine: sectionData[0].lineData[0] });
        this.props.sectionDispatch.initializeEditor(sectionData);
      });
    } else {
      const sectionData = [this.addSection(this.sections, 'text')];
      this.props.sectionDispatch.initializeEditor(sectionData);
    }
  }

  addSection(sectionNumber, type) {
    return { sectionId: sectionNumber, type, lineData: [] };
  }

  newTextLine(id, text) {
    return { lineId: id, text, type: 'text' };
  }

  newRecordingLine(id) {
    return { lineId: id, type: 'recording' };
  }

  submitRevision() {
    const sectionContents = [];

    this.refs.map(section => {
      const sectionContent = this.refs[section].getDataForPost();
      sectionContents.push(sectionContent);
      return null;
    });

    const postBody = { sectionData: sectionContents };
    AJAX.PostJSON(`/document/${this.props.routeParams.documentId}`, postBody, (response) => this.updated(JSON.parse(response)));
  }

  /** updated (response) {
    //TODO: do something with the successful response
  }**/

  render() {
    const sectionElements = this.props.sectionData.map(section => (
      <Section
        sectionId={section.sectionId}
        sectionDispatch={this.props.sectionDispatch}
        key={section.sectionId}
        ref={`section${section.sectionId}`}
        section={section}
        lines={this.lines}
        addSection={this.addSection}
        newTextLine={this.newTextLine}
        newRecordingLine={this.newRecordingLine}
        submitRevision={() => this.submitRevision}
        suppressContentEditableWarning
      />
    ));
    return (
      <div className="editor" contentEditable="false">
        <button className="submitButton" onClick={() => this.submitRevision}> Submit Revision</button>
        { sectionElements }
      </div>);
  }
}

module.exports = EditorComponent;
