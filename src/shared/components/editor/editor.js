const React = require('react');
const Section= require('./section');

module.exports = class Editor extends React.Component {
  constructor (props, context) {
    super(props, context);

    this.sections = 0;
    const sectionData = [this.addSection(this.sections, 'text')];
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
      </div>);
  }
}