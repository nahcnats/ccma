import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

import { AppDispatch } from "../store";
import server from "../../API";
import { httpHeaders } from "../../constants/httpHeaders";
import { apiErrorHandler } from "../../utils";
import { checkToken } from "../../utils/pushnotification_helper";
import { Platform } from "react-native";

export const USERINFO = 'USERINFO';
export const LOGOUT = 'LOGOUT';

export interface LoginProps {
    email: string
    password: string
}

export interface LoginWithProviderProps {
    provider: string
    email: string
    token: string
}

export const login = ({email, password}: LoginProps) => {
    return async (dispatch: AppDispatch) => {
        try {
            const tokenResponse = await server.post('/user-auth/authenticate', 
            {
                email: email,
                password: password,
            }, { headers: httpHeaders });

            if (tokenResponse.data.status === 'error') {
                throw new Error(tokenResponse.data.errorMessage);
            }

            const data = {
                email: email,
                password: password,
            }
            saveToStorage(data);
            registerDevice(tokenResponse.data.token);

            dispatch(getLoggedInUser(tokenResponse.data.token));
        } catch (error: any) {
            throw new Error(`${apiErrorHandler(error)}`);
        }
    }
}

export const loginWithProvider = (userInfo: LoginWithProviderProps) => {
    return async (dispatch: AppDispatch) => {
        try {
            let service = '';
            const provider = userInfo.provider || 'none';

            switch (provider) {
                case 'GOOGLE': {
                    service = '/user-auth/authenticate/google';
                    break;    
                }

                case 'FACEBOOK': {
                    service = '/user-auth/authenticate/facebook';
                    break;
                }

                case 'APPLE': {
                    service = '/user-auth/authenticate/apple';
                    break;
                }

                default: 
                    return;
            }

            const payload = {
                token: userInfo.token,
                email: userInfo.email,
                providerId: userInfo.provider.toLowerCase()
            }

            const tokenResponse = await server.post(service, payload, {
                headers: httpHeaders
            });


            if (tokenResponse.data.status === 'error') {
                throw new Error(tokenResponse.data.errorMessage);
            }

            const data = {
                token: userInfo.token,
                email: userInfo.email,
                provider: userInfo.provider
            }

            saveToStorage(data);
            registerDevice(tokenResponse.data.token);

            dispatch(getLoggedInUser(tokenResponse.data.token));
        } catch (error: any) {
            throw new Error(`${apiErrorHandler(error)}`);
        }
    }
}

export const getLoggedInUser = (token: string) => {
    return async (dispatch: AppDispatch) => {
        try {
            const userResponse = await server.post('/user/details/logged-in',
                null,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'content-type': httpHeaders["content-type"]
                    }
                });

            const userData = await userResponse.data;


            if (userData.status === 'error') {
                throw userData.errorMessage;
            }

            dispatch({
                type: USERINFO,
                id: userData.id,
                employerTokensCount: userData.user.employerTokensCount,
                name: userData.user.name,
                email: userData.user.email,
                username: userData.user.username,
                role: userData.user.role,
                profileImageUrl: userData.user.profileImageUrl,
                bio: userData.user.bio,
                joinedDate: userData.user.joinedDate,
                status: userData.user.status,
                token: token,
                completedProfileOnDate: userData.completedProfileOnDate
            });
        } catch (error: any) {
            throw new Error(`${apiErrorHandler(error)}`);
        }
    }
}

export const saveToStorage = (data: any) => {
    data.lastLoginDT = moment(new Date());
    AsyncStorage.setItem('USER', JSON.stringify(data));
}

export const logout = () => {
    AsyncStorage.removeItem('USER');
    return { type: LOGOUT };
}

const registerDevice = async (token: string) => {
    try {
        const fcmToken = await checkToken();

        if (!fcmToken) return;

        const payload = {
            deviceToken: fcmToken,
            deviceOsName: Platform.OS,
            deviceOsVersion: Platform.Version
        }

        await server.post('/utility/update/device/details',
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'content-type': httpHeaders["content-type"]
                }
            });
    } catch (error: any) {
        throw new Error('Error register device');
    }
}