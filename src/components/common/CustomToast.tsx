import { View, Text } from 'react-native';
import React from 'react';
import { ToastProps } from 'react-native-toast-message';
import colors from 'tailwindcss/colors';

export interface CustomToastProps {
    type: string
    text1: string
    text2: string
    props: ToastProps
}

const CustomToast = ({type, text1, text2, props} : CustomToastProps) => {
  return (
      <View 
        className='flex-row mx-2 bg-white border border-gray-600 rounded-md' 
        {...props} 
        style={{ 
            shadowColor: colors.gray[200],
            shadowOffset: { width: 0, height: 5, },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5
        }}
    >
          {/* <View className={`w-[10] ${type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-yellow-300' }`} /> */}
          <View className='p-4 flex-1'>
              <Text className='text-lg font-bold'>{text1}</Text>
              <Text className='leading-4'>{text2}</Text>
          </View>
      </View>
  );
}

export default CustomToast;