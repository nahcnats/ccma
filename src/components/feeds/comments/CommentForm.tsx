import { View, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FormProvider, useForm, SubmitHandler, SubmitErrorHandler, FieldErrors } from 'react-hook-form';

import { IS_ANDROID } from '../../../utils';
import { TextInput } from '../../common/input';
import { maxLength, minHeight } from '../../../constants/others';

interface CommentFormProps {
    isChild: boolean
    isOwner: boolean | undefined
    onWriteParent: Function
    onWriteChild: Function
}

const CommentForm = ({ isChild, isOwner, onWriteParent, onWriteChild }: CommentFormProps) => {
    const { t } = useTranslation();
    const { ...methods } = useForm();
    const [comment, setComment] = useState('');
    const [replyComment, setReplyComment] = useState('');
    const [parentDisable, setParentDisable] = useState(true);
    const [childDisable, setChildDisable] = useState(true);

    useEffect(() => {
        if (comment !== '') {
            setParentDisable(false)
        } else {
            setParentDisable(true);
        }
    }, [comment]);

    useEffect(() => {
        if (replyComment !== '') {
            setChildDisable(false)
        } else {
            setChildDisable(true);
        }
    }, [replyComment]);

    const onWriteParentHandler = () => {
        onWriteParent(comment);
        setComment('');
    }

    const onWriteChildHandler = () => {
        onWriteChild(replyComment);
        setReplyComment('');
    }

    return (
        <FormProvider {...methods}>
            <TextInput
                name='comment'
                placeholder={`${t('commentScreen.writeAComment')}`}
                multiline
                numberOfLines={3}
                onChangeText={(e) => isChild ? setReplyComment(e) : setComment(e)}
                textAlignVertical='top'
                maxLength={maxLength}
                style={{
                    minHeight: 50
                }}
                minHeight={50}
                value={isChild ? replyComment : comment}
            />
            <View className='my-2' />
            <View className='justify-end items-end'>
                {
                    isChild
                        ?
                        <TouchableOpacity
                            className={`bg-amber-500 ${childDisable && 'opacity-50'} w-20 rounded-lg px-4 ${IS_ANDROID ? 'py-1 mt-1' : 'py-2'}`}
                            onPress={onWriteChildHandler}
                            disabled={childDisable}
                        >
                            <Text className='self-center text-white font-medium'>
                                {/* { isOwner ? 'Edit' : 'Write'} */}
                                Post
                            </Text>
                        </TouchableOpacity>
                        :
                        <TouchableOpacity
                            className={`bg-amber-500 ${parentDisable && 'opacity-50'} w-20 rounded-lg px-4 ${IS_ANDROID ? 'py-1 mt-1' : 'py-2'}`}
                            onPress={onWriteParentHandler}
                            disabled={parentDisable}
                        >
                            <Text className='self-center text-white font-medium'>Post</Text>
                        </TouchableOpacity>
                }
            </View>
            
        </FormProvider>
    );
}

export default CommentForm;