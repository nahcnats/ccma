import { SafeAreaView, View, Text, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import colors from 'tailwindcss/colors';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import { RootState } from '../../../store/store';
import Screen from '../../../components/common/Screen';
import Loading from '../../../components/common/Loading';
import Avatar from '../../../components/common/Avatar';
import { IconDelete } from '../../../assets/icons';
import { showErrorToast } from '../../../utils';
import { useAppSelector, useDebounce } from '../../../hooks';
import { useBookmarkList, useUpdateBookmarkJobById } from '../hooks';
import { Empty } from '../../../components/connections';
import { BookmarkListType } from '../../../types/jobs';
import { MainNavigationParams } from "../../../navigators/MainNavigation";
import Crash from '../../../components/common/Crash';

const SavedJobs = () => {
    const { t } = useTranslation();
    const { debounce } = useDebounce();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const [isUpdating, setIsUpdating] = useState(false);
    const { token } = useAppSelector((state: RootState) => state.auth);
    const payload = {
        token: token
    }
    const { data: bookmarks, isLoading, isError, error: rqError } = useBookmarkList(payload);
    const { mutateAsync: updateBookmarkJobById } = useUpdateBookmarkJobById();

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        showErrorToast(t('promptTitle.error'), rqError.message);
        return <Crash message={rqError.message} />
    }

    const BookmarkedItem = ({ data }: { data: BookmarkListType }) => {
        const toggleBookmarkHandler = (jobId: number) => {
            try {
                setIsUpdating(true);

                const payload = {
                    token: token,
                    params: {
                        jobId: jobId
                    }
                }
                updateBookmarkJobById(payload);

                setIsUpdating(false);
            } catch (error: any) {
                setIsUpdating(false);
                showErrorToast(t('promptTitle.error'), error.message);
            }
        }

        const showJobHandler = () => {
            navigation.navigate('ShowJob', { jobId: data.jobId })
        }
        
        return (
            <View
                className='flex-row space-x-4 p-2 rounded-md bg-colors-new_4 dark:bg-colors-new_2'
            >
                <TouchableOpacity onPress={showJobHandler}>
                    <Avatar image={null} size={60} />
                </TouchableOpacity>
                <View className='flex-row flex-1 justify-between items-center'>
                    <TouchableOpacity className='flex-1' onPress={showJobHandler}>
                        <Text className='text-base font-600 dark:text-white' ellipsizeMode='tail' numberOfLines={1}>{data.title}</Text>
                        <Text className='text-sm dark:text-white' ellipsizeMode='tail' numberOfLines={1}>{t('jobScreen.saveJobs.jobBy')} {data.companyName}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className='p-2 rounded-full bg-red-400'
                        onPress={() => debounce(() => toggleBookmarkHandler(data.jobId))}
                        disabled={isUpdating}
                    >
                        <IconDelete size={20} color={colors.white} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }

    return (
        <FlatList
            data={bookmarks}
            keyExtractor={(item, index) => `${item.jobId}`}
            renderItem={({ item }) => <BookmarkedItem data={item} />}
            contentContainerStyle={{ flexGrow: 1 }}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View className='my-2' />}
            ListEmptyComponent={<Empty label={t('jobScreen.prompts.noRecords')} />}
        />
    );
}

export default SavedJobs;