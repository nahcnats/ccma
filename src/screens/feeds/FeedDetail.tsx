import { 
    SafeAreaView,
    View, 
    Text, 
    FlatList,
    TouchableOpacity, 
    KeyboardAvoidingView, 
    useColorScheme,
    Alert,
} from 'react-native';
import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { StackScreenProps } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import colors from 'tailwindcss/colors';
import Autolink from 'react-native-autolink';

// import { FeedItemTypes } from '../../types/FeedType';
import { RootState } from '../../store/store';
import { MainNavigationParams } from "../../navigators/MainNavigation";
import Screen from '../../components/common/Screen';
import Avatar from '../../components/common/Avatar';
import { IconMoreVertical, IconDelete, IconReport, IconEdit, IconBookmark } from '../../assets/icons';
import { ReactionSummary, Footer } from '../../components/feeds/feedItem/children';
import { IS_ANDROID, dismissKeyboard } from '../../utils';
import { useAddComment, useAddReplyComment, useDeletePost, useFeedDetail, useToggleBookmark, useToggleCommentReaction, useToggleReaction } from './hooks';
import { useAppSelector, useDebounce } from '../../hooks';
import Loading from '../../components/common/Loading';
import { showErrorToast, showSuccessToast, ago } from '../../utils';
import { getBookmarkStatus } from './services';
import { Empty } from '../../components/connections';
import { CommentItem, CommentForm } from '../../components/feeds/comments';
import ActionSheet from '../../components/common/ActionSheet';
import ImageSlider from '../../components/common/ImageSlider';

type Props = StackScreenProps<MainNavigationParams, 'ShowFeed'>;

interface RootCommentsProps {
    id: number
    show: boolean
}

