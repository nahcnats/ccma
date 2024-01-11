import React, { useCallback, useEffect, useState } from "react";
import { DefaultTheme, NavigationContainer } from '@react-navigation/native';
import moment from "moment";
import AuthNavigation from "./AuthNavigation";
import MainNavigation from "./MainNavigation";
import colors from "tailwindcss/colors";
import { Alert, Linking, Platform, Text, View, useColorScheme } from "react-native";
import { useAppState } from '@react-native-community/hooks';
import { useTranslation } from "react-i18next";

import { RootState } from "../store/store";
import themeColors from '../constants/theme';
import { useAppSelector, useAppDispatch } from "../hooks";
import * as authActions from '../store/actions/auth';
import { IS_ANDROID, appleSignIn, showErrorToast, silentFacebookSignIn, silentGoogleSignIn } from "../utils";
import { currentVersion } from "../constants/others";
import { MaintenanceScreen } from "../screens/auth";
import { getStorageUser, getVersionData } from './services';
import AsyncStorage from "@react-native-async-storage/async-storage";
import appleAuth from "@invertase/react-native-apple-authentication";
import { SUPPORT_APPLE_LOGIN } from "../constants/apple";

const MyTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: colors.gray[100],
    }
}

const MyDarkTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        background: themeColors.new_2
    }
}

export default function () {
    const { t } = useTranslation();
    const isDarkMode = useColorScheme() === 'dark';
    const dispatch = useAppDispatch();
    const isAuth = useAppSelector((state: RootState) => !!state.auth.token);
    const currentAppState = useAppState();
    const [isMaintenance, setIsMaintenance] = useState(false);
    const [credentialStateForUser, updateCredentialStateForUser] = useState('ACTIVE');

    const checkIsMaintenance = async () => {
        const data = await getVersionData();

        if (!data) return false;

        for (const store of data.app_versions) {
            if (store.code === 'MAINTENANCE_FLAG' && store.version === 1) {
                setIsMaintenance(true);
                return true;
            }
        }

        return false;
    }

    const checkVersion = async () => {
        try {
            const data = await getVersionData();

            if (!data) return;

            const store = data.app_versions;
            const iosVersion = store.find((item: any)=> item.code === 'IOS_APP_VERSION');
            const androidVersion = store.find((item: any) => item.code === 'ANDROID_APP_VERSION');

            let needToUpdate = false;

            if (Platform.OS === 'ios' && iosVersion.code === 'IOS_APP_VERSION' && parseFloat(iosVersion.version) > parseFloat(currentVersion)) {
                if (mandatoryUpdate(Platform.OS, iosVersion.mandatoryUpdate)) {
                    needToUpdate = true;
                }
            }

            if (Platform.OS === 'android' && androidVersion.code === 'ANDROID_APP_VERSION' && parseFloat(androidVersion.version) > parseFloat(currentVersion)) {
                if (mandatoryUpdate(Platform.OS, androidVersion.mandatoryUpdate)) {
                    needToUpdate = true;
                };
            }

            return needToUpdate;
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const tryLogin = useCallback(async () => {
        try {
            const user = await getStorageUser();
            if (!user) return;

            let provider = user.provider || 'none';

            switch (provider) {
                case 'none': {
                    dispatch(authActions.login({
                        email: user.email,
                        password: user.password
                    }));
                    break;
                }

                case 'GOOGLE': {
                    const userInfo = await silentGoogleSignIn();

                    const payload = {
                        provider: provider,
                        email: userInfo.user.email,
                        token: userInfo.token
                    }

                    dispatch(authActions.loginWithProvider(payload));
                    break;
                }

                case 'FACEBOOK': {
                    const userInfo = await silentFacebookSignIn();
                    const payload = {
                        provider: provider,
                        email: userInfo.email || '',
                        token: userInfo.token || ''
                    }

                    dispatch(authActions.loginWithProvider(payload));
                    break;
                }

                case 'APPLE': {
                    if (credentialStateForUser !== 'REVOKED') return;

                    const userInfo = await appleSignIn(false);
                    const payload = {
                        provider: provider,
                        email: user.email || '',
                        token: userInfo?.token || ''
                    }

                    dispatch(authActions.loginWithProvider(payload));
                    break;
                }

                default: {
                    return;
                }
            }   
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }, []);

    const openAppStore = () => {
        const link = 'itms-apps://apps.apple.com/my/app/cult-creative-network-jobs/id1584063189';
        Linking.canOpenURL(link)
            .then((supported) => {
                supported && Linking.openURL(link);
            }, (err) => console.log(err));
    }

    const openGooglePlay = () => {
        Linking.openURL('https://play.google.com/store/apps/details?id=asia.cultcreative.app');
    }

    const mandatoryUpdate = (type: string, mandatory: boolean) => {
        let toUpgrade = false;

        if (mandatory) {
            Alert.alert('New version is available.', 'Please upgrade to continue', [
                {
                    text: 'Upgrade',
                    onPress: () => {
                        type === 'android' ? openGooglePlay() : openAppStore();
                    }
                }
            ]);
            toUpgrade = true;
        } else {
            Alert.alert('New version is available.', 'Please select your option', [
                {
                    text: 'Cancel',
                    onPress: () => null,
                    // style: "cancel"
                },
                {
                    text: 'Upgrade',
                    onPress: () => {
                        type === 'android' ? openGooglePlay() : openAppStore();
                    }
                }
            ]);
            toUpgrade = false
        }
        return toUpgrade;
    }

    const init = async () => {
        const isUnderMaintenance = await checkIsMaintenance();
        if (isUnderMaintenance) return;

        const mandatoryUpdate = await checkVersion();
        if (mandatoryUpdate) return;

        const userData = await AsyncStorage.getItem('USER');

        if (!userData) return;

        const parsedUser = JSON.parse(userData);
        const now = moment(new Date());
        const end = moment(parsedUser.lastLoginDT);
        const hours = now.diff(end, 'hours');

        if (hours >= 12) return;

        tryLogin();
    }

    useEffect(() => {
        if (SUPPORT_APPLE_LOGIN) {
            return appleAuth.onCredentialRevoked(async () => {
                updateCredentialStateForUser('REVOKED');
            });
        }
        
    }, []);

    useEffect(() => { 
        init();

        return () => {}
    }, [currentAppState]);

    return (
        <NavigationContainer 
            theme={isDarkMode ? MyDarkTheme : MyTheme} 
        >
            {
                isMaintenance ? <MaintenanceScreen /> : isAuth ? <MainNavigation /> : <AuthNavigation />
            }
        </NavigationContainer>
    );
}