import { createSelector, createSlice } from "@reduxjs/toolkit";

import { RootState } from "../store";

type Badge = {
    requestsBadge?: number
    acceptsBadge?: number
}

const initialState: Badge = {
    requestsBadge: undefined,
    acceptsBadge: undefined,
};

const NotificationSlice = createSlice({
    name: "ConnectionNotification",
    initialState,
    reducers: {
        updateAcceptsBadge: (state, action) => {
            state.acceptsBadge = (state.acceptsBadge || 0) + action.payload;
        },
        resetAcceptsBadge: (state) => {
            state.acceptsBadge = undefined;
        },

        updateRequestsBadge: (state, action) => {
            state.requestsBadge = (state.requestsBadge || 0) + action.payload;
        },
        resetRequestsBadge: (state) => {
            state.requestsBadge = undefined;
        },
    },
});

const { actions, reducer } = NotificationSlice;

export const {
    updateAcceptsBadge,
    resetAcceptsBadge,
    updateRequestsBadge,
    resetRequestsBadge,
} = actions;

export const ConnectionsNotificationSelector = (state: RootState) => state.connectionNotification;
export const ConnectionRequestBadgeSelector = createSelector(ConnectionsNotificationSelector, (state) => state.requestsBadge);
export const ConnectionAcceptBadgeSelector = createSelector(ConnectionsNotificationSelector, (state) => state.acceptsBadge);

export default reducer;