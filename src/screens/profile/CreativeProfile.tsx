import React from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { RefreshControl } from 'react-native-gesture-handler';

import { MainNavigationParams } from "../../navigators/MainNavigation";
import { ProfileBanner } from '../../components/profile';
import Loading from '../../components/common/Loading';
import Screen from '../../components/common/Screen';
import Avatar from '../../components/common/Avatar';
import SubmitButton from '../../components/common/SubmitButton';
import { IS_ANDROID } from '../../utils';
import { useCreativeProfile } from './hooks';
import { useAppSelector, useRefreshOnFocus } from '../../hooks';
import { RootState } from '../../store/store';
import { showErrorToast } from '../../utils';
import { Alert } from 'react-native';
import SocialLinks from '../../components/profile/SocialLinks';
import CreativeProfileHeader from '../../components/profile/CreativeProfileHeader';
import CreativeProfileBio from '../../components/profile/CreativeProfileBio';
import CreativeProfileSocial from '../../components/profile/CreativeProfileSocial';
import CreativeProfilePortfolioItem from '../../components/profile/CreativeProfilePortfolioItem';
import CreativeProfileFooter from '../../components/profile/CreativeProfileFooter';

function CreativeProfileScreen() {
    const { t } = useTranslation();
    const { token, role } = useAppSelector((state: RootState) => state.auth);
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const maxImageLength = 5;
    const payload = {
        token: token
    };
    const { data, isLoading, isSuccess, isStale, isError, error: rqError, refetch } = useCreativeProfile(payload);
    useRefreshOnFocus(refetch); 

    const PortlolioLinksSection = () => {
        return (
            <CreativeProfileSocial data={data} role={role} />
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
            <CreativeProfileHeader data={data} showEdit={true} />
            <View className={`${IS_ANDROID ? 'top-[220]' : 'top-[250]'}`}>
                <Screen>
                    <View className='mt-4'>
                        <CreativeProfileBio data={data} />
                        <View className='my-4' />
                        <View className='bg-gray-300 h-[1]' />
                        <View className='my-2' />
                        <PortlolioLinksSection />
                        <View className='my-2' />
                        <View className='bg-gray-300 h-[1]' />
                        <View className='my-4' />
                    </View>
                    {
                        data?.creativesPortfolios && data?.creativesPortfolios.length ? data?.creativesPortfolios.map(item => 
                            <CreativeProfilePortfolioItem key={item.id} data={item} />
                        ) : <Text className='dark:text-white self-center'>{t('profileScreen.prompts.noProjects')}</Text>
                    }
                    <CreativeProfileFooter />
                </Screen>
            </View>
            <View className="mb-[300]" />
        </ScrollView>
    );
}

export default CreativeProfileScreen;