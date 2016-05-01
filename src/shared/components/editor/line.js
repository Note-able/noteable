'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

class Line extends React.Component {
  constructor (props, context) {
    super(props, context);
    console.log('line ctor');
    const selected = this.props.selected ? 'selected' : '';
    this.state = {};
    this.enterPressed = false;
    this.keyMap = [];
  }

  componentDidMount () {
    const element = ReactDOM.findDOMNode(this.refs.line);
    element.innerHTML = this.props.text;
    if(this.props.selected){
      this.setCaretPosition.bind(this)(this.props.offset);
    }
  }

  componentDidUpdate (prevProps) {
    console.log(`${this.props.lineId} did update`);

    if (this.props.lineId === prevProps.lineId
      && this.props.text === prevProps.text
      && this.props.selected === prevProps.selected
      && this.props.offset === prevProps.offset
      && this.props.shouldUpdateText === prevProps.shouldUpdateText) {
      return;
    }

    if(this.props.updateTextFunction){
      const element = ReactDOM.findDOMNode(this.refs.line);
      this.props.updateTextFunction(element, this.props.text);
    }
    if(this.props.selected){
      this.setCaretPosition.bind(this)(this.props.offset);
    }
  }

  componentWillUnmount () {
    if(this.props.handleDelete) {
      this.props.handleDelete(ReactDOM.findDOMNode(this.refs.line).innerHTML);
    }
  }

  getDataForPost () {
    console.log(this.getLineContent());
    return this.getLineContent();
  }

  getLineContent () {
    const element = ReactDOM.findDOMNode(this.refs.line);
    return { lineId: this.props.lineId, type: this.props.type, text: element.innerHTML };
  }

  setCaretInEmptyDiv () {
    const element = ReactDOM.findDOMNode(this.refs.line);
    const range = document.createRange();
    range.selectNodeContents(element);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  setCaretPosition (position) {
    const element = ReactDOM.findDOMNode(this.refs.line);
    if(element.childNodes.length !== 0) {
      const caretPos = position > element.firstChild.length ? element.firstChild.length : position;
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(element);
      range.collapse(false);
      range.setStart(element.firstChild, caretPos);
      range.setEnd(element.firstChild, caretPos);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      this.setCaretInEmptyDiv.bind(this)();
    }
  }

  handleClick () {
    this.props.updateSelected(this.props.lineId);
  }

  render () {
    return (
      <p
      className={ 'editor-line' }
      name={ this.props.lineId }
      ref="line"
      onClick={ this.handleClick.bind(this) }>
      </p>
    );
  }
}

Line.propTypes = {
  lineId: React.PropTypes.number.isRequired,
  updateSelected: React.PropTypes.func.isRequired,
  handleDelete: React.PropTypes.func.isRequired,
  type: React.PropTypes.string,
  updateTextFunction: React.PropTypes.func,
  offset: React.PropTypes.number,
}

module.exports = Line;