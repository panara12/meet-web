import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  limits:null,
  pendingOrderCount: 0,
  userEmail:null,
  userAllList:null
};

const appSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userInfo = action.payload;
    },
    setLimitsInfo:(state,action) =>{
      state.limits = action.payload;
    },
    setPendingOrderCount: (state, action) => {
      state.pendingOrderCount = action.payload;
    },
    setResetEmail: (state, action) => {
      state.userEmail = action.payload
    },

    //userlist
    setUserAllList:(state, action)=>{
      state.userAllList = action.payload
    }
  }
});

export const { setUserInfo,setLimitsInfo, setPendingOrderCount, setResetEmail, setUserAllList } = appSlice.actions;
export default appSlice.reducer;