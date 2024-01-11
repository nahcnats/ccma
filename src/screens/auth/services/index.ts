import server from '../../../API';
import { httpHeaders } from '../../../constants/httpHeaders';
import { apiErrorHandler } from '../../../utils';

export const validateUsername = async (username: string) => {
    try {
        const response = await server.post('/user/username/validate', {
            username: username
        }, {
            headers: httpHeaders
        });

        return response.data.isUsernameValid;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export const forgotPaswordRequestToken = async (email: string) => {
    try {
        const response = await server.post('/user-auth/password/forget/generate/token', {
            email: email
        }, {
            headers: httpHeaders
        });

        return response.data.isUsernameValid;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}