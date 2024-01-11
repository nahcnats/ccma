import { AppDispatch } from "../store";
import server from "../../API";
import { httpHeaders } from "../../constants/httpHeaders";
import { apiErrorHandler } from "../../utils";
import * as authActions from '../actions/auth';

export const ONBOARDING = 'ONBOARDING';
export const PROVIDER = 'PROVIDER';
export const USERNAME = 'USERINFO';
export const ROLE = 'ROLE';


interface UserInfoProps {
    role: string,
    username: string,
    email: string
    password: string
    name: string
    phoneNumber: string
    phoneNumberDataId: number
    genderPreferenceId?: number
    provider: string
    token: string
}

interface ProviderUserInfoProps {
    email: string
    name: string
    provider: string
    token: string
}

export const providerUserInfo = (userInfo: ProviderUserInfoProps) => {
    return async (dispatch: AppDispatch) => {
        dispatch({
            type: PROVIDER, 
            email: userInfo.email,
            name: userInfo.name,
            provider: userInfo.provider,
            token: userInfo.token
        });
    }
}

export const userRole = (role: string) => {
    return async (dispatch: AppDispatch) => {
        dispatch({
            type: ROLE,
            role: role
        });
    }
}

export const validUsername = (username: string) => {
    return async (dispatch: AppDispatch) => {
        dispatch({
            type: USERNAME,
            username: username
        });
    } 
}

export const registerCreative = (userInfo: UserInfoProps) => {
    return async (dispatch: AppDispatch) => {
        try {
            const tokenResponse = await server.post('/user/signup', {
                email: userInfo.email,
                password: userInfo.password,
                name: userInfo.name,
                username: userInfo.username,
                phoneNumber: userInfo.phoneNumber,
                phoneNumberDataId: userInfo.phoneNumberDataId,
                genderPreferenceId: userInfo.genderPreferenceId,
                role: userInfo.role,
            }, { headers: httpHeaders});

            if (tokenResponse.data.status === 'error') {
                throw new Error(tokenResponse.data.errorMessage);
            }

            const providerPayload = {
                provider: userInfo.provider,
                email: userInfo.email,
                token: userInfo.token
            }

            switch (userInfo.provider) {
                case 'GOOGLE': {
                    const action = authActions.loginWithProvider(providerPayload);

                    await dispatch(action);
                    break;    
                }
                case 'FACEBOOK': {
                    const action = authActions.loginWithProvider(providerPayload);

                    await dispatch(action);
                    break;    
                }
                case 'APPLE': {
                    const action = authActions.loginWithProvider(providerPayload);

                    await dispatch(action);
                    break;    
                }
                default: {
                    const action = authActions.login({
                        email: userInfo.email,
                        password: userInfo.password
                    });

                    await dispatch(action);
                    break;
                }
            }

            dispatch({
                type: ONBOARDING,
                email: userInfo.email,
                name: userInfo.name,
                phoneNumber: userInfo.phoneNumber,
                phoneNumberDataId: userInfo.phoneNumberDataId,
                genderPreferenceId: userInfo.genderPreferenceId,
            });
        } catch (error: any) {
            throw new Error(`${apiErrorHandler(error)}`);   
        }
    }
}

export const registerEmployer = (userInfo: UserInfoProps) => {
    return async (dispatch: AppDispatch) => {
        try {
            const tokenResponse = await server.post('/user/signup', {
                email: userInfo.email,
                password: userInfo.password,
                name: userInfo.name,
                username: userInfo.username,
                phoneNumber: userInfo.phoneNumber,
                phoneNumberDataId: userInfo.phoneNumberDataId,
                role: userInfo.role,
            }, { headers: httpHeaders });

            if (tokenResponse.data.status === 'error') {
                throw new Error(tokenResponse.data.errorMessage);
            }

            const providerPayload = {
                provider: userInfo.provider,
                email: userInfo.email,
                token: userInfo.token
            }

            switch (userInfo.provider) {
                case 'GOOGLE': {
                    const action = authActions.loginWithProvider(providerPayload);

                    await dispatch(action);
                    break;
                }
                case 'FACEBOOK': {
                    const action = authActions.loginWithProvider(providerPayload);

                    await dispatch(action);
                    break;
                }
                case 'APPLE': {
                    const action = authActions.loginWithProvider(providerPayload);

                    await dispatch(action);
                    break;
                }
                default: {
                    const action = authActions.login({
                        email: userInfo.email,
                        password: userInfo.password
                    });

                    await dispatch(action);
                    break;
                }
            }

            dispatch({
                type: ONBOARDING,
                email: userInfo.email,
                password: userInfo.password,
                name: userInfo.name,
                phoneNumber: userInfo.phoneNumber,
                phoneNumberDataId: userInfo.phoneNumberDataId,
            });
        } catch (error: any) {
            throw new Error(`${apiErrorHandler(error)}`);
        }
    }
}