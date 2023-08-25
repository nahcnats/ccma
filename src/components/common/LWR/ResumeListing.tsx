import { 
    ScrollView,
    View, 
    Text,
    TouchableOpacity,
    ActivityIndicator, 
    useColorScheme,
} from 'react-native'
import React, { useState } from 'react'
import DocumentPicker, {
    isInProgress,
    types
} from 'react-native-document-picker';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';

import { RootState } from '../../../store/store';
import { IconFileUpload } from '../../../assets/icons';
import { useDebounce, useAppSelector } from '../../../hooks';
import { showErrorToast, showWarnToast, showSuccessToast } from '../../../utils';
import { convertFileToBase64 } from '../../../utils';
import { useAddCreativeCv } from '../../../screens/jobs/hooks';
import { UploadCvProps } from '../../../screens/jobs/services';

interface ResumeListingProps {
    title: string,
    children: React.ReactNode
}

/**
 * Children should be of FlatList element. Else it will break
 */
export default function ResumeListing({ title, children }: ResumeListingProps) {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const { debounce } = useDebounce();
    const [isUploading, setIsUploading] = useState(false);
    const token = useAppSelector((state: RootState) => state.auth.token);
    const { mutateAsync: addCv } = useAddCreativeCv();

    const handleError = (err: any) => {
        if (DocumentPicker.isCancel(err)) {
            // console.warn('cancelled');
            showWarnToast(t('promptTitle.info'), t('applyJobScreen.prompts.cancelPicker'));
        } else if (isInProgress(err)) {
            // console.warn('multiple pickers were opened, only the last will be considered');
            showWarnToast(t('promptTitle.info'), t('applyJobScreen.prompts.multiplePickerOpened'));
        } else {
            // throw err;
            showErrorToast(t('promptTitle.error'), err.message);
        }
    }

    const documentPickerHandler = async () => {
        setIsUploading(true);
        
        try {
            const pickerResult = await DocumentPicker.pickSingle({
                type: types.pdf,
                mode: 'import',
            });

            if (!pickerResult) {
                return;
            }

            const path = pickerResult.uri;

            if (!path) {
                return;
            }

            const convertedFile = await convertFileToBase64(path);

            if (!convertFileToBase64) {
                return;
            }

            let fileName = '';

            if (pickerResult.name) {
                fileName = pickerResult?.name.split('.pdf')[0]
            }

            const payload: UploadCvProps = {
                token: token,
                params: {
                    fileData: convertedFile || '',
                    fileName: fileName,
                }

            }
            const uploadResult = await addCv(payload);

            if (!uploadResult) {
                setIsUploading(false);
                return;
            }
            
            setIsUploading(false);
            showSuccessToast(t('promptTitle.success'), t('applyJobScreen.fileUploadSuccess'));
        } catch (error: unknown) {
            setIsUploading(false);
            // handleError(error);
            handleError(new Error('Ensure filename have no spaces and try again'));
        }
    }

    return (
        <>
            <View className='flex-row justify-between items-center'>
                <Text className='text-base font-semibold dark:text-white'>{title}</Text>
                <TouchableOpacity
                    onPress={() => debounce(documentPickerHandler)}
                    disabled={isUploading}
                >
                    {
                        isUploading 
                            ? <ActivityIndicator size={14} color={colors.gray[300]} /> 
                            : <IconFileUpload size={24} color={`${colorScheme === 'dark' && colors.white}`} />
                    }
                </TouchableOpacity>
            </View>
            <View className='my-4' />
            {/* this is a pre-caution just in case there is a vertical scrollview */}
            <ScrollView 
                horizontal={true}
                contentContainerStyle={{
                    flex: 1
                }}
                scrollEnabled={false}
                showsHorizontalScrollIndicator={false}
            >
                {children}
            </ScrollView>
        </>
    )
}