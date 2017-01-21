'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
function validateEmail(email) {
  if (email == null || email === '') {
    return false;
  }

  return email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

function validatePassword(password) {
  if (password == null || password === '') {
    return false;
  }

  return password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
}