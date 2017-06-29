import { profileActionTypes } from '../actions/action-types';

const {
  loadUserTypes,
  saveProfileTypes,
  updateBioType,
  updateInstrumentsType,
  updateProfileType,
} = profileActionTypes;

export const profile = (state = {}, action) => {
  const type = action.type;

  switch (type) {
    case loadUserTypes.success:
      return {
        ...state,
        ...action.result,
      };

    case updateBioType:
      return {
        ...state,
        bio: action.bio,
      };

    case updateInstrumentsType:
      return {
        ...state,
        preferences: {
          ...state.preferences,
          instruments: state.preferences.instruments.indexOf(action.instrument) === -1 ?
            [...state.preferences.instruments, action.instrument] :
            state.preferences.instruments.filter(instrument => instrument !== action.instrument),
        },
      };

    case updateProfileType:
      return {
        ...state,
        ...action.profile,
      };

    case saveProfileTypes.success:
      return {
        ...state,
        isSaved: true,
      };

    default:
      return state;
  }
};