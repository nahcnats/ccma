import AsyncStorage from "@react-native-async-storage/async-storage";
import server from "../../API";

export const getStorageUser = async () => {
    try {
        const user = await AsyncStorage.getItem('USER');

        if (!user) {
            return;
        }

        const transformedData = JSON.parse(user);

        return transformedData;
    } catch (error) {
        throw error
    }
}

export const getVersionData = async () => {
    try {
        const { data } = await server.get('utility/check/app-version');

        return data;
    } catch (error) {
        throw error;
    }
}