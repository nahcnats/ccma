import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { View, Text, Pressable, TouchableOpacity, Alert, Image  } from "react-native";
import colors from "tailwindcss/colors";
import { useColorScheme } from 'react-native';
import { useTranslation } from 'react-i18next';
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import Autolink from 'react-native-autolink';
import ViewMoreText from 'react-native-view-more-text';

import { MainNavigationParams } from '../../../navigators/MainNavigation';
import { RootState } from '../../../store/store';
import { useAppSelector, useDebounce } from '../../../hooks';
import Avatar from "../../common/Avatar";
import ActionSheet from '../../common/ActionSheet';
import { IconMoreVertical, IconBookmark, IconReport, IconEdit, IconDelete } from "../../../assets/icons";
import ImageSlider from '../../common/ImageSlider';
import ImageSliderByUrl from '../../common/ImageSliderByUrl';
import { ReactionSummary, Footer } from './children';
import { FeedType } from '../../../types/feed';
import themeColors from '../../../constants/theme';
import { 
    useToggleReaction, 
    useToggleBookmark, 
    useDeletePost,

} from '../../../screens/feeds/hooks';
import { showErrorToast, showSuccessToast, ago } from '../../../utils';
import { getBookmarkStatus } from '../../../screens/feeds/services';
import MoreIcon from '../../../assets/icons/svgs/more.svg';
import MoreIconDark from '../../../assets/icons/svgs/moreDark.svg';
import { renderViewMore, renderViewLess } from '../../common/ViewMoreLess';

interface FeedItemProps {
    data: FeedType
}

