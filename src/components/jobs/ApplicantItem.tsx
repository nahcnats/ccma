import { View, Text, TouchableOpacity, Linking, useColorScheme } from 'react-native';
import React, { useRef, useCallback, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import Clipboard from '@react-native-clipboard/clipboard';

import { JobsByIdApplicantsType } from '../../types/jobs';
import Avatar from '../common/Avatar';
import { 
    IconEmail, 
    IconFilePDF, 
    IconMoreVertical,
    IconCall,
    IconKeypad,
    IconAlias,
    IconThumbsUp,
    IconThumbsDown,
} from '../../assets/icons';
import ActionSheet from '../common/ActionSheet';
import { showSuccessToast } from '../../utils';
import themeColor from '../../constants/theme';

interface ApplicantItemProps {
    data: JobsByIdApplicantsType
    onShortListed: () => void
    onUnSuccessful: () => void
}

export default function ApplicantItem({ data, onShortListed, onUnSuccessful }: ApplicantItemProps) {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const [isOpen, setIsOpen] = useState(false);
    const {
        applicationStatusValue,
        applicationStatusCode,
        profileImageUrl,
        name,
        email,
        phoneNumber,
        cvUrl,
    } = data;
    const statusCodeColor = [
        { code: 'PENDING', color: colors.yellow[500] },
        { code: 'SHORTLISTED', color: colors.green[500] },
        { code: 'INTERVIEWED', color: colors.blue[500] },
        { code: 'OFFERED', color: colors.indigo[500] },
        { code: 'NOTIFIED', color: colors.orange[500] },
        { code: 'UNSUCCESSFUL', color: colors.red[500] },
    ];
    const [isDisable, setIsDisable] = useState(applicationStatusCode !== 'PENDING' ? true : false);
    const snapPoints = useMemo(() => ['40%'], []);

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

    const statusColorSelector = (applicationStatusCode: string) => {
        return statusCodeColor.find(item => item.code === applicationStatusCode)?.color;
    }

    const copyToClipboard = (textValue: string) => {
        Clipboard.setString(textValue);
        showSuccessToast(t('promptTitle.success'), t('applicantItem.prompts.copyText'));
    }
    
    return (
        <>
            <View className='p-4 rounded-md bg-white dark:bg-colors-new_2'>
                <View
                    className='self-end mb-2 py-1 px-4 rounded-md max-w-fits'
                    style={{
                        backgroundColor: statusColorSelector(applicationStatusCode)
                    }}
                >
                    <Text className='self-center font-[500] text-white'>{applicationStatusValue?.toUpperCase()}</Text>
                </View>
                <View className='my-2' />
                <View className='flex-row justify-between items-start'>
                    <View className='flex-row space-x-3'>
                        <Avatar
                            size={44}
                            image={profileImageUrl}
                        />
                        <View>
                            <Text className='leading-6 font-semibold dark:text-white'>{name}</Text>
                            <Text className='dark:text-white'>{email}</Text>
                        </View>
                    </View>
                    <View className='flex-row space-x-5'>
                        <TouchableOpacity
                            onPress={() => Linking.openURL(cvUrl)}
                        >
                            <IconFilePDF size={20} color={colorScheme === 'dark' ? colors.gray[400] : colors.black} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSheetChanges}
                        >
                            <IconMoreVertical size={22} color={colorScheme === 'dark' ? colors.gray[400] : colors.black} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View className='my-4' />
                <View className='flex-row justify-between space-x-6'>
                    <TouchableOpacity
                        className='flex-1 rounded-lg p-2 items-center justify-center bg-colors-new_1'
                        onPress={() => Linking.openURL(`tel:${phoneNumber}`)}
                    >
                        <View className='flex-row space-x-3 justify-center item-center'>
                            <IconCall size={20} color={colors.white} />
                            <Text className='text-base text-white'>{t('applicantItem.callButton')}</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                        className='flex-1 rounded-lg p-2 items-center justify-center border bg-colors-new_1'
                        onPress={() => Linking.openURL(`mailto:${email}`)}
                    >
                        <View className='flex-row space-x-3 justify-center item-center'>
                            <IconEmail size={24} color={colorScheme === 'dark' ? colors.gray[400] : colors.black} />
                            <Text className='text-base dark:text-white'>{t('applicantItem.sendEmailButton')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
            <ActionSheet 
                ref={bottomSheetModalRef} 
                snapPoints={snapPoints}
                onDismiss={closeBottomSheet}
            >
                <View className='flex-1 p-4 dark:bg-colors-new_2'>
                    <TouchableOpacity 
                        className='flex-row justify-between items-center space-x-3'
                        onPress={() => {
                            closeBottomSheet();
                            copyToClipboard(phoneNumber);
                        }}
                    >
                        <IconKeypad size={24} color={colorScheme === 'dark' ? colors.white : colors.black} />
                        <View className='flex-1'>
                            <Text className='font-bold text-base dark:text-white'>{t('applicantItem.actionList.copyPhoneTitle')}</Text>
                            <Text className='dark:text-white'>{t('applicantItem.actionList.copyPhoneText')}</Text>        
                        </View>
                    </TouchableOpacity>
                    <View className='my-3' />
                    <TouchableOpacity 
                        className='flex-row justify-between items-center space-x-3'
                        onPress={() => {
                            closeBottomSheet();
                            copyToClipboard(email)
                        }}
                    >
                        <IconAlias size={24} color={colorScheme === 'dark' ? colors.white : colors.black} />
                        <View className='flex-1'>
                            <Text className='font-bold text-base dark:text-white'>{t('applicantItem.actionList.copyEmailTitle')}</Text>
                            <Text className='dark:text-white'>{t('applicantItem.actionList.copyEmailTitle')}</Text>
                        </View>
                    </TouchableOpacity>
                    <View className='my-3' />
                    <TouchableOpacity 
                        className='flex-row justify-between items-center space-x-3'
                        onPress={() => {
                            closeBottomSheet();
                            onShortListed();
                        }}
                        disabled={isDisable}
                    >
                        <IconThumbsUp size={24} color={isDisable ? colors.gray[400] : (colorScheme === 'dark' ? colors.white : colors.black)} />
                        <View className='flex-1'>
                            <Text className={`font-bold text-base dark:text-white ${isDisable && 'text-gray-400'} `}>{t('applicantItem.actionList.shortListedTitle')}</Text>
                            <Text className={`dark:text-white ${isDisable && 'text-gray-400'}`}>{t('applicantItem.actionList.shortListedText')}</Text>
                        </View>
                    </TouchableOpacity>
                    <View className='my-3' />
                    <TouchableOpacity 
                        className='flex-row justify-between items-center space-x-3'
                        onPress={() => {
                            closeBottomSheet();
                            onUnSuccessful();
                        }}
                        disabled={isDisable}
                    >
                        <IconThumbsDown size={24} color={isDisable ? colors.gray[400] : (colorScheme === 'dark'? colors.white : colors.black )} />
                        <View className='flex-1'>
                            <Text className={`font-bold text-base dark:text-white ${isDisable && 'text-gray-400'}`}>{t('applicantItem.actionList.unsuccessfulTitle')}</Text>
                            <Text className={`dark:text-white ${isDisable && 'text-gray-400'}`}>{t('applicantItem.actionList.unsuccessfulText')}</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </ActionSheet>
        </>
    );
}