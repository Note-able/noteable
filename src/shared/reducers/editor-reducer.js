import { editorActionTypes } from '../actions/action-types';

const {
  addChordType,
  addLineType,
  addSectionType,
  defaultEditorType,
  deleteLineType,
  updateLinesType,
  updateSelectedType,
  updateTextType,
} = editorActionTypes;

const editorLine = (state = {}, action) => {
  switch (action.type) {
    case updateTextType:
      /*eslint-disable*/
      if(state.lineId != action.lineId)
        return state;
        
      return Object.assign({},
      state,
      {
        text: action.text,
        updateTextFunction: action.updateTextFunction
      });
    case addLineType:
      return Object.assign({},
      state,
      {
        lineId: action.lineId,
        text: action.text,
        type: action.lineType
      });
    case addChordType:
      if(state.lineId != action.lineId)
        return state;
      else {
        const chords = state.chords || [];
        chords.push({ index: action.index, text: action.text, updateSelectedFunction: action.updateSelectedFunction });
        return Object.assign({},
        state,
        {
          chords: chords,
        });
      }
    default:
      return state;
  }
}

const editorSection = ( state = {}, action) => {
  switch (action.type){
  case addSectionType:
      return {
       lineData: [],
       selectedIndex: 0
     };
  case updateLinesType:
    if(state.sectionId != action.sectionId)
      return state;
    else {
      let lineData = state.lineData;
      for(const lineAction in action.lineActions) {
        lineData = editorSection(state, action.lineActions[lineAction]).lineData;
      }
      
      return Object.assign({},
      state,
      {
        lineData: lineData,
        selectedLine: lineData[action.selectedIndex],
        selectedIndex: action.selectedIndex,
        offset: action.offset
      });
    }
  case updateSelectedType:
    if(state.sectionId != action.sectionId)
      return state;
    else {
      return Object.assign({},
      state,
      {
        selectedIndex: action.index,
        selectedLine: state.lineData[action.index],
        offset: action.offset
      });
    }
     /* Line Reducer */
  case updateTextType:
    if(state.sectionId != action.sectionId)
      return state;
    /*eslint-disable*/
    return Object.assign({},
    state,
    {
      lineData: state.lineData.map(line => editorLine(line, action)),
      offset: action.offset
    });
  case addChordType:
    if(state.sectionId != action.sectionId)
      return state;
    /*eslint-disable*/
    return Object.assign({},
    state,
    {
      lineData: state.lineData.map(line => editorLine(line, action)),
    });
  case addLineType:
    if(state.sectionId != action.sectionId)
      return state;
    else {
      const lineData = state.lineData;
      lineData.splice(action.index, 0, editorLine(undefined, action))
      if(action.shouldUpdateIndex)
      {
        return Object.assign({},
        state,
        {
          lineData: lineData,
          selectedIndex: action.index,
          selectedLine: lineData[action.index]
        });
      } else {
        return Object.assign({},
        state,
        {
          lineData: lineData
        });
      }
    }
  case deleteLineType:
    if(state.sectionId != action.sectionId)
      return state;
    else {
      const lineData = state.lineData;
      lineData.splice(action.index, 1)
      return Object.assign({},
      state,
      {
        lineData: lineData,
        selectedIndex: action.index - 1,
        selectedLine: lineData[action.index - 1]
      });
    }
  default:
    return state;
  }
}

export const editor = (state = { sectionData: []}, action) => {
  switch (action.type) {
    case defaultEditorType:
      return {
        sectionData: action.sectionData
      };
    /* Section Reducer */
    case updateLinesType:
      return Object.assign({},
      state,
      {
        sectionData: state.sectionData.map(section => editorSection(section, action))
      });
    /*eslint-disable*/
    case addSectionType:
      return Object.assign({},
      state,
      {
        sectionData: [...state.sectionData, editorSection(undefined, action)]
      });
    /* Line Reducer */
    case updateTextType:
    case addLineType:
    case deleteLineType:
    case updateSelectedType:
    case addChordType:
    return Object.assign({},
    state,
    {
      sectionData: state.sectionData.map(section => editorSection(section, action))
    });
   default:
    return state;
  }
};
