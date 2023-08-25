import { SafeAreaView, ScrollView, View, Text, Image, Linking } from 'react-native';
import React from 'react';

import Screen from '../../components/common/Screen';
import SubmitButton from '../../components/common/SubmitButton';

const creativeUrl = 'https://web.cultcreative.asia';
const employerUrl = 'https://cultcreative.asia/employers';

const MaintenanceScreen = () => {
    return (
        <SafeAreaView className='flex-1 bg-white'>
            <ScrollView className='flex-1' showsVerticalScrollIndicator={false}>
                <Screen>
                    <View className="flex-1 justify-between item-center">
                        <View className='mt-12'>
                            <View className=' justify-center items-center'>
                                <Image
                                    source={require('../../assets/images/maintenance.png')}
                                    style={{
                                        height: 255,
                                        width: 250,
                                        alignContent: 'center',
                                        alignItems: 'center'
                                    }}
                                    resizeMode='contain'
                                />
                            </View>
                            <View className='my-4' />
                            <Text className='text-xl font-bold self-center'>We’re Under Construction!</Text>
                            <View className='my-4' />
                            <Text>
                                Our app is under maintenance as we are building a new version of Cult Creative that’ll take us to the next frontier. We appreciate you being here and thank you for your patience!
                            </Text>
                            <View className='my-2' />
                            <Text>
                                If you’re here to apply to amazing creative jobs (and build your profile), or if you’re an employer looking for creatives, you can use our web platforms.
                            </Text>
                            <View className='my-2' />
                            <Text>
                                Click the buttons below or use these addresses on your browser!
                            </Text>
                            <View className='my-2' />
                            <Text>For Creatives: <Text onPress={() => Linking.openURL(creativeUrl)} className='font-bold'>{creativeUrl}</Text></Text>
                            <View className='my-[0.5]' />
                            <Text>For Employers: <Text onPress={() => Linking.openURL(employerUrl)} className='font-bold'>{employerUrl}</Text></Text>
                        </View>
                        <View className='flex-row space-x-3 mt-6'>
                            <View className='flex-1'>
                                <SubmitButton label="I'm A Creative" onPress={() => Linking.openURL(creativeUrl)} />
                            </View>
                            <View className='flex-1'>
                                <SubmitButton label="I'm An Employer" onPress={() => Linking.openURL(employerUrl)} />
                            </View>
                        </View>
                    </View>
                </Screen>
            </ScrollView>
        </SafeAreaView>
    );
}

export default MaintenanceScreen;