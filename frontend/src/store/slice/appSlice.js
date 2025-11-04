import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
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
    setPendingOrderCount: (state, action) => {
      state.pendingOrderCount = action.payload;
    },
    setResetEmail: (state, action) => {
      state.userEmail = action.payload
      console.log('emiL',state.userEmail)
    },

    //userlist
    setUserAllList:(state, action)=>{
      state.userAllList = action.payload
      console.log("redux all user data",state.userAllList)
    }
  }
});

export const { setUserInfo, setPendingOrderCount, setResetEmail, setUserAllList } = appSlice.actions;
export default appSlice.reducer;