
import { SafeAreaView, View, Text, Image, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import React, { useState, useRef, useCallback } from 'react';
import FastImage from 'react-native-fast-image';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { launchImageLibrary } from 'react-native-image-picker';
import colors from 'tailwindcss/colors';
import { useTranslation } from 'react-i18next';
import { AxiosProgressEvent } from 'axios';

import { RootState } from '../../store/store';
import { useAppSelector, useAppDispatch, useRefreshOnFocus } from '../../hooks';
import { MainNavigationParams } from "../../navigators/MainNavigation";
import Screen from '../../components/common/Screen';
import OrangeTickProgress from '../../components/common/OrangeTickProgress';
import UploadProgress from '../../components/common/UploadProgress';
import ProfileBanner from '../../components/common/ProfileBanner';
import Avatar from '../../components/common/Avatar';
import Loading from '../../components/common/Loading';
import { OrangeTickFooter } from '../../components/orangetick';
import { IconCheckCircle } from '../../assets/icons';
import { apiErrorHandler, showErrorToast } from '../../utils';
import server from '../../API';
import { httpHeaders } from '../../constants/httpHeaders';
import { useUtilties } from '../../hooks';
import * as orangeTickActions from '../../store/actions/orangeTick';
import { InputFormErrors } from '../../components/common/input';

const coverImage = 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTh8fHdvcmt8ZW58MHx8MHx8&auto=format&fit=crop&w=800&q=60';
let uploadType: string;

export default function UploadYourselfScreen() {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const dispatch = useAppDispatch();
    const { completionPercentage, completed } = useAppSelector((state: RootState) => state.orangeTick);
    const [photoUploaded, setPhotoUploaded] = useState(false);
    const [bannerUploaded, setBannerUploaded] = useState(false);
    const [bannerB64, setBannerB64] = useState<any>(null);
    const [profileB64, setProfileB64] = useState<any>(null);
    const [bannerCount, setBannerCount] = useState(0);
    const [profileCount, setProfileCount] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [profileImageError, setProfileImageError] = useState('');
    const [bannerImageError, setBannerImageError] = useState('');
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { token, name, username } = useAppSelector((state: RootState) => state.auth);
    const { profileImageUrl, bannerImageUrl } = useAppSelector((state: RootState) => state.orangeTick);
    const { data: dropdown, isLoading: dropdownIsLoading, isError: dropdownIsError, error: dropdownError, refetch: dropdownRefetch } = useUtilties();
    useRefreshOnFocus(dropdownRefetch);

    const resetCompleted = async () => {
        try {
            const payload = {
                completionPercentage: 0,
                completed: false,
            }

            const action = orangeTickActions.uploadStep(payload);
            await dispatch(action);
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    useFocusEffect(useCallback(() => {
        resetCompleted();
    }, [navigation]));


    const updateCreativeImages = async (payload: any) => {
        try {
            const services = uploadType === 'COVER'
                ? '/uploads/upload/image/cover'
                : '/uploads/upload/image/profile'; 

            const headerOptions = {
                'Authorization': `Bearer ${payload.token}`,
                'Content-Type': httpHeaders["content-type"]
            }

            const response = await server.post(services, payload.params, {
                headers: headerOptions,
                onUploadProgress: onUploadProgress
            });

            if (response.data.status === 'error') {
                throw new Error(response.data.errorMessage);
            }

            return response.data.response;
        } catch (error: any) {
            throw new Error(`${apiErrorHandler(error)}`);
        }
    }

    const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
        const { loaded, total } = progressEvent;

        uploadType === 'COVER' ? setBannerUploaded(false) : setPhotoUploaded(false);

        if (!total) {
            return;
        }

        let percent = Math.floor((loaded * 100) / total);
        if (percent <= 100) {
            // console.log(`${loaded} bytes of ${total} bytes. ${percent}%`);
            uploadType === 'COVER' ? setBannerCount(percent) : setProfileCount(percent);
        }

        if (percent === 100) {
            uploadType === 'COVER' ? setBannerUploaded(true) : setPhotoUploaded(true);
        }
    }

    const uploadImageHandler = useCallback(async (imageType: string) => {
        try {
            const launchResponse = await launchImageLibrary({ mediaType: 'photo', includeBase64: true });

            if (!launchResponse.assets) {
                return;
            }

            if (!launchResponse.didCancel) {
                if (imageType === 'COVER') {
                    setBannerCount(0);
                } else {
                    setProfileCount(0);
                }
            } else {
                return;
            }

            uploadType = imageType;

            const b64Image = {
                fileData: launchResponse.assets[0].base64,
                fileName: launchResponse.assets[0].fileName?.split('.')[0],
                fileType: launchResponse.assets[0].type,
            }

            const payload = {
                token: token,
                params: b64Image,
            };

            setIsUploading(true);

            const result = await updateCreativeImages(payload);

            if (imageType === 'COVER') {
                setBannerB64(b64Image);
                const action = orangeTickActions.uploadStep({
                    completionPercentage: completionPercentage,
                    completed: false,
                    bannerImageUrl: result.fileUrl
                });

                await dispatch(action);
            } else {
                setProfileB64(b64Image);
                const action = orangeTickActions.uploadStep({
                    completionPercentage: completionPercentage,
                    completed: false,
                    profileImageUrl: result.fileUrl
                });

                await dispatch(action);
            }

            setIsUploading(false);
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
            setIsUploading(false);
        }
    }, []);


    const onNextHandler = async () => {
        if (isUploading) return;

        if (!photoUploaded && profileCount === 0) {
            const errTxt = t('onboarding.form.profileImageError');
            setProfileImageError(errTxt);
            return;
        }

        if (!bannerUploaded && bannerCount === 0) {
            const errTxt = t('onboarding.form.bannerImageError');
            setBannerImageError(errTxt);
            return;
        }

        const payload = {
            completionPercentage: 25,
            completed: true
        }
        const action = orangeTickActions.uploadStep(payload);
        await dispatch(action);

        navigation.navigate('MyProfile');
    }

    return (
        <SafeAreaView className='flex-1'>
            <Screen>
                <View className='flex-1 justify-between'>
                    <View>
                        <OrangeTickProgress height={30} />
                        <View className='relative mt-4 rounded-lg h-[280]'>
                            <ProfileBanner base64={bannerB64 || null} useLocal />
                            <View className='absolute top-[165] left-5 flex-row space-x-5'>
                                <Avatar base64={profileB64 || null} useLocal size={80} />
                                <View className="justify-end">
                                    <View className='flex-row justify-between space-x-3'>
                                        <View className='flex-1'>
                                            <Text
                                                className='font-bold text-lg dark:text-white'
                                                numberOfLines={1}
                                                ellipsizeMode='tail'
                                            >
                                                {name}
                                            </Text>
                                        </View>
                                    </View>
                                    <Text className='dark:text-white'>@{username}</Text>
                                </View>
                            </View>
                        </View> 
                        <View className=' mt-6 space-y-5'>
                            <TouchableOpacity
                                className='rounded-lg border border-amber-400'
                                onPress={() => uploadImageHandler('PROFILE')}
                                disabled={isUploading}
                            >
                                <UploadProgress 
                                    height={90} 
                                    uploadCounter={profileCount}
                                    hidePercent={photoUploaded}
                                >
                                    {
                                        photoUploaded
                                        ? <View className='space-y-1'>
                                            <View className='flex-row justify-center items-center space-x-2'>
                                                <IconCheckCircle size={16} color={colorScheme === 'dark' ? colors.white : colors.black} />
                                                <Text className='dark:text-white'>{t('orangeTick.avatarUploadStatus')}</Text>
                                            </View>
                                                <Text className='self-center font-bold dark:text-white'>{t('orangeTick.tapChangeImage')}</Text>
                                        </View>
                                            : <Text className='self-center dark:text-white'>{t('orangeTick.uploadAvatar')}</Text>
                                    }
                                </UploadProgress>
                            </TouchableOpacity>
                            {(profileCount == 0 && profileImageError !== '') && <InputFormErrors message={profileImageError} />}
                            <TouchableOpacity
                                className='rounded-lg border border-amber-400'
                                onPress={() => uploadImageHandler('COVER')}
                                disabled={bannerCount > 0 && bannerCount < 100}
                            >
                                <UploadProgress 
                                    height={90} 
                                    uploadCounter={bannerCount}
                                    hidePercent={bannerUploaded}
                                >
                                    {
                                        bannerUploaded
                                            ? <View className='space-y-1'>
                                                <View className='flex-row justify-center items-center space-x-2'>
                                                    <IconCheckCircle size={16} color={colorScheme === 'dark' ? colors.white : colors.black} />
                                                    <Text className='dark:text-white'>{t('orangeTick.bannerUploadStatus')}</Text>
                                                </View>
                                                <Text className='self-center font-bold dark:text-white'>{t('orangeTick.tapChangeImage')}</Text>
                                            </View>
                                            : <Text className='self-center dark:text-white'>{t('orangeTick.uploadBanner')}</Text>
                                    }
                                </UploadProgress>
                            </TouchableOpacity>
                            {bannerCount === 0 && bannerImageError !== '' && <InputFormErrors message={bannerImageError} />}
                        </View>
                    </View>
                    <OrangeTickFooter onNextHandler={onNextHandler} onPreviousHandler={() => navigation.goBack()} />
                </View> 
            </Screen>
        </SafeAreaView>
    )
}