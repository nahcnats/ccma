import { ScrollView, View, Text, StyleSheet } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import { RefreshControl } from 'react-native-gesture-handler';

import { MainNavigationParams } from '../../navigators/MainNavigation';
import { RootState } from '../../store/store';
import { useAppSelector, useRefreshOnFocus } from '../../hooks';
import { ProfileBanner, SafeAreaProfileHeader } from '../../components/profile';
import { IS_ANDROID, showErrorToast } from "../../utils";
import Screen from '../../components/common/Screen';
import { useCreativeView } from './hooks';
import Loading from '../../components/common/Loading';
import CreativeProfileHeader from '../../components/profile/CreativeProfileHeader';
import CreativeProfileBio from '../../components/profile/CreativeProfileBio';
import CreativeProfileSocial from '../../components/profile/CreativeProfileSocial';
import CreativeProfilePortfolioItem from '../../components/profile/CreativeProfilePortfolioItem';

type Props = StackScreenProps<MainNavigationParams, 'ConnectionsProfile'>;

const CreativeProfileViewScreen = ({ route }: Props) => {
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
    const { data, isLoading, isError, error: rqError, refetch } = useCreativeView(payload);
    useRefreshOnFocus(refetch);

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        showErrorToast(t('promptTitle.error'), rqError.message);
    }

    return (
        <View style={{ ...StyleSheet.absoluteFillObject, top: IS_ANDROID ? -80 : -45 }}>
            <View className='top-[90] z-10'>
                <SafeAreaProfileHeader isPrimary={false} />
            </View>
            <ScrollView 
                showsVerticalScrollIndicator={false} 
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                    <RefreshControl refreshing={isLoading} onRefresh={refetch} />
                }
            >
                <>
                    <ProfileBanner coverImage={data?.profileBannerUrl || ''} />
                    <CreativeProfileHeader data={data} showEdit={false} />
                    <View className={`${IS_ANDROID ? 'top-[220]' : 'top-[250]'}`}>
                        <Screen>
                            <View className='mt-4'>
                                <CreativeProfileBio data={data} />
                                <View className='my-4' />
                                <View className='bg-gray-300 h-[1]' />
                                <View className='my-2' />
                                <CreativeProfileSocial data={data} role='CREATIVE' />
                                <View className='my-2' />
                                <View className='bg-gray-300 h-[1]' />
                                <View className='my-4' />
                            </View>
                            {
                                data?.creativesPortfolios && data?.creativesPortfolios.length ? data?.creativesPortfolios.map(item =>
                                    <CreativeProfilePortfolioItem key={item.id} data={item} isVisitor />
                                ) : <Text className='dark:text-white self-center'>No projects</Text>
                            }
                        </Screen>
                    </View>
                </>
                <View className="my-[130]" />
            </ScrollView>
        </View>
    );
}

export default CreativeProfileViewScreen;