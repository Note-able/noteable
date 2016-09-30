import { profileActionTypes } from '../actions/action-types';

const {
  loadUserTypes,
  savePreferencesTypes,
  updateInstrumentsType,
} = profileActionTypes;

export const profile = (state = {}, action) => {
  const type = action.type;

  switch (type) {
    case loadUserTypes.success:
      return {
        ...state,
        ...action.result,
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
    default:
      return state;
  }
};
