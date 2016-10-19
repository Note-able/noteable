import { profileActionTypes } from '../actions/action-types';

const {
  saveBioTypes,
} = profileActionTypes;

export const validation = (state = {
  isValidBio: true,
}, action) => {
  const type = action.type;

  switch (type) {
    case saveBioTypes.error:
      return {
        ...state,
        isValidBio: false,
      };

    case saveBioTypes.success:
      return {
        ...state,
        isValidBio: true,
      };

    default:
      return state;
  }
};
