import { configureStore } from "@reduxjs/toolkit";

import AuthReducer from "@/app/store/slices/authSlice";
import AdminReducer from "@/app/store/slices/adminSlice";
import GoalReducer from  "@/app/store/slices/goalSlice"
export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: AuthReducer,
      adminauth: AdminReducer,
      habits:GoalReducer
    },
  });
}