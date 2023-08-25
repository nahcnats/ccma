import { View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import colors from 'tailwindcss/colors';

import { IconEdit, IconReport } from '../../../../assets/icons';

const BottomSheetContent = () => {
    const { t } = useTranslation();
    
    return (
        <View className="flex-1 p-4 space-y-5" >
            <TouchableOpacity className="flex-row space-x-5 items-center" onPress={() => null}>
                <View className="w-[35] items-center">
                    <IconEdit size={24} color={colors.gray[500]} />
                </View>
                <View>
                    <Text className="text-base font-semibold mb-1">{t('commonActions.edit')}</Text>
                    <Text>{t('commonActions.editDescription')}</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row space-x-5 items-center" onPress={() => null}>
                <View className="w-[35] items-center">
                    <IconReport size={24} color={colors.gray[500]} />
                </View>
                <View>
                    <Text className="text-base font-semibold mb-1">{t('feedScreen.report')}</Text>
                    <Text>{t('feedScreen.reportDescription')}</Text>
                </View>
            </TouchableOpacity>
        </View>
    );
}

export default BottomSheetContent;