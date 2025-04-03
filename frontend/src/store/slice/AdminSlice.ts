
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
import { AdminState } from "../../utils/constants";

const initialState: AdminState = {
    admin: null
}


const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        login: (state, action: PayloadAction<AdminState['admin']>) => {
            console.log("THe State Reducer :", "State :", state, "Action ::", action);
            state.admin = action.payload
        },
        logout: (state) => {
            state.admin = null;
        },
    },
});

export const { login, logout } = adminSlice.actions;

export default adminSlice.reducer;