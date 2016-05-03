'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

const AJAX = require('../ajax');
const React = require('react');
const ReactDOM = require('react-dom');
const Router = require('react-router');

module.exports = function (_React$Component) {
  _inherits(SongsController, _React$Component);

  function SongsController(props, context) {
    _classCallCheck(this, SongsController);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(SongsController).call(this, props, context));

    const songData = [{ title: 'song1', dateCreated: 'Just Now' }, { title: 'song2', dateCreated: 'January 1st, 2016' }];
    _this.state = { songData: songData };
    return _this;
  }

  _createClass(SongsController, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      AJAX.Get('songs/user', response => this.loadSongs(JSON.parse(response)));
    }
  }, {
    key: 'loadSongs',
    value: function loadSongs(songJson) {
      const newSongData = songJson.map(song => {
        return { title: song.title, dateCreated: song.date };
      });
      this.setState({ songData: newSongData });
    }
  }, {
    key: 'render',
    value: function render() {
      return React.createElement(
        'div',
        null,
        React.createElement(
          'div',
          { className: 'button-container' },
          React.createElement(
            'form',
            { action: '/editor' },
            React.createElement('input', { className: 'create-song', type: 'submit', value: 'Create' })
          )
        ),
        React.createElement(
          'div',
          { className: 'song-list' },
          this.state.songData.map(song => {
            return React.createElement(
              'div',
              { className: 'song-list-item' },
              React.createElement(
                'div',
                { className: 'song-list-item-title' },
                song.title
              ),
              React.createElement(
                'div',
                { className: 'song-list-item-date' },
                song.dateCreated
              )
            );
          })
        )
      );
    }
  }]);

  return SongsController;
}(React.Component);