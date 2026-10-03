import {
    createSlice,
    type PayloadAction,
} from "@reduxjs/toolkit";

import type {
    Admin,
} from "@/entities/admin";

import type {
    AuthStatus,
} from "./auth.types";


interface AuthState {
    admin: Admin | null;
    status: AuthStatus;
}


const initialState: AuthState = {
    admin: null,
    status: "initializing",
};


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        sessionAuthenticated: (
            state,
            action: PayloadAction<Admin>
        ) => {
            state.admin = action.payload;
            state.status = "authenticated";
        },

        sessionUnauthenticated: (
            state
        ) => {
            state.admin = null;
            state.status = "unauthenticated";
        },
    },
});


export const {
    sessionAuthenticated,
    sessionUnauthenticated,
} = authSlice.actions;

export const authReducer =
    authSlice.reducer;
