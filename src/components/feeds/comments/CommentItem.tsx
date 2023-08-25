import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';
import Autolink from 'react-native-autolink';

import { RootState } from '../../../store/store';
import { useAppSelector, useDebounce } from '../../../hooks';
import { CommentsType } from '../../../types/feed';
import Avatar from '../../common/Avatar';
import { CommentForm } from './';
import { IconCaretUp, IconCaretDown, IconHeart, IconHeartFill } from '../../../assets/icons';
import { showErrorToast, showSuccessToast, ago } from '../../../utils';
import { useToggleCommentReaction } from '../../../screens/feeds/hooks';

interface CommentItemProps {
    data: CommentsType
    isChild: boolean
    showParentDropdown?: boolean
    showChild?: boolean
    showParent?: boolean
    changeParentToggle?: (id: number) => void
    onSubmitChild: Function
}

const CommentItem = ({ data, isChild, showParentDropdown, showParent, showChild, changeParentToggle, onSubmitChild }: CommentItemProps) => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const { debounce } = useDebounce();
    const token = useAppSelector((state: RootState) => state.auth.token);
    const [showForm, setShowForm] = useState(false);
    const { mutateAsync: toggleCommentReaction } = useToggleCommentReaction();

    const onSubmitHander = (e: any) => {
        setShowForm(false);
        onSubmitChild(e)
    }

    const toggleCommentReactionHandler = async () => {
        try {
            const payload = {
                token: token,
                params: {
                    postCommentId: data.postCommentId,
                    reactionTypeId: 1
                }
            }

            const result = await toggleCommentReaction(payload);

            showSuccessToast(t('promptTitle.success'), result);
        } catch (error: any) {
            showErrorToast(t('promptTitle.error'), error.message);
        }
    }

    return (
        <View>
            <View className='flex-row space-x-3'>
                <Avatar size={40} image={data.profileImageUrl} />
                <View className='flex-1'>
                    <Text className='text-base font-medium dark:text-white'>{data.postedByName}</Text>
                    <View className='flex-row space-x-3'>
                        <Text className='text-xs dark:text-white'>@{data.postedByUsername}</Text>
                        <Text className='text-xs text-slate-500 dark:text-slate-400'>{ago(data)}</Text>
                    </View>
                    <View className='my-1' />
                    <Autolink 
                        text={data.postContent} 
                        renderText={(text) => <Text className='whitespace-normal dark:text-white'>{text}</Text>}
                    />
                    <View className='my-1' />
                    <View className='flex-row space-x-4 items-center'>
                        {
                            data.reactionsCount && data.reactionsCount > 0 && <Text className='dark:text-white'>{data.reactionsCount} {data.reactionsCount > 1 ? 'Likes' : 'Like'}</Text>
                        }
                        <Text className='text-blue-500' onPress={() => setShowForm(v => !v)}>Reply</Text>
                        <TouchableOpacity
                            onPress={() => debounce(toggleCommentReactionHandler)}
                        >
                            <IconHeart size={14} color={colorScheme === 'dark' ? colors.gray[400] : colors.black} />
                        </TouchableOpacity>
                    </View>
                    {
                        showForm 
                            &&
                                <CommentForm 
                                    isChild={true}
                                    isOwner={data.isOwnPost}
                                    onWriteParent={() => null}
                                    onWriteChild={(e: any) => onSubmitHander(e)}
                                />
                    }
                    <View className='my-1' />
                    {
                        data.commentReplies?.length
                            ? <>

                                    <TouchableOpacity
                                        className='flex-row space-x-3 items-center'
                                        onPress={() => changeParentToggle && changeParentToggle(data.postCommentId)}
                                    >
                                        {
                                            showParentDropdown
                                                ?
                                                <IconCaretUp size={14} color={colorScheme === 'dark' ? colors.white : colors.black} />
                                                : <IconCaretDown size={14} color={colorScheme === 'dark' ? colors.white : colors.black} />
                                        }
                                    <Text className='dark:text-white'>{data.commentReplies?.length} {data.commentReplies.length > 1 ? 'replies' : 'reply'}</Text>
                                    </TouchableOpacity>

                                <View className='my-2' />
                            </>
                            : null
                    }

                    {
                        showParentDropdown && data.commentReplies?.map((comment) =>
                            <View key={comment.postCommentId}>
                                <CommentItem 
                                    data={comment}
                                    isChild={true}
                                    showChild={false}
                                    showParent={false}
                                    showParentDropdown
                                    onSubmitChild={(e: any) => onSubmitChild(e)}

                                />
                                <View className='my-1' />
                            </View>
                        )
                    }
                </View>
            </View>
        </View>
    );
}

export default CommentItem;