'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _userService = require('./user-service');

Object.defineProperty(exports, 'UserService', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_userService).default;
  }
});

var _messageService = require('./message-service');

Object.defineProperty(exports, 'MessageService', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_messageService).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }