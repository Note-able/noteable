'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var Router = require('react-router');

module.exports = class EditorController extends React.Component {
	constructor(props, context) {
    	super(props, context);

		this.sections = 0;
	}

	render() {
		++this.sections;
		return (
		<main className="editor" contentEditable="false">
			<Section sectionId={this.sections}></Section>
		</main>
		);
	}
}

class Section extends React.Component {
	constructor(props, context) {
    	super(props, context);

    	var lines = 0;
		this.lines = lines;
		this.state = { lineData: [this.newLine(lines, '')] };
	}

	newLine(id, text) {
		return { lineId: id, text: text }
	}

	handleEnter(text, lineId) {
		++this.lines;
		var lineData = this.state.lineData;
		var newLine = this.newLine(this.lines, text)
		if(lineId !== lineData.length) {
			var index = lineData.findIndex(function(e, i, a) { return e.lineId === lineId });
			lineData.splice(index + 1, 0, newLine);
		} else {
			lineData.push(newLine);
		}
		this.setState({ lineData: lineData });
	}

	render() {
		var lineElements = this.state.lineData.map(function(line){
			return (<Line key={ line.lineId } lineId={ line.lineId } text={ line.text } handleEnter={ this.handleEnter.bind(this) }></Line>);
		}.bind(this));
		return (
		<div className="section" name={ this.props.sectionId }>
			{ lineElements }
		</div>
		);
	}
}

class Line extends React.Component {
	constructor(props, context) {
    	super(props, context);

    	this.state = { text: props.text, selected: 'selected' };
    	this.enterPressed = false;
    	this.keyMap = [];
	}

	componentDidMount() {
		ReactDOM.findDOMNode(this.refs.line).focus(); 
	}

	componentDidUpdate() {
		if(!this.enterPressed) {
			this.setCaretPosition.bind(this)();
		} else {
			this.enterPressed = false;
		}
	}

	setCaretPosition() {
		var element = ReactDOM.findDOMNode(this.refs.line);
		if(element.childNodes.length > 0 && this.isFocused && !this.isFocusing)
		{
			var selection = window.getSelection();
			var range = document.createRange();
			range.setStart(element.childNodes[0], this.state.caretOffset);
			selection.removeAllRanges();
			selection.addRange(range);
		} else if(this.isFocusing) {
			this.isFocusing = false;
		}
	}

	handleKeyPress(e) {
		e.preventDefault();
		var charCode = e.which || e.keyCode;
    	var charTyped = String.fromCharCode(charCode);
    	var newText = this.state.text + charTyped;
    	var offset = window.getSelection().focusOffset + 1;
		this.setState({ text: newText, caretOffset: offset });
	}

	handleKeyDown(e) {
		console.log('keydown');
		console.log(e);
		this.keyMap[e.keyCode] = e.type == 'keydown';
		if(e.keyCode === 13)
		{
			this.enterPressed = true;
			var selectionOffset = window.getSelection().baseOffset;
			var movedText = this.state.text.substring(selectionOffset, this.state.text.length);
			var remainingText = this.state.text.substring(0, selectionOffset);
			this.props.handleEnter(movedText, this.props.lineId);
			this.setState({ text: remainingText });
		}
	}

	handleKeyUp (e){
		this.keyMap[e.keyCode] = e.type == 'keydown';
		if (e.keyCode === 8) {
			var newText = ReactDOM.findDOMNode(this.refs.line).innerHTML;
			this.setState({ text: newText });
		}
	}

	handleClick(e) {
		console.log("clicked");
		var el = ReactDOM.findDOMNode(this.refs.line);
		el.focus(); 
	}

	handleOnFocus() {
		this.isFocused = true;
	    this.isFocusing = true;
		this.setState({ selected: 'selected' });
	}

	handleOnBlur() {
		this.isFocused = false;
		this.setState({ selected: '' });
	}

	render() {
		return (
			<p 
			className={ "editor-line " + this.state.selected }
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
