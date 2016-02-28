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
    const element = ReactDOM.findDOMNode(this.refs.line);
    element.innerHTML = this.props.text;
    if(this.props.selected){
      this.setCaretPosition.bind(this)(this.props.offset);
    }
  }

  componentDidUpdate () {
    console.log(`${this.props.lineId} did update`);
    if(this.props.shouldUpdateText){
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

  setCaretInEmptyDiv () {
    const element = ReactDOM.findDOMNode(this.refs.line);
    const range = document.createRange();
    range.selectNodeContents(element);
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
    const element = e.target;
    element.focus();
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
