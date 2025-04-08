
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { DriverState } from "../../utils/driver.types";

const initialState: DriverState = {
    driver: null
}


const driverSlice = createSlice({
    name: "driver",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<DriverState['driver']>) => {
            state.driver = action.payload
        },
        logout: (state) => {
            state.driver = null;
        },
    },
});

export const { login, logout } = driverSlice.actions;

export default driverSlice.reducer;