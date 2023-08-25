import { ScrollView, View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import FastImage from 'react-native-fast-image';

import { MainNavigationParams } from "../../navigators/MainNavigation";
import { RootState } from '../../store/store';
import {ProfileBanner, SafeAreaProfileHeader } from '../../components/profile';
import { IS_ANDROID } from "../../utils";
import Avatar from '../../components/common/Avatar';
import SubmitButton from '../../components/common/SubmitButton';
import Screen from '../../components/common/Screen';
import { useEmployerView } from '../connections/hooks';
import { useAppSelector, useRefreshOnFocus } from '../../hooks';
import ImageSlider from '../../components/common/ImageSlider';
import EmployerProfileBio from '../../components/profile/EmployerProfileBio';
import EmployerProfileGallery from '../../components/profile/EmployerProfileGallery';
import EmployerProfileSocial from '../../components/profile/EmployerProfileSocial';
import EmployerProfileHeader from '../../components/profile/EmployerProfileHeader';

const images = [
    { url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80' },
    { url: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjF8fHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=900&q=60' },
    { url: 'https://images.unsplash.com/photo-1537511446984-935f663eb1f4?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MzZ8fHBlb3BsZXxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=900&q=60' }
]

const socialIcons = [
    { name: 'Instaram', image: require('../../assets/social-icon/social_instagram.png') },
    { name: 'Facebook', image: require('../../assets/social-icon/social_facebook.png') },
    { name: 'Website', image: require('../../assets/social-icon/social_website.png') },
]

type Props = StackScreenProps<MainNavigationParams, 'EmployerProfileView'>;

const EmployerProfileViewScreen = ({ route }: Props) => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { userId } = route.params;
    const { token, id: loggedInId } = useAppSelector((state: RootState) => state.auth);
    const payload = {
        token: token,
        params: {
            userId: userId
        }
    }
    const { data, isLoading, isError, error: rqError, refetch } = useEmployerView(payload);
    useRefreshOnFocus(refetch);

    const SocialSection = () => {
        return (
            <EmployerProfileSocial data={data} role='EMPLOYER' />
        );
    }

    const GallerySection = () => {
        return (
            <EmployerProfileGallery data={data} />
        );
    }

    return (
        <View style={{ ...StyleSheet.absoluteFillObject, top: IS_ANDROID ? -80 : -45 }}>
            <View className='top-[90] z-10'>
                <SafeAreaProfileHeader isPrimary={false} />
            </View>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
                <>
                    <ProfileBanner coverImage={data?.profileImageUrl || ''} />
                    <EmployerProfileHeader data={data} showEdit={false} />
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
                                <GallerySection />
                            </View>
                        </Screen>
                    </View>
                </>
                <View className="my-[150]" />
            </ScrollView>
        </View>
    );
}

export default EmployerProfileViewScreen;