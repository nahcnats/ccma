import React from "react";
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';
import { useColorScheme } from "react-native";
import { RootState } from "../store/store";

import { IS_ANDROID } from "../utils";
import { FeedListingScreen } from "../screens/feeds";
import { ConnectionsListingScreen } from "../screens/connections";
import { JobsListingScreen, HireScreen } from "../screens/jobs";
import { ProfileScreen } from "../screens/profile";
import { Header } from "../components/common/Header";
import { IconFeeds, IconNetwork, IconJobs, IconProfile } from "../assets/icons";
import colors from "tailwindcss/colors";
import themeColors from '../constants/theme';
import { PrimaryLeft, PrimaryRight } from "../components/common/headers";
import { useAppSelector } from "../hooks";
import useNotifications from "../hooks/useNotifications";
import { ConnectionAcceptBadgeSelector, ConnectionRequestBadgeSelector } from "../store/reducers/connectionNotifications";
import { NewJobApplicationBadgeSelector } from "../store/reducers/jobNotifications";
import FeedIcon from '../assets/icons/svgs/Feed.svg';
import NetworkIcon from '../assets/icons/svgs/Network.svg';
import JobsIcon from '../assets/icons/svgs/Jobs.svg';
import ProfileIcon from '../assets/icons/svgs/Profile.svg';

export type TabsNavigationParams = {
    FeedTab: undefined
    ConnectionsTab: undefined
    JobsTab: undefined
    ProfileTab: undefined
}

const Tab = createBottomTabNavigator<TabsNavigationParams>();
const iconSize = 24;

export default function () {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const role = useAppSelector((state: RootState) => state.auth.role);
    useNotifications();
    const connectionRequestBadge = useAppSelector(ConnectionRequestBadgeSelector);
    const connectionAcceptBadge = useAppSelector(ConnectionAcceptBadgeSelector);
    const newJobApplicationBadge = useAppSelector(NewJobApplicationBadgeSelector);
    // const bgColor = colorScheme === 'dark' ? '#121212' : colors.white;
    const bgColor = colorScheme === 'dark' ? themeColors.new_2 : colors.white;
    const iconColor = colorScheme === 'dark' ? colors.white : colors.black;

    return (
        <Tab.Navigator
            initialRouteName="FeedTab"
            backBehavior="history"
            screenOptions={{
                tabBarShowLabel: true,
                tabBarStyle: [
                    { 
                        height: 85,
                        backgroundColor: themeColors.new_1,
                        borderTopWidth: 0,
                    }, 
                    IS_ANDROID && { height: 55, paddingBottom: 5 }
                ],
                header: () => <Header />,
                headerShadowVisible: false,
                // headerStyle: {
                //     backgroundColor: '#CCBE00',
                //     borderBottomWidth: 0,
                // },
                // headerTitle: '',
                // headerLeft: () => <PrimaryLeft />,
                // headerRight: () => <PrimaryRight />,
            }}
        >
            <Tab.Screen 
                name='FeedTab'
                component={FeedListingScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <FeedIcon width={iconSize} height={iconSize} style={[ { opacity: focused ? 1 : 0.5 } ]} />
                    },
                    tabBarLabel: ({ focused }) => {
                        return <Text className='text-xs text-white' style={[ { opacity: focused ? 1 : 0.5 }]}>{t('bottomNavTab.feed')}</Text>
                    },
                    headerShown: false
                }}
            />
            {
                role === 'CREATIVE' 
                    ? (
                        <>
                            <Tab.Screen
                                name='ConnectionsTab'
                                component={ConnectionsListingScreen}
                                options={{
                                    tabBarBadge: connectionAcceptBadge && connectionRequestBadge ? connectionAcceptBadge + connectionRequestBadge : (connectionAcceptBadge || connectionRequestBadge),
                                    tabBarIcon: ({ focused }) => {
                                        return <NetworkIcon width={iconSize} height={iconSize} style={[{ opacity: focused ? 1 : 0.5 }]} />
                                    },
                                    tabBarLabel: ({ focused }) => {
                                        return <Text className='text-xs text-white' style={[{ opacity: focused ? 1 : 0.4 }]}>{t('bottomNavTab.network')}</Text>
                                    }
                                }}
                            />
                            <Tab.Screen
                                name='JobsTab'
                                component={JobsListingScreen}
                                options={{
                                    tabBarIcon: ({ focused }) => {
                                        return <JobsIcon width={iconSize} height={iconSize} style={[{ opacity: focused ? 1 : 0.5 }]} />
                                    },
                                    tabBarLabel: ({ focused }) => {
                                        return <Text className='text-xs text-white' style={[{ opacity: focused ? 1 : 0.5 }]}>{t('bottomNavTab.jobs')}</Text>
                                    }
                                }}
                            />
                        </>
                    )
                    : <Tab.Screen
                        name='JobsTab'
                        component={HireScreen}
                        options={{
                            tabBarBadge: newJobApplicationBadge,
                            tabBarIcon: ({ focused }) => {
                                return <JobsIcon width={iconSize} height={iconSize} style={[{ opacity: focused ? 1 : 0.5 }]} />
                            },
                            tabBarLabel: ({ focused }) => {
                                return <Text className='text-xs text-white' style={[{ opacity: focused ? 1 : 0.5 }]}>{t('bottomNavTab.jobs')}</Text>
                            }
                        }}
                    />
            }
            <Tab.Screen 
                name='ProfileTab'
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return <ProfileIcon width={iconSize} height={iconSize} style={[{ opacity: focused ? 1 : 0.5 }]} />
                    },
                    tabBarLabel: ({ focused }) => {
                        return <Text className='text-xs text-white' style={[{ opacity: focused ? 1 : 0.5 }]}>{t('bottomNavTab.profile')}</Text>
                    },
                    header: () => null
                }}
            />
        </Tab.Navigator>
    );
}