const FeedDetailScreen = ({ route }: Props) => {
    const { t } = useTranslation();
    const { debounce } = useDebounce();
    const { id, toComment } = route.params;
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const snapPoints = useMemo(() => ['25%'], []);
    const [isBookmarked, setIsBookmark] = useState(false);
    const [rootCommentDropdown, setRootCommentDropdown] = useState<RootCommentsProps[]>([]);
    const [showParentFormById, setShowParentFormById] = useState<RootCommentsProps[]>([]);
    const [showChildFormById, setShowChildFormById] = useState<RootCommentsProps[]>([]);
    const navigation = useNavigation<StackNavigationProp<MainNavigationParams>>();
    const colorScheme = useColorScheme();
    const { token } = useAppSelector((state: RootState) => state.auth);
    const payload = {
        token: token,
        params: {
            postId: id
        }
    }
    const { data, isLoading, isSuccess, isError, error: rqError } = useFeedDetail(payload);
    const { mutateAsync: toggleReaction } = useToggleReaction();
    const { mutateAsync: toggleBookmark } = useToggleBookmark();
    const { mutateAsync: addComment } = useAddComment();
    const { mutateAsync: addReplyComment } = useAddReplyComment();
    // const { mutateAsync: toggleCommentReaction } = useToggleCommentReaction();
    const { mutateAsync: deletePost } = useDeletePost();

    useEffect(() => {
        let newParentFormDropdown = [] as any;
        let newShowParentFormById = [] as any;
        let newShowChildFormById = [] as any;

        data?.comments && data?.comments.map((item) => {
            newParentFormDropdown.push({ id: item.postCommentId, show: false });
            newShowParentFormById.push({ id: item.postCommentId, show: false });

            if (item.commentReplies && item.commentReplies?.length > 0) {
                item.commentReplies.map((item) => {
                    newShowChildFormById.push({ id: item.postCommentId, show: false })
                });
            }
        });

        setRootCommentDropdown(newParentFormDropdown);
        setShowParentFormById(newShowParentFormById);
        setShowChildFormById(newShowChildFormById);
    }, [isSuccess]);

    const handleSheetChanges = () => {
        dismissKeyboard();
        setIsOpen(v => !v);

        if (isOpen) {
            bottomSheetModalRef.current?.dismiss();
        } else {
            bottomSheetModalRef.current?.present();
        }
    };

    const closeBottomSheet = useCallback(() => {
        dismissKeyboard();
        setIsOpen(false);
        bottomSheetModalRef.current?.dismiss();
    }, [isOpen]);

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
                    postId: id,
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

    const getBookmarkStatusHandler = async () => {
        try {
            const payload = {
                token: token,
                params: {
                    postId: id
                }
            }

            const result = await getBookmarkStatus(payload);

            if (!result) return;

            setIsBookmark(result.isBookmarked);
        } catch (error) {

        }
    }

    const changeParentToggleHandler = (id: number) => {
        let newData = [...rootCommentDropdown];

        for (const item of newData) {
            if (item.id === id) {
                item.show = !item.show
            }
        }

        setRootCommentDropdown(newData);
    }

    const addCommentHandler = async (comment: string) => {
        try {
            const payload = {
                token: token,
                params: {
                    postId: id,
                    comment: comment
                }
            }
            await addComment(payload);

            showSuccessToast(t('promptTitle.success'), 'Comment added');
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const addReplyCommentHandler = async (id: number, comment: string) => {
        try {
            const payload = {
                token: token,
                params: {
                    postCommentId: id,
                    reply: comment
                }
            }
            await addReplyComment(payload);

            showSuccessToast(t('promptTitle.success'), 'Reply added');
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const toggleReactionHandler = async () => {
        if (isUpdating) {
            return;
        }

        setIsUpdating(true);

        try {
            const payload = {
                token: token,
                params: {
                    postId: id,
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

    useEffect(() => {
        getBookmarkStatusHandler();
    }, [handleSheetChanges]);

    const CarouselSection = () => {
        if (!data?.postImages.length) {
            return null
        }

        let media: object[] = [];
        data.postImages.map(item => {
            media.push({
                type: 'url',
                url: item,
                fullUrl: item,
            });
        });

        return (
            <>
                <View className='my-4' />
                <ImageSlider images={media} />
            </>
        );
    }


    const FeedContent = () => {
        return (
            <View className='flex-1' 
                onStartShouldSetResponder={() => {
                    dismissKeyboard();
                    closeBottomSheet();

                    return true
                }}
            >
                <View className={`flex-row justify-between ${!IS_ANDROID && 'mt-3'}`}>
                    <View className='flex-row space-x-3'>
                        <Avatar image={data?.profileImageUrl} size={50} />
                        <View>
                            <Text className={`text-base font-semibold ${colorScheme === 'dark' && 'text-white'}`}>{data?.postedByName}</Text>
                            <View className="flex-row space-x-3 mt-1">
                                <Text className={`${colorScheme === 'dark' && 'text-white'}`}>@{data?.postedByUsername}</Text>
                                <Text className="text-gray-400">{ago(data)}</Text>
                            </View>
                        </View>
                    </View>
                    <TouchableOpacity onPress={handleSheetChanges} className='z-10'>
                        <IconMoreVertical size={20} color={colorScheme === 'dark' ? colors.white : colors.black} />
                    </TouchableOpacity>
                    
                </View>
                <View className='mt-4'>
                    <Autolink
                        text={data?.postContent || ''}
                        renderText={(text) => <Text className="dark:text-white">{text}</Text>}
                    />
                </View>
                <CarouselSection />
                <ReactionSummary likes={data?.reactionsCount || 0} comments={data?.commentsCount || 0} />
                <Footer
                    onComment={() => navigation.navigate('CommentListing', { postId: id })}
                    onLike={() => debounce(toggleReactionHandler)} 
                    onBookmark={() => debounce(toggleBookmakrHandler)}
                    hideComment
                    hideShare
                />
            </View> 
        );
    }

    const CommentFormElement = () => {
        return (
            <View
                onStartShouldSetResponder={() => {
                    dismissKeyboard();
                    closeBottomSheet();

                    return true
                }}
            >
                <CommentForm
                    isChild={false}
                    isOwner={false}
                    onWriteParent={(e: string) => addCommentHandler(e)}
                    onWriteChild={() => null}
                />
            </View>
        );
    }

    const deletePostHandler = async () => {
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
                    postId: id,
                }
            }

            await deletePost(payload);
            showSuccessToast(t('promptTitle.success'), 'Feed deleted');
            navigation.goBack();
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }


    const editPostHandler = () => {
        closeBottomSheet();

        navigation.navigate('EditFeed', { postId: id });
    }

    const reportPostHandler = () => {
        closeBottomSheet();

        navigation.navigate('ReportPost', { postId: id });
    }

    if (isLoading) {
        return <Loading />
    }

    if (isError) {
        showErrorToast(t('promptTitle.error'), rqError.message);
    }
    
    return (
        <SafeAreaView className='flex-1'>
            <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'padding'} className='flex-1'>
                <Screen>
                    <View className='flex-1'>
                        <FlatList
                            data={data?.comments}
                            keyExtractor={(item) => `${item.postCommentId}`}
                            ListHeaderComponent={
                                <>
                                    <FeedContent />
                                    <CommentFormElement />
                                    <View className='my-4' />
                                </>
                            }
                            renderItem={({ item, index }) =>
                                <CommentItem
                                    data={item}
                                    isChild={false}
                                    showParentDropdown={rootCommentDropdown.find(parent => parent.id === item.postCommentId)?.show || false}
                                    showParent={showParentFormById.find(parent => parent.id === item.postCommentId)?.show || false}
                                    showChild={showChildFormById.find(child => child.id === item.postCommentId)?.show || false}
                                    changeParentToggle={(e) => changeParentToggleHandler(e)}
                                    onSubmitChild={(e: any) => addReplyCommentHandler(item.postCommentId, e)}
                                />
                            }
                            ListEmptyComponent={<Empty label={t('feedScreen.prompts.noComments')} />}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{
                                flexGrow: 1,
                            }}
                            ItemSeparatorComponent={() => <View className='my-2' />}
                        />
                    </View>
                </Screen>
                <ActionSheet
                    ref={bottomSheetModalRef}
                    snapPoints={snapPoints}
                    onDismiss={closeBottomSheet}
                >
                    <View className='flex-1 py-4 px-6 dark:bg-colors-new_2'>
                        <TouchableOpacity
                            className='flex-row space-x-6 items-center'
                            onPress={data?.isOwnPost ? editPostHandler : toggleBookmakrHandler}
                        >
                            {
                                data?.isOwnPost ?
                                    <IconEdit size={28} color={colorScheme === 'dark' ? colors.slate[300] : colors.gray[800]} /> :
                                    <IconBookmark size={30} color={colorScheme === 'dark' ? colors.slate[300] : colors.gray[800]} />
                            }
                            {
                                data?.isOwnPost ?
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
                            onPress={data?.isOwnPost ? deletePostHandler : reportPostHandler}
                        >
                            {
                                data?.isOwnPost ?
                                    <IconDelete size={28} color={colorScheme === 'dark' ? colors.slate[300] : colors.gray[800]} /> :
                                    <IconReport size={24} color={colorScheme === 'dark' ? colors.slate[300] : colors.gray[800]} />
                            }
                            {
                                data?.isOwnPost ?
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
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default FeedDetailScreen;