import { configureStore } from "@reduxjs/toolkit";
import adminSlice from "./slice/AdminSlice"
import driverSlice from "./slice/DriverSlice"
// import userReducer from "./slices"
// import { useReducer } from "react";
// import chatReducer from "./features/chatSlice";
// import adminReducer from "./features/adminSlice";
// import notificationReducer from "./features/notificationSlice";

export const makeStore = () => {
    return configureStore({
        reducer: {
            admins: adminSlice,
            drivers: driverSlice
        },
    });
};
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];