const FeedItem = ({ data }: FeedItemProps) => {
    const { t } = useTranslation();
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const token = useAppSelector((state: RootState) => state.auth.token);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const { debounce } = useDebounce();
    const [isOpen, setIsOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [isBookmarked, setIsBookmark] = useState(false);
    const colorScheme = useColorScheme();
    const iconColor = colorScheme === 'dark' ? colors.white  : colors.black;
    const light = themeColors.badge;

    const snapPoints = useMemo(() => ['22%'], []);
    const { mutateAsync: toggleReaction } = useToggleReaction();
    const { mutateAsync: toggleBookmark } = useToggleBookmark();
    const { mutateAsync: deletePost } = useDeletePost();

    const getBookmarkStatusHandler = async() => {
        try {
            const payload = {
                token: token,
                params: {
                    postId: data.postId
                }
            }

            const result = await getBookmarkStatus(payload);

            if (!result) return;

            setIsBookmark(result.isBookmarked);
        } catch (error) {
            
        }
    }

    const closeBottomSheet = useCallback(() => {
        setIsOpen(false);
        bottomSheetModalRef.current?.dismiss();
    }, [isOpen]);

    const handleSheetChanges = useCallback(() => {
        setIsOpen(v => !v);

        if (isOpen) {
            bottomSheetModalRef.current?.dismiss();
        } else {
            bottomSheetModalRef.current?.present();
        }
    }, [isOpen]);

    useEffect(() => {
        getBookmarkStatusHandler();
    }, [handleSheetChanges]);


    const toggleReactionHandler = async () => {
        if (isUpdating) {
            return;
        }

        setIsUpdating(true);

        try {
            const payload = {
                token: token,
                params: {
                    postId: data?.postId,
                    reactionTypeId: 1
                }
            }

            const result = await toggleReaction(payload);
            setIsUpdating(false);
            showSuccessToast(t('promptTitle.success'), result);
        } catch (error: any) {
            setIsUpdating(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const toggleBookmakrHandler = async () => {
        closeBottomSheet();

        if (isUpdating) {
            return;
        }

        setIsUpdating(true);

        try {
            const payload = {
                token: token,
                params: {
                    postId: data?.postId,
                }
            }

            const result = await toggleBookmark(payload);
            setIsUpdating(false);
            showSuccessToast(t('promptTitle.success'), result);
        } catch (error: any) {
            setIsUpdating(false);
            showErrorToast(t('promptTitle.error'), error.message);
        }
    };

    const deletePostHandler = () => {
        closeBottomSheet();

        Alert.alert('Warning', 'Once post is deleted it cannot be recovered. Are you sure you want to delete this post?', [
            {
                text: 'Cancel',
                onPress: () => null,
                // style: "cancel"
            },
            {
                text: 'Delete',
                onPress: confirmDeletePost
            }
        ]);
    }

    const confirmDeletePost = async () => {
        try {
            const payload = {
                token: token,
                params: {
                    postId: data?.postId,
                }
            }

            const result = await deletePost(payload);
            showSuccessToast(t('promptTitle.success'), result);
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const editPostHandler = () => {
        closeBottomSheet();

        navigation.navigate('EditFeed', { postId: data?.postId});
    }

    const reportPostHandler = () => {
        closeBottomSheet();

        navigation.navigate('ReportPost', { postId: data?.postId});
    }

    // const CarouselSection = () => {
    //     if (!data.postImages.length) {
    //         return null
    //     }

    //     let media: object[] = [];
    //     data.postImages.map(item => {
    //         media.push({
    //             type: 'url',
    //             url: item,
    //             fullUrl: item,
    //         });
    //     });

    //     return (
    //         <>
    //             <View className='my-4' />
    //             <ImageSliderByUrl images={media} />
    //         </> 
    //     );
    // }
    
    return (
        <>
            <View 
                className='rounded-md p-4 mb-4 bg-white dark:bg-colors-new_3' 
                // style={{ 
                //     shadowColor: "#000", 
                //     shadowOffset: { width: 0, height: 2, }, 
                //     shadowOpacity: 0.25,
                //     shadowRadius: 3.84,
                //     elevation: 5
                // }}
            >
                <Pressable onPress={() => navigation.navigate('ShowFeed', {id: data.postId})}>
                    <View className="flex-row justify-between">
                        <View className="flex-row space-x-3">
                            <Avatar image={data?.profileImageUrl} size={50} />
                            <View>
                                <Text className="text-base font-semibold dark:text-white">{data?.postedByName}</Text>
                                <View className="flex-row space-x-3 mt-1">
                                    <Text className='dark:text-white'>{data?.postedByUsername}</Text>
                                    <Text className="text-gray-400">{ago(data)}</Text>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity onPress={handleSheetChanges}>
                            {/* <IconMoreVertical size={20} color={iconColor} /> */}
                            {
                                colorScheme === 'dark' ? <MoreIconDark width={30} height={30} color={iconColor} /> : <MoreIcon width={30} height={30} color={iconColor} />
                            }
                        </TouchableOpacity>
                    </View>
                    <View className="mt-4">
                        
                            <Autolink
                                text={data?.postContent}
                                renderText={(text) => 
                                    <ViewMoreText
                                        numberOfLines={3}
                                        renderViewMore={(onPress) => renderViewMore(onPress)}
                                        renderViewLess={(onPress) => renderViewLess(onPress)}
                                    >
                                        <Text className="dark:text-white">{text}</Text>
                                    </ViewMoreText>
                                }
                            />
                    </View>
                </Pressable>
                {/* <CarouselSection /> */}
                <View className='my-4' />
                <ImageSliderByUrl images={data.postImages} />
                <View className='my-4' />
                <ReactionSummary likes={data?.reactionsCount} comments={data?.commentsCount} />
                <Footer
                    onComment={() => navigation.navigate('CommentListing', {postId: data.postId})} 
                    onLike={() => debounce(toggleReactionHandler)} 
                    onBookmark={() => debounce(toggleBookmakrHandler)}
                    hideShare
                />
            </View>
            <ActionSheet
                ref={bottomSheetModalRef}
                snapPoints={snapPoints}
                onDismiss={closeBottomSheet}
            >
                <View className='flex-1 py-4 px-6 dark:bg-colors-new_2'>
                    <TouchableOpacity
                        className='flex-row space-x-6 items-center'
                        onPress={data.isOwnPost ? editPostHandler : toggleBookmakrHandler}
                    >
                        {
                            data.isOwnPost ? 
                                <IconEdit size={28} color={colorScheme === 'dark' ? colors.slate[300] : colors.gray[800]} /> :
                                <IconBookmark size={30} color={colorScheme === 'dark' ? colors.slate[300] : colors.gray[800]} />
                        }
                        {
                            data.isOwnPost ? 
                                <View>
                                    <Text className='text-base font-semibold dark:text-white'>Edit</Text>
                                    <Text className='text-gray-700 dark:text-slate-100'>Make changes to your post</Text>
                                </View> :
                                <View>
                                    <Text className='text-base font-semibold dark:text-white'>{isBookmarked ? t('feedScreen.actions.unsave') : t('feedScreen.actions.save')}</Text>
                                    <Text className='text-gray-700 dark:text-slate-100'>{!isBookmarked ? t('feedScreen.actionSheets.saveDesc') : t('feedScreen.actionSheets.unsaveDesc')}</Text>
                                </View>
                        }
                        
                    </TouchableOpacity>
                    <View className='my-2' />
                    <TouchableOpacity
                        className='flex-row space-x-6 items-center'
                        onPress={data.isOwnPost ? deletePostHandler : reportPostHandler}
                    >
                        {
                            data.isOwnPost ?
                                <IconDelete size={28} color={colorScheme === 'dark' ? colors.slate[300] : colors.gray[800]} /> :
                                <IconReport size={24} color={colorScheme === 'dark' ? colors.slate[300] : colors.gray[800]} />
                        }
                        {
                            data.isOwnPost ?
                                <View>
                                    <Text className='text-base font-semibold dark:text-white'>Delete</Text>
                                    <Text className='text-gray-700 dark:text-slate-100'>Trash your post forever</Text>
                                </View> :
                                <View>
                                    <Text className='text-base font-semibold dark:text-white'>{t('feedScreen.actions.report')}</Text>
                                    <Text className='text-gray-700 dark:text-slate-100'>{t('feedScreen.actionSheets.reportDesc')}</Text>
                                </View>
                        }
                    </TouchableOpacity>
                </View>
            </ActionSheet>
        </>
    );
}

export default FeedItem;