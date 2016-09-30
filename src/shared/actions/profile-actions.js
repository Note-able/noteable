import { profileActionTypes } from './action-types';
import checkStatus from './util';

const {
  loadUserTypes,
  savePreferencesTypes,
  updateInstrumentsType,
} = profileActionTypes;

export const profileActions = {
  loadUser: () => (dispatch => {
    window.fetch('/me',
      {
        credentials: 'same-origin',
        method: 'GET',
        headers: {
          accept: 'application/json',
        },
      })
      .then(checkStatus, () => {
        dispatch({
          type: loadUserTypes.error,
        });
      })
      .then(response => response.json())
      .then(result => {
        dispatch({
          type: loadUserTypes.success,
          result,
        });
      }, () => {
        dispatch({
          type: loadUserTypes.error,
        });
      });
  }),

  savePreferences: (userId, preferences) => ((dispatch) => {
    dispatch({
      type: savePreferencesTypes.processing,
    });

    window.fetch(`/user/preferences?userId=${userId}`,
      {
        method: 'POST',
        accept: 'application/json',
        preferences,
      }).then(checkStatus, () => {
        dispatch({
          type: savePreferencesTypes.error,
        });
      })
      .then(response => response.json())
      .then(result => {
        dispatch({
          type: savePreferencesTypes.success,
          result,
        });
      }, () => {
        dispatch({
          type: savePreferencesTypes.error,
        });
      });
  }),

  updateInstruments: (instrument) => ({
    type: updateInstrumentsType,
    instrument,
  }),
};
