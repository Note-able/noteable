import { profileActionTypes } from './action-types';
import checkStatus from './util';

const {
  loadUserTypes,
  saveBioTypes,
  saveProfileTypes,
  updateBioType,
  updateInstrumentsType,
  updateProfileType,
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

  validateBio: (bio) => ((dispatch) => {
    if (bio.length > 5000) {
      dispatch({
        type: saveBioTypes.error,
      });

      return;
    }

    dispatch({
      type: saveBioTypes.success,
    });
  }),

  saveProfile: (profile) => ((dispatch) => {
    dispatch({
      type: saveProfileTypes.processing,
    });

    window.fetch(`/user/profile/${profile.id}`,
      {
        credentials: 'same-origin',
        method: 'POST',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(profile),
      }).then(checkStatus, () => {
        dispatch({
          type: saveProfileTypes.error,
        });
      })
      .then(checkStatus, () => {
        console.log('bad status code returned');
      })
      .then(() => {
        dispatch({
          type: saveProfileTypes.success,
          profile,
        });
      }, () => {
        dispatch({
          type: saveProfileTypes.error,
        });
      });
  }),

  updateBio: (bio) => ({
    type: updateBioType,
    bio,
  }),

  updateInstruments: (instrument) => ({
    type: updateInstrumentsType,
    instrument,
  }),

  updateProfile: (profile) => ({
    type: updateProfileType,
    profile,
  }),
};
