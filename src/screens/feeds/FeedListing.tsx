import React, { useReducer, useRef, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import {  useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import colors from "tailwindcss/colors";

import { RootState } from "../../store/store";
import { useAppSelector, useRefreshOnFocus } from "../../hooks";
import { MainNavigationParams } from "../../navigators/MainNavigation";
import Loading from "../../components/common/Loading";
import Empty from "../../components/common/Empty";
import LoadMore from "../../components/common/LoadMore";
import Screen from "../../components/common/Screen";
import { IconRight } from "../../assets/icons";
import { FeedItem } from "../../components/feeds";
import { useFeedList } from "./hooks";
import { showErrorToast, getCloser } from "../../utils";
import OrangeTick from "../../components/feeds/OrangeTick";
import Crash from "../../components/common/Crash";
import { Header as ScreenHeader } from "../../components/common/Header";
import themeColor from '../../constants/theme';

const headerHeight = 70 * 2;
// const headerHeight = 180 * 2;

export default function FeedListingScreen () {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { token, role } = useAppSelector((state: RootState) => state.auth);
    const [keyword, setKeyword] = useState('')
    const payload = {
        token: token,
        params: {
            pageIndex: 0,
            pageSize: 10,
            keyword: keyword,
        }
    }
    const { data: feeds, hasNextPage, isLoading, isFetching, fetchNextPage,  isError, error: rqError, refetch } = useFeedList(payload);
    useRefreshOnFocus(refetch);

    const minScroll = 100;
    const scrollY = new Animated.Value(0);
    const clampedScrollY = scrollY.interpolate({
        inputRange: [minScroll, minScroll + 1],
        outputRange: [0, 1],
        extrapolateLeft: 'clamp',
    });

    const minusScrollY = Animated.multiply(clampedScrollY, -1);
    const translateY = Animated.diffClamp(minusScrollY, -headerHeight, 0);

    const handleScroll = Animated.event(
        [
            {
                nativeEvent: {
                    contentOffset: { y: scrollY },
                },
            },
        ],
        {
            useNativeDriver: true,
        },
    );

    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (isError) {
        showErrorToast(t('promptTitle.error'), rqError as string);
        return <Crash message={rqError as string} />;
    }

    const Header = () => {
        return (
            <Animated.View style={[styles.header, { transform: [{ translateY }] }]}>
                <TouchableOpacity 
                    className="border border-gray-300 bg-white rounded-md p-3"  
                    onPress={() => navigation.navigate('CreateFeed')}
                >
                    <View className="flex-row justify-between">
                        <Text className="text-gray-500">{t('feedScreen.whatAreYouWorkingOn')}</Text>
                        <IconRight color={colors.gray[300]} size={18} />
                    </View>
                </TouchableOpacity>
            </Animated.View>
        )
    }

    return (
        <>
            <ScreenHeader />
            <View className="flex-1 justify-between">
                <Screen>
                    <View className="flex-1 justify-between">
                        <Header />
                        <Animated.FlatList
                            scrollEventThrottle={16}
                            data={feeds?.pages.map(page => page).flat()}
                            keyExtractor={(item) => `${item.postId}`}
                            initialNumToRender={6}
                            renderItem={({ item, index }) => <FeedItem
                                data={item}
                            />
                            }
                            ListEmptyComponent={<Empty label={t('jobScreen.prompts.noRecords')} />}
                            showsVerticalScrollIndicator={false}
                            onEndReached={() => {
                                if (hasNextPage) {
                                    fetchNextPage();
                                }
                            }}
                            contentContainerStyle={{ paddingTop: headerHeight / 2 }}
                            onScroll={handleScroll}
                            onRefresh={() => refetch()}
                            refreshing={isLoading}
                            ListFooterComponent={<LoadMore isFetching={isFetching} />}
                        />
                    </View>
                </Screen>
                {
                    role === 'CREATIVE' && <OrangeTick />
                }
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1,
        backgroundColor: colors.gray[100]
    }
});