import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  capturedFile: null,
};

const cameraSlice = createSlice({
  name: 'camera',
  initialState,
  reducers: {
    setCapturedFile(state, action) {
      state.capturedFile = action.payload;
    },
    clearCapturedFile(state) {
      state.capturedFile = null;
    },
  },
});

export const { setCapturedFile, clearCapturedFile } = cameraSlice.actions;
export default cameraSlice.reducer;
