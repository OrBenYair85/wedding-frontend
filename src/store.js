import { configureStore } from '@reduxjs/toolkit';
import cameraReducer from './slices/cameraSlice';

export const store = configureStore({
  reducer: {
    camera: cameraReducer,
  },
});