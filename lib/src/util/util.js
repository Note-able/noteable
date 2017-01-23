'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.validateEmail = validateEmail;
exports.validatePassword = validatePassword;
exports.validateProfile = validateProfile;
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

function validateProfile(profile) {
  var invalidState = {};
  if (profile == null) {
    return { profile: 'null profile' };
  }

  if (profile.firstName == null || profile.firstName.length === 0) {
    invalidState = _extends({}, invalidState, { firstName: 'Required field' });
  }

  if (profile.lastName == null || profile.lastName.length === 0) {
    invalidState = _extends({}, invalidState, { lastName: 'Required field' });
  }

  if (profile.zipCode.length != 0 && profile.zipCode.match(/^\d{5}$/) == null) {
    invalidState = _extends({}, invalidState, { zipCode: 'Invalid zip' });
  }

  return invalidState;
}