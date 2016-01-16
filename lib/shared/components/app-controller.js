'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require("react");
var Router = require("react-router");

module.exports = (function (_React$Component) {
  _inherits(AppController, _React$Component);

  function AppController() {
    _classCallCheck(this, AppController);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(AppController).apply(this, arguments));
  }

  _createClass(AppController, [{
    key: "renderGrid",
    value: function renderGrid() {
      return React.createElement(
        "div",
        null,
        React.createElement("div", { className: "testing-vertical" }),
        React.createElement("div", { className: "testing-horizontal" })
      );
    }
  }, {
    key: "render",
    value: function render() {
      return React.createElement(
        "div",
        null,
        React.createElement("link", { href: "/css/post.css", rel: "stylesheet", type: "text/css" }),
        React.createElement("link", { href: "/css/bundle.css", rel: "stylesheet", type: "text/css" }),
        React.createElement(
          "div",
          { id: "app-container" },
          React.createElement(
            "div",
            { className: "nav-button-container" },
            React.createElement(
              "div",
              { className: "nav-button-container__bar" },
              React.createElement(
                "li",
                { id: "home", className: "nav-button", onclick: "window.location.href = \"/\"" },
                React.createElement("a", { href: "/" })
              ),
              React.createElement(
                "li",
                { id: "showPosts", className: "nav-button", onclick: "window.location.href = '/Tech'" },
                React.createElement("a", { href: "/Tech" })
              ),
              React.createElement(
                "li",
                { id: "showResume", className: "nav-button" },
                React.createElement("a", { href: "/resume" })
              ),
              React.createElement(
                "li",
                { id: "showGallery", className: "nav-button" },
                React.createElement("a", { href: "/photos/gallery" })
              ),
              React.createElement(
                "li",
                { id: "showAdventure", className: "nav-button", onclick: "window.location.href = '/Adventure'" },
                React.createElement("a", { href: "/Adventure" })
              )
            )
          ),
          this.props.children
        )
      );
    }
  }]);

  return AppController;
})(React.Component);