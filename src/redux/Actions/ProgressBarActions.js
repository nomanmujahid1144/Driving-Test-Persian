import { ACTION_TYPES } from "../ActionTypes/ActionTypes";

export const selectProgressBarState = (selectedState) => {
    // Return an action
    return {
      type: ACTION_TYPES.PROGRESS_BAR_STATE ,
      payload: selectedState
    };
  };