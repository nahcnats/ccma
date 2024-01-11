import { useEffect, useRef } from "react";
import notifee, { EventDetail, EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useAppDispatch } from ".";

import * as NotificationConstants from '../constants/Notifications';
import { MainNavigationParams } from "../navigators/MainNavigation";
import { NotificationHeader, NotificationBody, Source } from "../types/notifications";
import { updateAcceptsBadge, updateRequestsBadge } from '../store/reducers/connectionNotifications';
import { updateJobApplicationStatusBadge, updateNewJobApplicationBadge } from '../store/reducers/jobNotifications';
import { updateBadge } from '../store/reducers/notifications';

export default function () {
    const mountedRef = useRef<boolean>(true);
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const dispatch = useAppDispatch();

    async function createDefaultChannel() {
        await notifee.createChannel({
            id: "default",
            name: "Default Channel",
        });
    }

    async function createConnectionsChannel() {
        await notifee.createChannel({
            id: "connections",
            name: "Connections",
        });
    }

    async function createFeedsChannel() {
        await notifee.createChannel({
            id: "feeds",
            name: "Feeds",
        });
    }

    async function handleNotificationMessages(notification: NotificationHeader, data: NotificationBody) {
        switch (data?.categoryIdentifier) {
            case NotificationConstants.CONNECTION_REQUEST:
                dispatch(updateAcceptsBadge(1));
                break;
            case NotificationConstants.CONNECTION_ACCEPTED:
                dispatch(updateRequestsBadge(1));
                break;
            case NotificationConstants.TYPE_JOB_APPLICATION:
                dispatch(updateNewJobApplicationBadge(1));
                break;
            case NotificationConstants.TYPE_JOB_APPLICATION_STATUS:
                dispatch(updateJobApplicationStatusBadge(1));
                break;
        }

        if (NotificationConstants.FEED_NOTIFICATION.includes(data.categoryIdentifier)) {
            notifee.displayNotification({
                title: notification.title,
                body: notification.body,
                data,
                android: {
                    channelId: 'connections',
                    pressAction: {
                        id: 'ViewFeed',
                    },
                },
            });

            dispatch(updateBadge(1));
        }

        if (NotificationConstants.COMMENT_NOTIFICATION.includes(data.categoryIdentifier)) {
            notifee.displayNotification({
                title: notification.title,
                body: notification.body,
                data,
                android: {
                    channelId: 'connections',
                    pressAction: {
                        id: 'ViewComment',
                    },
                },
            });

            dispatch(updateBadge(1));
        }
    }

    async function handleNotificationInteraction(detail: EventDetail, type: EventType) {
        const { notification, pressAction } = detail;
        const data = notification?.data as NotificationBody;

        if (pressAction?.id === 'ViewFeed') {
            const source = JSON.parse(data.source!) as Source;
            navigation.navigate('ShowFeed', {id: source.id});
        }

        if (pressAction?.id === 'ViewComment') {
            const source = JSON.parse(data.source!) as Source;
            navigation.navigate('CommentListing', {postId: source.id});
        }
    }

    function listenForRemoteMessage() {
        return messaging().onMessage((remoteMessage) => {
            const { data, notification } = remoteMessage;

            if (data?.type === NotificationConstants.TYPE_NOTIFICATION) {
                handleNotificationMessages(notification as NotificationHeader, data as NotificationBody);
            }
        });
    }

    function listenForRemoteOpenApp() {
        return messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log("Notification caused app to open from background state:", remoteMessage);
        })
    }

    function listenForLocalMessages() {
        return notifee.onForegroundEvent(({ detail, type }) => {
            if (type === EventType.PRESS || type === EventType.ACTION_PRESS) {
                handleNotificationInteraction(detail, type);
            }

            if (type === EventType.DISMISSED) {
                // handle dismiss
            }
        });
    }

    useEffect(() => {
        createDefaultChannel();
        createConnectionsChannel();
        createFeedsChannel();

        const unsubcribeLocalMessage = listenForLocalMessages();
        const unsubscribeRemoteMessage = listenForRemoteMessage();
        const unsubscribeRemoteOpenMessage = listenForRemoteOpenApp();

        return () => {
            mountedRef.current = false;
            unsubcribeLocalMessage();
            unsubscribeRemoteMessage();
            unsubscribeRemoteOpenMessage();
        }
    }, []);
}