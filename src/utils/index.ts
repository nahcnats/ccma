import { NativeModules } from 'react-native';
import { Platform, Keyboard } from "react-native";
import RNFS from 'react-native-fs';
import Toast from 'react-native-toast-message';
import { useTranslation } from "react-i18next";
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import { AccessToken, AuthenticationToken, LoginManager, Profile } from 'react-native-fbsdk-next';
import { appleAuth } from "@invertase/react-native-apple-authentication";
import { launchImageLibrary } from 'react-native-image-picker';
import * as FileSystem from 'expo-file-system';
import FileViewer from 'react-native-file-viewer';
import { nanoid } from "@reduxjs/toolkit";
import AsyncStorage from '@react-native-async-storage/async-storage';

export const IS_ANDROID = Platform.OS === 'android';
// const googleWebDebugKey = '65688697019-442fmi53441pttme25otp8iovkdkoe5f.apps.googleusercontent.com';
// const googleWebDebugKey = "652243107680-f6hf4gl4mtea3jv81n8dbjop1ndtmms1.apps.googleusercontent.com";
const googleWebProdKey = '65688697019-442fmi53441pttme25otp8iovkdkoe5f.apps.googleusercontent.com';

// const GOOGLE_WEBCLIENT = NativeModules.RNConfig.env === (IS_ANDROID ? 'external' : 'External') ? googleWebProdKey : googleWebDebugKey;
const GOOGLE_WEBCLIENT = googleWebProdKey;

/** @example To be use with onStartShouldSetResponder */
export const dismissKeyboard = () => {
    Keyboard.dismiss();
    return false;
}

const getBase64StringFromDataURL = (dataURL: any) =>
    dataURL.replace('data:', '').replace(/^.+,/, '');

export const convertImageUrlToBase64 = async (url: any) => {
    const data = await fetch(url);
    const blob = await data.blob();

    return new Promise(resolve => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            const base64data = getBase64StringFromDataURL(reader.result);
            resolve(base64data);
        }

    });
}

export const convertFileToBase64 = async (path: string) => {
    const result = await RNFS.readFile(path, 'base64');

    if (result) {
        return result;
    }
}

export const showSuccessToast = (text1: string, text2: string) => {
    Toast.show({
        type: 'success',
        text1: text1,
        text2: text2
    });
}

export const showErrorToast = (text1: string, text2: string) => {
    Toast.show({
        type: 'error',
        text1: text1,
        text2: text2
    });
}

export const showWarnToast = (text1: string, text2: string) => {
    Toast.show({
        type: 'warning',
        text1: text1,
        text2: text2
    });
}

export const apiErrorHandler = (error: Error) => {
    let message = 'Something went wrong!';

    if (error.message) {
        message = error.message;
    }

    return new Error(message);
}

