import { 
    SafeAreaView,
    KeyboardAvoidingView,
    View, 
    FlatList, 
    useColorScheme
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';

import { MainNavigationParams } from '../../navigators/MainNavigation';
import Screen from '../../components/common/Screen';
import Loading from '../../components/common/Loading';
import Empty from '../../components/common/Empty';
import { IS_ANDROID, dismissKeyboard, showErrorToast, showSuccessToast } from '../../utils';
import { RootState } from '../../store/store';
import { useAppSelector, useDebounce, useRefreshOnFocus } from '../../hooks';
import { useFeedDetail, useAddComment, useAddReplyComment, useToggleCommentReaction } from './hooks';
import { CommentForm, CommentItem } from '../../components/feeds/comments';
import { useFocusEffect } from '@react-navigation/native';

interface RootCommentsProps {
    id: number
    show: boolean
}

type Props = StackScreenProps<MainNavigationParams, 'CommentListing'>;

const CommentListScreen = ({ route }: Props) => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const { debounce } = useDebounce();
    const { postId } = route.params;
    const { token } = useAppSelector((state: RootState) => state.auth);
    const [rootCommentDropdown, setRootCommentDropdown] = useState<RootCommentsProps[]>([]);
    const [showParentFormById, setShowParentFormById] = useState<RootCommentsProps[]>([]);
    const [showChildFormById, setShowChildFormById] = useState<RootCommentsProps[]>([]);
    const payload = {
        token: token,
        params: {
            postId: postId,
        }
    }
    const { mutateAsync: addComment } = useAddComment();
    const { mutateAsync: addReplyComment } = useAddReplyComment();
    const { mutateAsync: toggleCommentReaction } = useToggleCommentReaction();
    const { data, isLoading, isSuccess, isError, error: rqError, refetch, isStale } = useFeedDetail(payload);
    useRefreshOnFocus(refetch);

    const initData = () => {
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
    }

    useFocusEffect(useCallback(() => {
        initData();
    }, [isSuccess]))

    if (isLoading) {
        return (
            <Loading />
        );
    }

    if (isError) {
        showErrorToast(t('promptTitle.error'), rqError.message);
        return null;
    }

    const changeParentToggleHandler = (id: number) => {
        let newData = [...rootCommentDropdown];

        for (let item of newData) {
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
                    postId: postId,
                    comment: comment
                }
            }       
            await addComment(payload);
            
            showSuccessToast(t('promptTitle.success'), 'Comment has been added');
            initData();
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
            initData();
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    const toggleCommentReactionHandler = async (id: number) => {
        try {
            const payload = {
                token: token,
                params: {
                    postCommentId: id,
                    reactionTypeId: 1
                }
            }

            await toggleCommentReaction(payload);

            showSuccessToast(t('promptTitle.success'), '')
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    return (
        <SafeAreaView className='flex-1'>
            <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'padding'} className='flex-1'>
                <Screen>
                    <View onStartShouldSetResponder={dismissKeyboard}>
                        <FlatList
                            data={data?.comments}
                            keyExtractor={(item) => `${item.postCommentId}`}
                            ListHeaderComponent={
                                <View className='bg-gray-100 dark:bg-colors-new_2'>
                                    <CommentForm
                                        isChild={false}
                                        isOwner={false}
                                        onWriteParent={(e: string) => addCommentHandler(e)}
                                        onWriteChild={() => null}
                                    />
                                    <View className='my-4' />
                                </View>
                                
                            }
                            // ListHeaderComponentStyle={{
                            //     backgroundColor: `${colorScheme === 'dark' ? colors.black: colors.white}`
                            // }}
                            stickyHeaderIndices={[0]}
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
                            contentContainerStyle={{ flexGrow: 1 }}
                            ItemSeparatorComponent={() => <View className='my-2' />}
                        />
                    </View>
                </Screen>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

export default CommentListScreen;
