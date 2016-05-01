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

    _this.sections = 0;
    _this.lines = 0;
    _this.state = {};
    return _this;
  }

  _createClass(EditorComponent, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      if (this.props.routeParams.documentId) {
        AJAX.Get(`/document/${ this.props.routeParams.documentId }`, response => {
          const sectionData = JSON.parse(JSON.parse(response).contents).sectionData;
          sectionData[0] = Object.assign({}, sectionData[0], { selectedIndex: 0, selectedLine: sectionData[0].lineData[0] });
          this.props.dispatch(initializeEditor(sectionData));
        });
      } else {
        const sectionData = [this.addSection(this.sections, 'text')];
        this.props.dispatch(initializeEditor(sectionData));
      }
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
      const sectionContents = [];
      for (const section in this.refs) {
        const sectionContent = this.refs[section].getDataForPost();
        sectionContents.push(sectionContent);
      }

      const postBody = { sectionData: sectionContents };
      AJAX.PostJSON(`/document/${ this.props.routeParams.documentId }`, postBody, response => this.updated(JSON.parse(response)));
    }
  }, {
    key: 'updated',
    value: function updated(response) {
      //TODO: do something with the successful response
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
          dispatch: this.props.dispatch,
          submitRevision: this.submitRevision.bind(this) });
      });
      return React.createElement(
        'div',
        { className: 'editor', contentEditable: 'false' },
        React.createElement(
          'button',
          { className: 'submitButton', onClick: this.submitRevision.bind(this) },
          ' Submit Revision'
        ),
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