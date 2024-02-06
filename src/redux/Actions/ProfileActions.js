import { ACTION_TYPES } from "../ActionTypes/ActionTypes";

export const adminLogin = (selectedState) => {
    return {
      type: ACTION_TYPES.LOGIN ,
      payload: selectedState
    };
  };