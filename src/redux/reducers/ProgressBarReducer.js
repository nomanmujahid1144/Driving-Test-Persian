import { ACTION_TYPES } from "../ActionTypes/ActionTypes";
let loading=false

const ProgressBarReducer=(state=loading,action)=>{
    if (action.type === ACTION_TYPES.PROGRESS_BAR_STATE) {
        return action.payload;
    }
      return state;
}
export default ProgressBarReducer