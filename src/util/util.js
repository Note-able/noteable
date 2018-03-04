export function validateEmail(email) {
  if (email == null || email === '') {
    return false;
  }

  return email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
}

export function validatePassword(password) {
  if (password == null || password === '') {
    return false;
  }

  return password.match(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/);
}

export function validateProfile(profile) {
  let invalidState = {};
  if (profile == null) {
    return { profile: 'null profile' };
  }

  if (profile.firstName == null || profile.firstName.length === 0) {
    invalidState = { ...invalidState, firstName: 'Required field' };
  }

  if (profile.lastName == null || profile.lastName.length === 0) {
    invalidState = { ...invalidState, lastName: 'Required field' };
  }

  if (profile.zipCode.length != 0 && profile.zipCode.match(/^\d{5}$/) == null) {
    invalidState = { ...invalidState, zipCode: 'Invalid zip' };
  }

  return invalidState;
}

export const s4 = () => Math.floor((1 + Math.random()) * 0x10000)
  .toString(16)
  .substring(1);

export const guid = () => `${s4() + s4()}-${s4()}-${s4()}-${
  s4()}-${s4()}${s4()}${s4()}`;
