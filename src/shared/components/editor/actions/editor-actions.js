
export const initializeEditor = (sectionData) => {
  return {
    type: 'DEFAULT_EDITOR',
    sectionData: sectionData
  }
}

export const addSection = (section) => {
  return {
    type: 'ADD_SECTION'
  }
}

export const updateLines = (sectionId, lineActions, selectedIndex, offset) => {
  return {
    type: 'UPDATE_LINES',
    sectionId: sectionId,
    lineActions: lineActions,
    selectedIndex: selectedIndex,
    offset: offset
  };
}

export const addLine = (sectionId, lineId, index, type, text, shouldUpdateIndex = true) => {
  return {
    type: 'ADD_LINE',
    sectionId: sectionId,
    lineId: lineId,
    index: index,
    lineType: type,
    text: text,
    shouldUpdateIndex: shouldUpdateIndex
  };
}

export const deleteLine = (sectionId, index) => {
  return {
    type: 'DELETE_LINE',
    sectionId: sectionId,
    index: index
  };
}

export const updateText = (sectionId, lineId, text, offset, updateTextFunction) => {
  return {
    type: 'UPDATE_TEXT',
    sectionId: sectionId,
    lineId: lineId,
    text: text,
    offset: offset,
    updateTextFunction: updateTextFunction
  };
}

export const updateSelected = (sectionId, index, offset) => {
  return {
    type: 'UPDATE_SELECTED',
    sectionId: sectionId,
    index: index,
    offset: offset
  }
}