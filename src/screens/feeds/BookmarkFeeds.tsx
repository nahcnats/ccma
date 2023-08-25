import { SafeAreaView, View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import colors from 'tailwindcss/colors';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { MainNavigationParams } from "../../navigators/MainNavigation";
import { RootState } from '../../store/store';
import Screen from '../../components/common/Screen';
import Loading from '../../components/common/Loading';
import Avatar from '../../components/common/Avatar';
import { IconDelete } from '../../assets/icons';
import { showErrorToast } from '../../utils';
import { useAppSelector, useDebounce, useRefreshOnFocus } from '../../hooks';
import { useBookmarkFeeds, useToggleBookmark } from './hooks';
import { Empty } from '../../components/connections';
import { SavedPostType } from '../../types/feed';

const SavedFeeds = () => {
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const { t } = useTranslation();
    const { debounce } = useDebounce();
    const [isUpdating, setIsUpdating] = useState(false);
    const { token } = useAppSelector((state: RootState) => state.auth);
    const payload = {
        token: token
    }
    const { data: bookmarks, isLoading, isStale, isError, error: rqError, refetch } = useBookmarkFeeds(payload);
    const { mutateAsync: toggleBookmark } = useToggleBookmark();
    useRefreshOnFocus(refetch);

    const toggleBookmarkHandler = async (postId: number) => {
        try {
            setIsUpdating(true);

            const payload = {
                token: token,
                params: {
                    postId: postId
                }
            }
            await toggleBookmark(payload);

            setIsUpdating(false);
        } catch (error: any) {
            setIsUpdating(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const BookmarkedItem = ({ data }: { data: SavedPostType }) => {
        return (
            <TouchableOpacity
                onPress={() => navigation.navigate('ShowFeed', { id: data.id, toComment: false })}
                className='flex-row space-x-4 p-4 rounded-md bg-colors-new_4 dark:bg-colors-new_2'
            >
                <Avatar image={data.profileImageUrl} size={60} />
                <View className='flex-row flex-1 justify-between items-center space-x-2'>
                    <View className='flex-1'>
                        <Text className='text-base font-600 dark:text-white' ellipsizeMode='tail' numberOfLines={1}>{data.content}</Text>
                        <Text className='text-sm dark:text-white' ellipsizeMode='tail' numberOfLines={1}>Article by {data.name}</Text>
                    </View>
                    <TouchableOpacity
                        className='p-2 rounded-full bg-red-400'
                        onPress={() => debounce(() => toggleBookmarkHandler(data.id))}
                        disabled={isUpdating}
                    >
                        <IconDelete size={20} color={colors.white} />
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    }

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        showErrorToast(t('promptTitle.error'), rqError.message);
        return null;
    }

    return (
        <SafeAreaView className='flex-1'>
            <Screen>
                <FlatList
                    data={bookmarks}
                    keyExtractor={(item, index) => `${index}`}
                    renderItem={({ item }) => <BookmarkedItem data={item} />}
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                    ItemSeparatorComponent={() => <View className='my-2' />}
                    ListEmptyComponent={<Empty label={t('jobScreen.prompts.noRecords')} />}
                />
            </Screen>
        </SafeAreaView>
    );
}

export default SavedFeeds;