import { View, Text, TouchableOpacity, Linking, useColorScheme, Dimensions } from 'react-native';
import React from 'react';
import CheckBox, { CheckBoxProps} from '@react-native-community/checkbox';
import colors from 'tailwindcss/colors';
import Pdf from 'react-native-pdf';

import { IconDelete } from '../../assets/icons';
import { CVsType } from '../../types/jobs';
import { openPdf } from '../../utils';

interface ResumeItemProps extends CheckBoxProps {
    data: CVsType
    checked?: boolean
    showCheck?: boolean
    onItemChange: () => void
    onDelete: () => void
}

const width = Dimensions.get('window').width;

export default function ResumeItem({ data, checked, showCheck, onItemChange, onDelete, ...props }: ResumeItemProps) {
    const colorScheme = useColorScheme();
    const source = { uri: `${data.cvUrl}`, cache: true }

    const onViewPdf = () => {
        openPdf(data.cvUrl, data.fileName);
    }

    return (
        <View 
            className={`flex-row items-center space-x-2 rounded-lg border border-gray-300 p-4 mb-4`} {...props}
            style={{
                width: width - 35
            }}
        >
            {
                showCheck ? <View className='flex-row items-center'>
                    <CheckBox
                        tintColor={`${colors.gray[500]}`}
                        style={{ height: 20, width: 20 }}
                        value={checked}
                        onValueChange={onItemChange}
                        boxType='square'
                        {...props}
                    />
                </View> : null

            }
            <View className='flex-row justify-between items-center space-x-4'>
                <TouchableOpacity className='w-16 h-20' 
                    // onPress={() => Linking.openURL(data.cvUrl)}
                    onPress={onViewPdf}
                >
                    <Pdf
                        trustAllCerts={false}
                        source={source}
                        // onError={(error) => console.log(error)}
                        style={{
                            flex: 1
                        }}
                    />
                </TouchableOpacity>
                <View className={`${showCheck ? 'w-[180]' : 'w-[210]'}`}>
                    <Text className={`${colorScheme === 'dark' && 'text-white'} `}>{data.fileName}.{data.fileExtension}</Text>
                </View>
            </View>
            <TouchableOpacity
                onPress={onDelete}
            >
                <IconDelete size={34} color={colors.red[500]} />
            </TouchableOpacity>
        </View>      
    );
}