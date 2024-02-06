import { ACTION_TYPES } from "../ActionTypes/ActionTypes";
let token = ''

const ProfileReducer=(state=token,action)=>{
    if (action.type === ACTION_TYPES.LOGIN) {
        return action.payload;
    }
      return state;
}
export default ProfileReducer