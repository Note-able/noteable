var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const React = require('react');
const Section = require('./section');

module.exports = function (_React$Component) {
  _inherits(Editor, _React$Component);

  function Editor(props, context) {
    _classCallCheck(this, Editor);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Editor).call(this, props, context));

    _this.sections = 0;
    const sectionData = [_this.addSection(_this.sections, 'text')];
    _this.state = { sectionData: sectionData };
    return _this;
  }

  _createClass(Editor, [{
    key: 'newSection',
    value: function newSection(sectionNumber, type) {
      return { sectionId: sectionNumber, type: type };
    }
  }, {
    key: 'addSection',
    value: function addSection(type) {
      return type;
    }
  }, {
    key: 'render',
    value: function render() {
      const sectionElements = this.state.sectionData.map(section => {
        return React.createElement(Section, { sectionId: section.sectionId, sectionType: section.type, addSection: this.addSection.bind(this) });
      });
      return React.createElement(
        'div',
        { className: 'editor', contentEditable: 'false' },
        sectionElements
      );
    }
  }]);

  return Editor;
}(React.Component);