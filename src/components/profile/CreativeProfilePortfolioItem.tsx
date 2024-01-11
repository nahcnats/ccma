import { View, Text, Pressable, Image } from 'react-native';
import React from 'react';
import { useTranslation } from 'react-i18next';
import FastImage from 'react-native-fast-image';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import ViewMoreText from 'react-native-view-more-text';
import Autolink from 'react-native-autolink';

import { MainNavigationParams } from "../../navigators/MainNavigation";
import { RootState } from '../../store/store';
import { useAppSelector, useRefreshOnFocus } from '../../hooks';
import { useCreativePortfolioById } from '../../screens/profile/hooks';
import Loading from '../common/Loading';
import { showErrorToast } from '../../utils';
import { CreativePortfoliosType } from '../../types/profile/CreativeProfileType';
import { renderViewMore, renderViewLess } from '../common/ViewMoreLess';

type Props = StackScreenProps<MainNavigationParams, 'ConnectionsProfile'>;

interface CreativeProfilePortfolioItemProps {
    data: CreativePortfoliosType
    isVisitor?: boolean
}

const CreativeProfilePortfolioItem = ({ data, isVisitor }: CreativeProfilePortfolioItemProps) => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    // const { token } = useAppSelector((state: RootState) => state.auth);
    // const payload = {
    //     token: token,
    //     params: {
    //         id: id
    //     }
    // }
    // const { data, isLoading, isError, error: rqError, refetch } = useCreativePortfolioById(payload);
    // useRefreshOnFocus(refetch);

    const navigationHandler = () => {
        if (isVisitor) {
            navigation.navigate('ProjectsDetail', {id: data.id});
        } else {
            navigation.navigate('EditProjects', { id: data.id })
        }
    }

    // if (isLoading) {
    //     return <Loading />
    // }

    // if (isError) {
    //     showErrorToast(t('promptTitle.error'), rqError.message);
    // }

    // https://cc-dev-space-01.sgp1.cdn.digitaloceanspaces.com/images/I-20230803-150313-20230803-150715-20230803-150922-20230803-151201.jpeg
    // https://cc-dev-space-01.sgp1.cdn.digitaloceanspaces.com/images/IMG-0007-20230803-150733-20230803-150922-20230803-151201.jpeg

    return (
        <Pressable
            key={data.id}
            className='border border-gray-300 rounded-lg overflow-hidden bg-white mb-5'
            onPress={navigationHandler}
        >
            <Image 
                source={{ uri: data?.imageUrl }} resizeMode={FastImage.resizeMode.cover} style={{ width: 400, height: 260 }}
            />
            {/* <FastImage source={{ uri: data?.imageUrl }} resizeMode={FastImage.resizeMode.cover} style={{ width: 400, height: 260 }} /> */}
            <View className=' p-4 pt-6 gap-1'>
                <Text className='text-base font-bold'>{data?.title}</Text>
                <Autolink
                    text={data?.description}
                    renderText={(text) =>
                        <Text>{text}</Text>
                    }
                />
            </View>
        </Pressable>
    );
}

export default CreativeProfilePortfolioItem;