'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const React = require('react');
const Section = require('./section');
const AJAX = require('../../ajax');
import { createStore } from 'redux';
const store = createStore(require('../../stores/store'));
import { connect } from 'react-redux';
import { initializeEditor } from './actions/editor-actions';

let EditorComponent = function (_React$Component) {
  _inherits(EditorComponent, _React$Component);

  function EditorComponent(props, context) {
    _classCallCheck(this, EditorComponent);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(EditorComponent).call(this, props, context));

    console.log('editor created');
    _this.sections = 0;
    _this.lines = 0;
    _this.state = {};
    return _this;
  }

  _createClass(EditorComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      setTimeout(this.submitRevision.bind(this), 1000);
      const sectionData = [this.addSection(this.sections, 'text')];
      this.props.dispatch(initializeEditor(sectionData));
    }
  }, {
    key: 'addSection',
    value: function addSection(sectionNumber, type) {
      return { sectionId: sectionNumber, type: type, lineData: [] };
    }
  }, {
    key: 'newTextLine',
    value: function newTextLine(id, text) {
      return { lineId: id, text: text, type: 'text' };
    }
  }, {
    key: 'newRecordingLine',
    value: function newRecordingLine(id) {
      return { lineId: id, type: 'recording' };
    }
  }, {
    key: 'submitRevision',
    value: function submitRevision() {
      // const data = sections.map((section) => )
      console.log('submitting revision');
      for (const section in this.refs) {
        this.refs[section].getDataForPost();
      }
      //AJAX.Post(`/document/${this.props.routeParams.documentId}`, data, (response) => updated(JSON.parse(response)));
    }
  }, {
    key: 'render',
    value: function render() {
      const sectionElements = this.props.sectionData.map(section => {
        return React.createElement(Section, {
          sectionId: section.sectionId,
          key: section.sectionId,
          ref: `section${ section.sectionId }`,
          section: section,
          lines: this.lines,
          addSection: this.addSection.bind(this),
          newTextLine: this.newTextLine,
          newRecordingLine: this.newRecordingLine,
          dispatch: this.props.dispatch });
      });
      return React.createElement(
        'div',
        { className: 'editor', contentEditable: 'false' },
        sectionElements
      );
    }
  }]);

  return EditorComponent;
}(React.Component);

EditorComponent.propTypes = {
  sectionData: React.PropTypes.arrayOf(React.PropTypes.shape({
    sectionId: React.PropTypes.number.isRequired,
    type: React.PropTypes.string
  }).isRequired).isRequired
};

function mapStateToProps(state) {
  return { sectionData: state.editor.sectionData ? state.editor.sectionData : [] };
}
const Editor = connect(mapStateToProps)(EditorComponent);

module.exports = Editor;