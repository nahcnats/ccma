import { 
    SafeAreaView,
    KeyboardAvoidingView, 
    View, 
    Text, 
    FlatList, 
    TouchableOpacity, 
    StyleSheet, 
    useColorScheme 
} from 'react-native';
import React, { useState, useEffect, useCallback } from 'react';
import * as Contacts from 'expo-contacts';
import { useTranslation } from 'react-i18next';
import Share from 'react-native-share';
import colors from 'tailwindcss/colors';

import { RootState } from '../../store/store';
import { useAppSelector } from '../../hooks';
import Screen from '../../components/common/Screen';
import Loading from '../../components/common/Loading';
import Avatar from '../../components/common/Avatar';
import Search from '../../components/common/Search';
import { IconShare } from '../../assets/icons';
import { showErrorToast, showWarnToast, IS_ANDROID, dismissKeyboard } from '../../utils';
import themeColor from '../../constants/theme';

interface IShareOptions {
    message: string,
    recipient?: string,
    url?: string
}

const ImportContactsScreen = () => {
    const { t } = useTranslation();
    const colorScheme = useColorScheme();
    const { profileImageUrl, name, username } = useAppSelector((state: RootState) => state.auth)
    const [loading, setLoading] = useState(false);
    const [contacts, setContacts] = useState<any>([]);
    const [filteredContacts, setFilteredContacts] = useState<any[]>([]);
    const [query, setQuery] = useState('');

    const getContactPermissions = async () => {
        try {
            setLoading(true);

            const permission = await Contacts.requestPermissionsAsync();

            if (permission.status === 'granted') {
                getContacts();
            } else {
                showWarnToast(t('promptTitle.error'), 'Permission to access your contacts required');    
            }

            setLoading(false);
        } catch (error: any) {
            setLoading(false);
            showErrorToast(t('promptTitle.info'), error.message);    
        }
    }

    useEffect(() => {
        getContactPermissions();
    }, []);

    const getContacts = async () => {
        try {
            const { data } = await Contacts.getContactsAsync({
                fields: [
                    Contacts.Fields.ID,
                    Contacts.Fields.Name,
                    Contacts.Fields.PhoneNumbers,
                    Contacts.Fields.ImageAvailable,
                    Contacts.Fields.Image,
                ]
            });

            if (data.length > 0) {
                setContacts(data);
                setFilteredContacts(data);

            }
        } catch (error: any) {
            throw error;
        }
    }

    const openShare = async () => {
        try {
            const shareOptions: IShareOptions = {
                message: "Hey! I think you’ll love Cult Creative — sign up as a creative (free!) to expand your network and get cool jobs 😎",
                url: "https://cultcreative.page.link/CCinvite"
            }

            await Share.open(shareOptions);
        } catch (error: any) {
            // showWarnToast(t('promptTitle.info'), error.message);
            console.info(error.message);
        }
    }

    const singleShare = async (name: string, phoneNumber: string) => {
        try {
            const shareOptions: IShareOptions = {
                message: `Hey, ${name}! I think you’ll love Cult Creative — sign up as a creative (free!) to expand your network and get cool jobs 😎`,
                url: "https://cultcreative.page.link/CCinvite",
                recipient: phoneNumber,
            }

            await Share.open(shareOptions);
        } catch (error: any) {
            // showWarnToast(t('promptTitle.info'), error.message);
            console.info(error.message);
        }
    }

    const searchFilter = (text: string) => {
        if (text) {
            const newData = contacts.filter((item: any) => {
                const itemData = item.name ? item.name.toUpperCase() : "".toUpperCase();
                const textData = text.toUpperCase();
                return itemData.indexOf(textData) > -1;
            });

            setFilteredContacts(newData);
            setQuery(text);
        } else {
            setFilteredContacts(contacts);
            setQuery(text);
        }
    }

    const clearQuery = () => {
        dismissKeyboard();
        setFilteredContacts(contacts);
        setQuery('');
    }

    const ContactItem = ({data}: {data: any}) => {
        const shadow = IS_ANDROID ? styles.elevation : styles.shadowProp;

        let primaryPhoneNumber = data.phoneNumbers[0].number;

        if (data.phoneNumbers.length > 1) {
            let filtered = data.phoneNumbers.filter((item: any) => item.isPrimary === true);
            if (filtered.length > 0) {
                primaryPhoneNumber = filtered[0].number;
            }
        }

        return (
            <View className='bg-colors-new_4 dark:bg-colors-new_2' style={[styles.card, shadow]}>
                <View className='flex-row flex-1 items-start space-x-3'>
                    <Avatar size={42} image={data.imageAvailable ? data.image.uri : null} />
                    <View className='flex-1'>
                        <Text className='dark:text-white' ellipsizeMode='tail' numberOfLines={1}>{data.name}</Text>
                        <Text className='dark:text-white'>{primaryPhoneNumber}</Text>
                    </View>
                </View>
                <TouchableOpacity
                    className='rounded-lg px-3 py-2'
                    onPress={() => singleShare(data.name, primaryPhoneNumber)}
                    style={{
                        backgroundColor: themeColor.primary
                    }}
                >
                    <Text className='self-center text-white font-semibold'>INVITE</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (loading) {
        return (
            <Loading />
        );
    }

    return (
        <SafeAreaView className='flex-1'>
            <KeyboardAvoidingView behavior={IS_ANDROID ? 'height' : 'padding'} className="flex-1">
                <Screen>
                    <View onStartShouldSetResponder={dismissKeyboard} >
                        <Search 
                            query={query} 
                            onQuery={(e: string) =>searchFilter(e)} 
                            onSearch={() => null}
                            onClear={clearQuery} 
                        />
                        <View className='my-3' />
                        <TouchableOpacity
                            className='flex-row bg-amber-500 rounded-lg py-2 px-4 space-x-3 items-center'
                            onPress={openShare}
                        >
                            <Avatar size={45} image={profileImageUrl} />
                            <View className='flex-row flex-1 justify-between items-center'>
                                <View>
                                    <Text className='text-base'>{name}</Text>
                                    <Text className='font-semibold'>@{username}</Text>
                                </View>
                                <IconShare size={26} color={colors.black} />
                            </View>
                        </TouchableOpacity>
                        <View className='my-4' />
                        <FlatList
                            data={filteredContacts}
                            keyExtractor={(item, index) => `${item.id}`}
                            renderItem={({ item }) => <ContactItem key={item.id} data={item} />}
                            showsVerticalScrollIndicator={false}
                            ItemSeparatorComponent={() => <View className='my-2' />}
                            contentContainerStyle={{ flexGrow: 1 }}
                        />
                    </View>
                </Screen>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    card: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginVertical: 10,
    },
    shadowProp: {
        shadowColor: '#c7c7c7',
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    elevation: {
        elevation: 8,
        shadowColor: '#c7c7c7'
    },
})

export default ImportContactsScreen;