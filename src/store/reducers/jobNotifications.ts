import { createSelector, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

type Badge = {
    newJobApplication?: number
    jobApplicationStatus?: number
    newJob?: number
    jobStatus?: number
}

const initialState: Badge = {
    newJob: undefined,
    newJobApplication: undefined,
    jobApplicationStatus: undefined,
    jobStatus: undefined,
}

const NotificationSlice = createSlice({
    name: 'Notification',
    initialState,
    reducers: {
        updateNewJobBadge: (state, action) => {
            state.newJob = (state.newJob || 0) + action.payload;
        },

        resetNewJobBadge: (state) => {
            state.newJob = undefined;
        },

        updateNewJobApplicationBadge: (state, action) => {
            state.newJobApplication = (state.newJobApplication || 0) + action.payload;
        },

        resetNewJobApplicationBadge: (state) => {
            state.newJobApplication = undefined;
        },

        updateJobApplicationStatusBadge: (state, action) => {
            state.jobApplicationStatus = (state.jobApplicationStatus || 0) + action.payload;
        },

        resetJobApplicationStatusBadge: (state) => {
            state.jobApplicationStatus = undefined;
        },

        updateJobStatusBadge: (state, action) => {
            state.jobStatus = (state.jobStatus || 0) + action.payload;
        },

        resetJobStatusBadge: (state) => {
            state.jobStatus = undefined;
        },
    }
});

const { actions, reducer } = NotificationSlice;

export const {
    updateNewJobBadge,
    resetNewJobBadge,
    updateNewJobApplicationBadge,
    resetNewJobApplicationBadge,
    updateJobApplicationStatusBadge,
    resetJobApplicationStatusBadge,
    updateJobStatusBadge,
    resetJobStatusBadge,
} = actions;

export const JobNotificationSelector = (state: RootState) => state.jobNotification;

export const NewJobApplicationBadgeSelector = createSelector(JobNotificationSelector, (state) => state.newJobApplication);
export const NewJobBadgeSelector = createSelector(JobNotificationSelector, (state) => state.newJob);
export const JobApplicationStatusBadgeSelector = createSelector(JobNotificationSelector, (state) => state.jobApplicationStatus);
export const JobStatusBadgeSelector = createSelector(JobNotificationSelector, (state) => state.jobStatus);

export default reducer;