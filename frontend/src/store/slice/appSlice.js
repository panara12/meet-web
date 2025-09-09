import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  pendingOrderCount: 0,
  userEmail:null
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
    }
  }
});

export const { setUserInfo, setPendingOrderCount, setResetEmail } = appSlice.actions;
export default appSlice.reducer;