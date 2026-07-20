import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import reportsReducer from "./reportsSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    reports: reportsReducer,
  },
});
