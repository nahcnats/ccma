import React from 'react';
import { View, Text } from "react-native";
import { useTranslation } from 'react-i18next';

interface ReactionSummaryProps {
    likes: number,
    comments: number
}

const ReactionSummary = ({likes, comments}: ReactionSummaryProps) => {
    const { t } = useTranslation();

    return (
        <View className="flex-row space-x-3 justify-start mt-4">
            {
                // likes > 0 ? <Text className="text-sm font-medium text-gray-400">{t('feedScreen.likes', {numLikes: likes})}</Text> : null
                likes > 0 ? <Text className="text-sm font-medium text-gray-400">{likes} {likes > 1 ? 'Likes' : 'Like'}</Text> : null
            }
            {
                // comments > 0 ? <Text className="text-sm font-medium text-gray-400">{t('feedScreen.comments', { numComments: comments })}</Text> : null
                comments > 0 ? <Text className="text-sm font-medium text-gray-400">{comments} {comments > 1 ? 'Comments' : 'Comment'}</Text> : null
            }
        </View>
    );
}

export default ReactionSummary;