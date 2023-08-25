import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import colors from 'tailwindcss/colors';
import { useColorScheme } from 'react-native';

import { IconHeart,  IconShare, IconBookmark } from '../../../../assets/icons';
import IconLike from '../../../../assets/icons/svgs/Like.svg'
import IconComment from '../../../../assets/icons/svgs/Comments.svg'
import IconLikeDark from '../../../../assets/icons/svgs/LikeDark.svg'
import IconCommentDark from '../../../../assets/icons/svgs/CommentsDark.svg'

type FooterProps = {
    onComment: () => void
    onLike: () => void
    onBookmark: () => void
    hideComment?: boolean
    hideShare?: boolean
}

const options = ['Like', 'Comment', 'Share', 'Save'];

function Footer({ onComment, onLike, onBookmark, hideComment, hideShare }: FooterProps) {
    const colorScheme = useColorScheme();

    return (
        <View className={`flex-row ${hideComment || hideShare ? 'justify-around' : 'justify-between'} mt-4 border-t border-gray-300 py-4 px-4 z-10`}>
            <TouchableOpacity onPress={onLike}>
                {
                    colorScheme === 'dark' ? <IconLikeDark width={24} height={24} color={colors.gray[500]} /> : <IconLike width={24} height={24} color={colors.gray[500]} />
                }
            </TouchableOpacity>
            {
                hideComment ? null : 
                    <TouchableOpacity onPress={onComment}>
                        {
                            colorScheme === 'dark' ? <IconCommentDark width={24} height={24} color={colors.gray[500]} /> : <IconComment width={24} height={24} color={colors.gray[500]} />
                        }
                    </TouchableOpacity>
            }
            {
                hideShare ? null :
                    <TouchableOpacity onPress={() => null}>
                        <IconShare size={18} color={colors.gray[500]} />
                    </TouchableOpacity>
            }
            
            {/* <TouchableOpacity onPress={onBookmark}>
                <IconBookmark size={18} color={colors.gray[500]} />
            </TouchableOpacity> */}
        </View>
    );
}

export default Footer;