import { configureStore } from "@reduxjs/toolkit";
import userAuthorReducer from "./slices/userAuthorSlice";

export const reduxStore = configureStore({
  reducer: {
    userAuthorLoginReducer: userAuthorReducer,
  },
});
