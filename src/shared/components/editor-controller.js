'use strict';

var React = require(`react`);
var ReactDOM = require(`react-dom`);
var Router = require(`react-router`);

module.exports = class EditorController extends React.Component {
	constructor (props, context) {
   super(props, context);

		  this.sections = 0;
	}

	render () {
		  ++this.sections;
		  return (
		<main className="editor" contentEditable="false">
			<Section sectionId={this.sections}></Section>
		</main>
		);
	}
}

class Section extends React.Component {
	constructor (props, context) {
   super(props, context);

   var lines = 0;
 		 var lineData = [this.newLine(lines, ``)];
		  this.lines = lines;
		  this.state = { lineData: lineData, selectedLine: lineData[0] };
	}

	newLine (id, text) {
		  return { lineId: id, text: text }
	}

	handleEnter (text, lineId) {
		  ++this.lines;
		  var lineData = this.state.lineData;
		  var newLine = this.newLine(this.lines, text)
		  var selected = this.state.selected;
		  if(lineId !== lineData[lineData.length - 1].lineId) {
			  var index = lineData.findIndex(function (e, i, a) { return e.lineId === lineId });
			  lineData.splice(index + 1, 0, newLine);
			  selected = lineData[index + 1];
		} else {
			  lineData.push(newLine);
			  selected = lineData[lineData.length - 1];
		}
		  this.setState({ lineData: lineData, selectedLine: selected});
	}

	handleDelete () {

	}

	handleUpArrow (offset, lineId) {
		  if(this.state.lineData[0].lineId !== lineId){
			  var index = this.state.lineData.findIndex(function (e, i, a) { return e.lineId === lineId });
			  this.setState({ selectedLine: this.state.lineData[index - 1], offset: offset });
		}
	}

	handleDownArrow (offset, lineId) {
		  if(this.state.lineData[this.state.lineData.length - 1].lineId !== lineId){
			  var index = this.state.lineData.findIndex(function (e, i, a) { return e.lineId === lineId });
			  this.setState({ selectedLine: this.state.lineData[index + 1], offset: offset });
		}
	}

	render () {
		  var lineElements = this.state.lineData.map(function (line){
			  var selected = line.lineId === this.state.selectedLine.lineId;
			  var offset = selected ? this.state.offset : null;
			  return (<Line key={ line.lineId } lineId={ line.lineId } text={ line.text } selected={ selected } offset={ offset }
				handleEnter={ this.handleEnter.bind(this) }
				handleDelete={ this.handleDelete.bind(this) }
				handleUpArrow={ this.handleUpArrow.bind(this) }
				handleDownArrow={ this.handleDownArrow.bind(this) }></Line>);
		}.bind(this));
		  return (
		<div className="section" ref="section" name={ this.props.sectionId }>
			{ lineElements }
		</div>
		);
	}
}

class Line extends React.Component {
	constructor (props, context) {
   super(props, context);

   var selected = this.props.selected ? `selected` : ``;
   this.state = { text: this.props.text, selected: selected, caretOffset: 0 };
   this.enterPressed = false;
   this.keyMap = [];
	}

	componentDidMount () {
		  if(this.props.selected)
			  ReactDOM.findDOMNode(this.refs.line).focus();
	}

	componentDidUpdate () {
		  if (this.shouldFocus) {
			  ReactDOM.findDOMNode(this.refs.line).focus();
			  this.shouldFocus = false;
		}
		  if(!this.enterPressed && this.isFocused) {
			  this.setCaretPosition.bind(this)();
		} else {
			  this.enterPressed = false;
		}
	}

	componentWillReceiveProps (nextProps) {
		  var selected = nextProps.selected ? `selected` : ``;
		  var offset = nextProps.offset == null ? 0 : nextProps.offset;
		  this.shouldFocus = nextProps.selected;
		  this.setState({ selected: selected, caretOffset: offset });
	}

	setCaretPosition () {
		  var element = ReactDOM.findDOMNode(this.refs.line);
		  if(element.childNodes.length !== 0) {
			  var selection = window.getSelection();
			  var range = document.createRange();
			  range.setStart(element.childNodes[0], this.state.caretOffset);
			  selection.removeAllRanges();
			  selection.addRange(range);
		}
	}

	handleKeyPress (e) {
		  e.preventDefault();
		  var charCode = e.which || e.keyCode;
   var charTyped = String.fromCharCode(charCode);
   var newText = this.state.text + charTyped;
   var offset = window.getSelection().focusOffset + 1;
		  this.setState({ text: newText, caretOffset: offset });
	}

	handleKeyDown (e) {
		  this.keyMap[e.keyCode] = e.type === `keydown`;
		  if(e.keyCode === 13) { //enter
			  this.enterPressed = true;
			  var selectionOffset = window.getSelection().baseOffset;
			  var movedText = this.state.text.substring(selectionOffset, this.state.text.length);
			  var remainingText = this.state.text.substring(0, selectionOffset);
			  this.props.handleEnter(movedText, this.props.lineId);
			  this.setState({ text: remainingText });
		} else if(e.keyCode === 38) { //upArrow
			  var selectionOffset = window.getSelection().baseOffset;
			  this.props.handleUpArrow(selectionOffset, this.props.lineId);
		} else if(e.keyCode === 40) { //downArrow
			  var selectionOffset = window.getSelection().baseOffset;
			  this.props.handleDownArrow(selectionOffset, this.props.lineId);
		}
	}

	handleKeyUp (e){
		  this.keyMap[e.keyCode] = e.type === `keydown`;
		  if (e.keyCode === 8) { //delete
			  var newText = ReactDOM.findDOMNode(this.refs.line).innerHTML;
			  this.setState({ text: newText });
		}
	}

	handleClick (e) {
		  console.log(`clicked`);
		  if(this.state.selected === ``) {
			  var selectionOffset = window.getSelection().baseOffset;
			  this.setState({ selected: `selected`, caretOffset: selectionOffset });
		}
	}

	handleOnFocus () {
		  this.isFocused = true;
	}

	handleOnBlur () {
		  this.isFocused = false;
		  this.setState({ selected: `` });
	}

	render () {
		  return (
			<p
			className={ `editor-line ` + this.state.selected }
			name={ this.props.lineId }
			ref="line"
			onKeyPress={ this.handleKeyPress.bind(this) }
			onKeyDown={ this.handleKeyDown.bind(this) }
			onKeyUp={ this.handleKeyUp.bind(this) }
			onClick={ this.handleClick.bind(this) }
			onFocus={ this.handleOnFocus.bind(this) }
			onBlur={ this.handleOnBlur.bind(this) }
			contentEditable="true">
				{ this.state.text}
			</p>
		);
	}
}
