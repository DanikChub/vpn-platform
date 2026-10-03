import {
    createAction,
} from "@reduxjs/toolkit";


export const sessionUnauthorized =
    createAction(
        "session/unauthorized"
    );
