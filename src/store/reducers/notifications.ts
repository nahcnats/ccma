import { createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store";

type Badge = {
    badge: number
}

const initialState: Badge = {
    badge: 0,
};

const NotificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        updateBadge: (state, action) => {
            state.badge += action.payload;
        },
        resetBadge: (state) => {
            state.badge = 0;
        },
    },
});

const { actions, reducer } = NotificationSlice;

export const {
    updateBadge,
    resetBadge,
} = actions;

export const NotificationSelector = (state: RootState) => state.notification;
export const BadgeSelector = createSelector(NotificationSelector, (state) => state.badge);

export default reducer;