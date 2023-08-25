import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./reducers/auth";
import orangeTickReducer from "./reducers/orangeTick";
import onboardingReducer from "./reducers/onboarding";
import tokenTopUpReducer from "./reducers/tokenTopUp";
import JobNotificationReducer from './reducers/jobNotifications';
import NotificationReducer from './reducers/notifications';
import ConnectionNotificationReducer from './reducers/connectionNotifications';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        orangeTick: orangeTickReducer,
        onboarding: onboardingReducer,
        topUpToken: tokenTopUpReducer,
        jobNotification: JobNotificationReducer,
        notification: NotificationReducer,
        connectionNotification: ConnectionNotificationReducer,
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;