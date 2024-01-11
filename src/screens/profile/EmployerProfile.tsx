import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RefreshControl } from 'react-native-gesture-handler';

import { MainNavigationParams } from "../../navigators/MainNavigation";
import { RootState } from '../../store/store';
import { ProfileBanner } from '../../components/profile';
import Loading from '../../components/common/Loading';
import Screen from '../../components/common/Screen';
import { IS_ANDROID } from '../../utils';
import { useAppSelector, useRefreshOnFocus } from '../../hooks';
import { useEmployerProfile } from './hooks';
import { showErrorToast } from '../../utils';

import EmployerProfileHeader from '../../components/profile/EmployerProfileHeader';
import EmployerProfileBio from '../../components/profile/EmployerProfileBio';
import EmployerProfileSocial from '../../components/profile/EmployerProfileSocial';
import EmployerProfileGallery from '../../components/profile/EmployerProfileGallery';

function EmployerProfileScreen() {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { token, role } = useAppSelector((state: RootState) => state.auth);
    const payload = {
        token: token
    };
    const { data, isLoading, isSuccess, isError, error: rqError, refetch } = useEmployerProfile(payload);
    useRefreshOnFocus(refetch);


    const SocialSection = () => {
        return (
            <EmployerProfileSocial data={data} role={role} />
        );
    }

    const MediaSection = () => {
        let newGallery: any = [];

        data?.galleryImagesUrls.map(item => {
            newGallery.push({
                fileData: null,
                fileName: null,
                fileType: null,
                type: 'url',
                url: item,
            });
        });

        if (!newGallery.length) return null;

        return (
            <EmployerProfileGallery data={newGallery} />
        );
    }

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        showErrorToast(t('promptTitle.error'), rqError.message);
    }

    return (
        <ScrollView 
            showsVerticalScrollIndicator={false} 
            contentContainerStyle={{ flexGrow: 1 }}
            refreshControl={
                <RefreshControl refreshing={isLoading} onRefresh={refetch} />
            }
        >
            <ProfileBanner coverImage={data?.profileBannerUrl || ''} />
            <EmployerProfileHeader data={data} showEdit={true} />
            <View className={`${IS_ANDROID ? 'top-[220]' : 'top-[250]'}`}>
                <Screen>
                    <View className='mt-4'>
                        <EmployerProfileBio data={data} />
                        <View className='my-2' />
                        <View className='bg-gray-300 h-[1]' />
                        <View className='my-2' />
                        <SocialSection />
                        <View className='my-2' />
                        <View className='bg-gray-300 h-[1]' />
                        <View className='my-4' />
                        <MediaSection />
                    </View>
                </Screen>
            </View>
            <View className="mb-[300]" />
        </ScrollView>        
    );
}

export default EmployerProfileScreen;