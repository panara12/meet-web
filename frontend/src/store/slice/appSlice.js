import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userInfo: null,
  pendingOrderCount: 0
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
    }
  }
});

export const { setUserInfo, setPendingOrderCount } = appSlice.actions;
export default appSlice.reducer;