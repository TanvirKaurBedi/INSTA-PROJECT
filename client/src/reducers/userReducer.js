export const initialState = null;
export const reducer = (state, action) => {
  if (action.type == "getUserDetails") {
    return action.payload;
  }
  if (action.type == "UPDATE") {
    return {
      ...state,
      followers: action.payload.followers,
      followings: action.payload.followings,
    };
  }
  return state;
};  
