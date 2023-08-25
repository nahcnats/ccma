import React, { useCallback, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, Animated, StyleSheet } from 'react-native';
import { t } from 'i18next';
import colors from 'tailwindcss/colors';
import { useColorScheme } from 'react-native';
import { useQueryClient } from 'react-query';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { MainNavigationParams } from '../../../navigators/MainNavigation';
import { RootState } from '../../../store/store';
import Loading from '../../../components/common/Loading';
import LoadMore from '../../../components/common/LoadMore';
import Search from '../../../components/common/Search';
import Empty from '../../../components/common/Empty';
import { useAppSelector, useRefreshOnFocus } from '../../../hooks';
import { ExploreItem } from '../../../components/connections'
import { getCloser, showErrorToast } from '../../../utils';
import { getCreativeExplore } from '../services';
import { CreativeExploreType } from '../../../types/network';
import Crash from '../../../components/common/Crash';

const headerHeight = 130 * 2; // multiple the header height by 2 where the bottom half provide an illussion it is collapsing

function ExploreConnections() {
    const colorScheme = useColorScheme();
    const queryClient = useQueryClient();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const token = useAppSelector((state: RootState) => state.auth.token);
    const [page, setPage] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(false);
    const [limit, setLimit] = useState(10);
    const [exploreCount, setExploreCount] = useState(0);
    const [explore, setExplore] = useState<CreativeExploreType[]>([]);
    const [fullData, setFullData] = useState<CreativeExploreType[]>([]);
    const [filteredData, setFilteredData] = useState<CreativeExploreType[]>([]);
    const [query, setQuery] = useState<string>('');
    const [isError, setIsError] = useState(false);
    const [errMessage, setErrMessage] = useState('');

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

    const init = () => {
        setExplore([]);
        setFullData([]);
        setIsLoading(false);
        setIsFetching(false);
        setPage(0);
        setIsError(false);
        setErrMessage('');
    }


    const initFetchExplore = async () => {
        try {
            const payload = {
                token: token,
                params: {
                    pageIndex: page,
                    pageSize: limit,
                    // sortByLatestFirst: true,
                }
            }
            const result = await getCreativeExplore(payload);

            if (result && result) {
                setExplore(result);
                setFullData(result);
                setExploreCount(result.length);
                setIsLoading(false);
                setIsFetching(false);
            }
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
            setIsLoading(false);
            setIsFetching(false);
            setIsError(true);
        }
    }

    const fetchExplore = async () => {
        try {
            const payload = {
                token: token,
                params: {
                    pageIndex: page,
                    pageSize: limit,
                    // sortByLatestFirst: true,
                }
            }
            const result = await getCreativeExplore(payload);

            if (result && result) {
                setExplore([...explore, ...result]);
                setFullData([...fullData, ...result]);
                setExploreCount(result.length);
                setIsLoading(false);
                setIsFetching(false);
            }
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
            setIsLoading(false);
            setIsFetching(false);
            setIsError(true);
        }
    }

    const initialFetch = () => {
        init();
        setIsLoading(true);
        fetchExplore();
    }

    const initialRefetch = () => {
        init();
        setIsLoading(true);
        initFetchExplore();
    }

    useFocusEffect(
        useCallback(() => {
            const unsubscribe = initialFetch();

            return () => unsubscribe;
        }, [])
    );

    useEffect(() => {
        setIsFetching(true)
        fetchExplore();

        return () => { };
    }, [page]);

    const loadMoreData = () => {
        if (isFetching) return;

        if (exploreCount < limit) {
            return;
        }

        setPage(page + 1);
    }

    const onSearchHandler = async () => {
        if (!query || query === '') {
            return;
        }

        try {
            const payload = {
                token: token,
                params: {
                    pageIndex: page,
                    pageSize: limit,
                    // sortByLatestFirst: true,
                    keyword: query
                }
            }
            const result = await getCreativeExplore(payload);

            if (result && result) {
                if (result.length > limit) {
                    setFilteredData([...filteredData, ...result]);
                    setExplore(filteredData);
                } else {
                    setExplore(result);
                }

                setExploreCount(result.length);
                setIsLoading(false);
                // setIsFetching(false);
            }
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
            setIsLoading(false);
            setIsError(true);
            setErrMessage(error.message)
            // setIsFetching(false);
        }
    }

    const searchFilter = useCallback((text: string) => {
        setQuery(text)
    }, [])

    const onClearSearchHandler = async () => {
        setQuery('');
        initialFetch();
    }

    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (isError) {
        return <Crash message={errMessage} />
    }

    const Header = () => {
        return (
            <Animated.View className='mt-[60]' style={[styles.header, { transform: [{ translateY }] }]}>
                {/* <Search
                    query={query}
                    onQuery={(text: string) => searchFilter(text)}
                    onSearch={onSearchHandler}
                    onClear={onClearSearchHandler}
                /> */}
                <TouchableOpacity className='w-full py-3 bg-amber-500 rounded-lg' onPress={() => navigation.navigate('ImportContacts')}>
                    <Text className='self-center text-white font-semibold'>{t('networkScreen.actions.inviteFriends')}</Text>
                </TouchableOpacity>
            </Animated.View>
        );
    }

    return (
        <View className='flex-1'>
            <View className='z-[20]'>
                <Search
                    query={query}
                    onQuery={(text: string) => searchFilter(text)}
                    onSearch={onSearchHandler}
                    onClear={onClearSearchHandler}
                />
            </View>
            
            <View className='my-3' />
            <Header />
            <Animated.FlatList
                scrollEventThrottle={16}
                data={explore}
                keyExtractor={(item, index) => `${index}`}
                renderItem={({ item }) => <ExploreItem key={item.id} data={item} />}
                initialNumToRender={6}
                showsVerticalScrollIndicator={false}
                ItemSeparatorComponent={() => <View className='my-2' />}
                ListEmptyComponent={<Empty label='Nobody to explore' />}
                contentContainerStyle={{ 
                    // flexGrow: 1,
                    backgroundColor: colorScheme === 'dark' ? colors.black : colors.gray[100],
                    paddingTop: headerHeight / 4
                }}
                onEndReachedThreshold={0.3}
                onEndReached={loadMoreData}
                onScroll={handleScroll}
                onRefresh={initialRefetch}
                refreshing={isLoading}
                ListFooterComponent={<LoadMore isFetching={isFetching} />}
            />
        </View>
    );
}

export default ExploreConnections;

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 1,
    }
});