export const googleSignIn = async () => {
    try {
        GoogleSignin.configure({
            webClientId: GOOGLE_WEBCLIENT,
            offlineAccess: true,

        });
        await GoogleSignin.hasPlayServices();
        const userInfo = await GoogleSignin.signIn();
        const isSignIn = await GoogleSignin.getTokens()

        return {
            token: isSignIn.accessToken,
            user: userInfo.user
        };
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export const silentGoogleSignIn = async () => {
    try {
        GoogleSignin.configure({
            webClientId: GOOGLE_WEBCLIENT,
            offlineAccess: true,

        });
        
        const userInfo = await GoogleSignin.signInSilently();
        const isSignIn = await GoogleSignin.getTokens();

        return {
            token: isSignIn.accessToken,
            user: userInfo.user
        };
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export const facebookSignIn = async () => {
    try {
        await LoginManager.logInWithPermissions(
            ['public_profile', 'email'],
        )

        const currentToken = await AccessToken.getCurrentAccessToken();
        const currentProfile = await Profile.getCurrentProfile();

        return {
            token: currentToken?.accessToken,
            email: currentProfile?.email,
            name: currentProfile?.firstName + ' ' + currentProfile?.lastName
        }
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export const silentFacebookSignIn = async () => {
    try {
        const currentToken = await AccessToken.getCurrentAccessToken();
        const currentProfile = await Profile.getCurrentProfile();

        return {
            token: currentToken?.accessToken,
            email: currentProfile?.email,
        }
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export const appleSignIn = async (login: boolean) => {
    try {
        const appleAuthRequestResponse = await appleAuth.performRequest({
            requestedOperation: login ? appleAuth.Operation.LOGIN : appleAuth.Operation.REFRESH,
            requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
        });

        const { user, identityToken, nonce, fullName, email } = appleAuthRequestResponse;

        const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);

        if (credentialState === appleAuth.State.AUTHORIZED) {
            // user is authenticated
            let fullName_ = '';
            let email_ = email || '';

            if (fullName?.namePrefix) fullName_ = fullName_ + fullName.namePrefix + ' ';
            if (fullName?.givenName) fullName_ = fullName_ + fullName.givenName + ' ';
            if (fullName?.familyName) fullName_ = fullName_ + fullName.familyName + ' ';
            if (fullName?.nickname) fullName_ = fullName_ + fullName.nickname + ' ';
            if (fullName?.middleName) fullName_ = fullName_ + fullName.middleName + ' ';
            if (fullName?.nameSuffix) fullName_ = fullName_ + fullName.nameSuffix + ' ';

            if (fullName_ !== '' || fullName_ !== null) {
                await AsyncStorage.setItem('appleFullname', fullName_);
                await AsyncStorage.setItem('appleEmail', email_);
            } else {
                fullName_ = await AsyncStorage.getItem('appleFullname') || '';
                email_ = await AsyncStorage.getItem('appleEmail') || '';
            }

            await AsyncStorage.setItem('APPLEUSER', user);

            return {
                token: identityToken,
                email: email_,
                name: fullName_
            }
        }
    } catch (error: any) {
        // console.log(error)
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export const ago = (data: any) => {
    const { t } = useTranslation();
    
    if (!data) return;

    if (data?.postedMonthsAgo > 0) {
        return `${data?.postedMonthsAgo} ${t('feedScreen.monthsAgo')}`;
    }

    if (data?.postedWeeksAgo > 0) {
        return `${data?.postedWeeksAgo} ${t('feedScreen.weeksAgo')}`;
    }

    if (data?.postedDaysAgo > 0) {
        return `${data?.postedDaysAgo} ${t('feedScreen.daysAgo')}`;
    }

    if (data?.postedHoursAgo > 0) {
        return `${data?.postedHoursAgo} ${t('feedScreen.hoursAgo')}`;
    }

    if (data?.postedMinutesAgo > 0) {
        return `${data?.postedMinutesAgo} ${t('feedScreen.minutesAgo')}`;
    }

    return `${t('feedScreen.aMomentAgo')}`;
}

export const mediaImagePicker = async (media: any, selectionLimit: number) => {
    try {
        let newImages = [...media];
        const response = await launchImageLibrary({ mediaType: 'photo', includeBase64: true, selectionLimit: selectionLimit });

        if (response.didCancel) {
            throw new Error('Upload Canceled')
        }

        if (!response.assets) {
            throw new Error('No assets')
        }

        response.assets.map(item => {
            newImages.push({
                type: 'base64',
                url: null,
                fullUrl: null,
                thumbnail: null,
                fileData: item.base64 || null,
                fileName: item.fileName?.split('.')[0] || null,
                mimeType: item.type || null
            });
        });

        return newImages;
    } catch (error: any) {
        throw new Error(error.message);
    }
};

export const mediaDeleteImage = (media: any, index: number) => {
    let newMedia = [...media];
    newMedia.splice(index, 1);
    return newMedia;
}

export const openPdf = async (url: string, name?: string) => {
    const pdfHeader = name !== undefined ? encodeURIComponent(name) : nanoid();
    const localPath = `${FileSystem.documentDirectory}${pdfHeader}.pdf`;

    const { uri } = await FileSystem.downloadAsync(url, localPath);

    try {
        await FileViewer.open(uri, { showOpenWithDialog: true, showAppsSuggestions: true, displayName: name });
    } catch (e) {
        console.log("Error", e);
    }
};

export const getCloser = (value: number, checkOne: number, checkTwo: number) =>
    Math.abs(value - checkOne) < Math.abs(value - checkTwo) ? checkOne : checkTwo;