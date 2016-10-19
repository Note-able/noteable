import { createAsyncActionTypes } from './util';

export const profileActionTypes = {
  loadUserTypes: createAsyncActionTypes('PROFILE/LOAD_USER'),
  saveBioTypes: createAsyncActionTypes('PROFILE/BIO'),
  saveProfileTypes: createAsyncActionTypes('PROFILE/SAVE_PROFILE'),
  updateBioType: 'PROFILE/UPDATE_BIO',
  updateInstrumentsType: 'PROFILE/UPDATE_INSTRUMENTS',
};

export const editorActionTypes = {
  addChordType: 'EDITOR/ADD_CHORD',
  addLineType: 'EDITOR/ADD_LINE',
  addSectionType: 'EDITOR/ADD_SECTION',
  defaultEditorType: 'EDITOR/DEFAULT_EDITOR',
  deleteLineType: 'EDITOR/DELETE_LINE',
  moveChordsType: 'EDITOR/MOVE_CHORDS',
  updateLinesType: 'EDITOR/UPDATE_LINES',
  updateSelectedType: 'EDITOR/UPDATE_SELECTED',
  updateTextType: 'EDITOR/UPDATE_TEXT',
};
