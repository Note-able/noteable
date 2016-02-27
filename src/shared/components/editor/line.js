'use strict';

const React = require('react');
const ReactDOM = require('react-dom');

module.exports = class Line extends React.Component {
  constructor (props, context) {
    super(props, context);

    const selected = this.props.selected ? 'selected' : '';
    this.state = { text: this.props.text, selected: selected };
    this.enterPressed = false;
    this.keyMap = [];
  }

  componentDidMount () {
    const elem = ReactDOM.findDOMNode(this.refs.line);
    elem.innerHTML = this.props.text;
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

    if(this.props.shouldUpdateText){
      const elem = ReactDOM.findDOMNode(this.refs.line);
      elem.innerHTML = this.props.text;
    }
    if(this.props.selected){
      this.setCaretPosition.bind(this)(this.props.offset);
    }
  }

  setCaretInEmptyDiv () {
    const elem = ReactDOM.findDOMNode(this.refs.line);
    const range = document.createRange();
    range.selectNodeContents(elem);
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }

  componentWillReceiveProps (nextProps) {
    console.log(nextProps);
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

  handleClick (e) {
    console.log('clicked');
    const elem = e.target;
    elem.focus();
    this.props.updateSelected(this.props.lineId);
  }

  render () {
    return (
      <p className="editor-line"
      name={ this.props.lineId }
      ref="line"
      onClick={ this.handleClick.bind(this) }>
      </p>
    );
  }
}
