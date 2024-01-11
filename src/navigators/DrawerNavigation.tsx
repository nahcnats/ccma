import React from "react";
import { 
    createDrawerNavigator, 
    DrawerContentComponentProps, 
    DrawerContentScrollView, 
    DrawerItem, 
    DrawerItemList 
} from '@react-navigation/drawer';
import colors from 'tailwindcss/colors';
import { View, Text, SafeAreaView, Linking } from "react-native";
import { useTranslation } from 'react-i18next';

import TabNavigation from "./TabNavigation";
import { IconQuestion, IconSignOut, IconNotification, IconBookmark, IconJobs, IconPrivacy, IconExclamation } from "../assets/icons";
import { Header } from "../components/common/Header";
import { NotificationListingScreen } from "../screens/support";
import { BookmarkJobsScreen } from "../screens/jobs";
import { SavedFeeds } from "../screens/feeds";
import { useAppDispatch, useAppSelector } from "../hooks";
import * as authActions from '../store/actions/auth';
import { RootState } from "../store/store";
import { currentVersion } from "../constants/others";
import { openPdf, IS_ANDROID } from "../utils";

export type DrawerNavigationParams = {
    Home: undefined
    JobActivities: undefined
    SavedArticles: undefined
    Notifications: undefined
    BookmarkJobs: undefined
};

const iconColor = "black";
const iconSize = 24;
const FAQ_LINK = "https://firebasestorage.googleapis.com/v0/b/cultcreative-afbab.appspot.com/o/APP%20FAQ_compressed.pdf?alt=media&token=877e50a4-9bfb-4654-a302-02614cfd4ae8";
const PRIVACY_LINK = "https://firebasestorage.googleapis.com/v0/b/cultcreative-afbab.appspot.com/o/Privacy%20Policy%20of%20Cult%20Creative%20Sdn%20(1).pdf?alt=media&token=147ab66c-f585-4ea7-bc77-9c6c22b54783";
const TERMS = "https://firebasestorage.googleapis.com/v0/b/cultcreative-afbab.appspot.com/o/Cult%20Creative%20Terms%20%26%20Conditions%20Nov%202022.pdf?alt=media&token=aab0118a-6704-4a19-bf8e-893593a8a7a0";

const Drawer = createDrawerNavigator<DrawerNavigationParams>();

const DrawerMenu = (props: DrawerContentComponentProps) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const signOutHandler = () => {
        props.navigation.closeDrawer();
        dispatch(authActions.logout());
    }

    const onViewPdf = () => {
        if (IS_ANDROID) {
            Linking.openURL(FAQ_LINK).catch((err) => 
            console.log(err));
        } else {
            openPdf(FAQ_LINK, 'FAQ');
        }
    }
    const onViewPrivacy = () => {
        if (IS_ANDROID) {
            Linking.openURL(PRIVACY_LINK).catch((err) =>
                console.log(err));
        } else {
            openPdf(PRIVACY_LINK, 'Privacy Policy');
        }
    }
    const onViewTerms = () => {
        if (IS_ANDROID) {
            Linking.openURL(TERMS).catch((err) =>
                console.log(err));
        } else {
            openPdf(TERMS, 'Terms & Conditions');
        }
    }

    return (
        <View className="flex-1 justify-between">
            <DrawerContentScrollView {...props}>
                <DrawerItemList {...props} />
                <DrawerItem
                    onPress={onViewPdf}
                    label={`${t('menu.faqs')}`}
                    icon={() => {
                        return (
                            <View className="w-7 flex flex-row justify-center">
                                <IconQuestion color={iconColor} size={iconSize} />
                            </View>
                        )
                    }}
                    style={{ marginBottom: 1, borderBottomColor: colors.gray[200], borderBottomWidth: 1 }}
                />
                <DrawerItem
                    onPress={onViewPrivacy}
                    label='Privacy Policy'
                    icon={() => {
                        return (
                            <View className="w-7 flex flex-row justify-center">
                                <IconPrivacy color={iconColor} size={iconSize} />
                            </View>
                        )
                    }}
                    style={{ marginBottom: 1, borderBottomColor: colors.gray[200], borderBottomWidth: 1 }}
                />
                <DrawerItem
                    onPress={onViewTerms}
                    label='Terms & Conditions'
                    icon={() => {
                        return (
                            <View className="w-7 flex flex-row justify-center">
                                <IconExclamation color={iconColor} size={iconSize} />
                            </View>
                        )
                    }}
                    style={{ marginBottom: 1, borderBottomColor: colors.gray[200], borderBottomWidth: 1 }}
                />
                <DrawerItem
                    onPress={signOutHandler}
                    label={`${t('menu.signout')}`}
                    activeBackgroundColor="transparent"
                    icon={() => {
                        return (
                            <View className="w-7 flex flex-row justify-center">
                                <IconSignOut color={iconColor} size={iconSize + 2} />
                            </View>
                        )
                    }}
                />
            </DrawerContentScrollView>
            <SafeAreaView className="my-6">
                <Text className="self-center text-xs">Version {currentVersion}</Text>
            </SafeAreaView>
        </View>
        
    );
}

export default function () {
    const { t } = useTranslation();
    const { role } = useAppSelector((state: RootState) => state.auth);

    return (
        <Drawer.Navigator
            backBehavior="history"
            screenOptions={{
                drawerPosition: 'right',
                drawerType: 'front',
                headerShown: false,
                drawerLabelStyle: {color: colors.black},
                drawerItemStyle: {
                    borderBottomWidth: 1,
                    borderColor: colors.gray[200],
                    paddingBottom: 8,
                },
                drawerActiveBackgroundColor: "transparent",
            }}
            initialRouteName='Home'
            drawerContent={(props) => <DrawerMenu {...props} />}
        >
            <Drawer.Screen 
                name='Home'
                options={{
                    drawerLabel: () => null,
                    drawerItemStyle: {width: 0, height: 0}
                }}
                component={TabNavigation}
            />
            <Drawer.Group
                key="HeaderScreens"
                screenOptions={{
                    headerShown: true,
                    header: (props) => <Header preset="secondary"/>
                }}
            >
                <Drawer.Screen 
                    name="Notifications"
                    component={NotificationListingScreen}
                    options={{
                        drawerLabel: () => <Text className="text-black">{t('menu.notifications')}</Text>,
                        drawerIcon: () => {
                            return (
                                <View className="w-7 flex flex-row justify-center">
                                    <IconNotification size={iconSize} color={colors.black} />
                                </View>
                                
                            )
                        }
                    }}
                />
                <Drawer.Screen 
                    name="SavedArticles"
                    component={SavedFeeds}
                    options={{
                        drawerLabel: () => <Text className="text-black">{t('menu.savePosts')}</Text>,
                        drawerIcon: () => {
                            return (
                                <View className="w-7 flex flex-row justify-center">
                                    <IconBookmark size={iconSize} color={colors.black} />
                                </View>
                            )
                        }
                    }}
                />
                {
                    role === 'CREATIVE' &&
                    <Drawer.Screen
                        name="BookmarkJobs"
                        component={BookmarkJobsScreen}
                        options={{
                            drawerLabel: () => <Text className="text-black">{t('menu.jobBoards')}</Text>,
                            drawerIcon: () => {
                                return (
                                    <View className="w-7 flex flex-row justify-center">
                                        <IconJobs size={iconSize} color={colors.black} />
                                    </View>
                                )
                            }
                        }}
                    />
                }
            </Drawer.Group>
        </Drawer.Navigator>
    );
}