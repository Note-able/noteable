import { editorActionTypes } from './action-types';

const {
  addChordType,
  addLineType,
  addSectionType,
  defaultEditorType,
  deleteLineType,
  moveChordsType,
  updateLinesType,
  updateSelectedType,
  updateTextType,
} = editorActionTypes;

export const editorActions = {
  initializeEditor: (sectionData) => ({
    type: defaultEditorType,
    sectionData,
  }),
  addSection: () => ({
    type: addSectionType,
  }),
  updateLines: (sectionId, lineActions, selectedIndex, offset) => ({
    type: updateLinesType,
    sectionId,
    lineActions,
    selectedIndex,
    offset,
  }),
  addLine: (sectionId, lineId, index, type, text, shouldUpdateIndex = true, offset = 0) => ({
    type: addLineType,
    lineType: type,
    sectionId,
    lineId,
    index,
    text,
    shouldUpdateIndex,
    offset,
  }),
  deleteLine: (sectionId, index) => ({
    type: deleteLineType,
    sectionId,
    index,
  }),
  updateText: (sectionId, lineId, text, offset) => ({
    type: updateTextType,
    sectionId,
    lineId,
    text,
    offset,
  }),
  updateSelected: (sectionId, index, offset) => ({
    type: updateSelectedType,
    sectionId,
    index,
    offset,
  }),
  addChord: (sectionId, lineId, text, index, updateSelectedFunction) => ({
    type: addChordType,
    sectionId,
    lineId,
    text,
    index,
    updateSelectedFunction,
  }),
  moveChords: (sectionId, lineId, index, offset) => ({
    type: moveChordsType,
    sectionId,
    lineId,
    index,
    offset,
  }),
};
