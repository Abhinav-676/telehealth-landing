import { configureStore } from '@reduxjs/toolkit';
import visibilityReducer from './slices/modelVisibility';


export const store = configureStore({
  reducer: {
    visibility: visibilityReducer
  },
});
