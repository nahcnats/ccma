import server from "../../../API";
import { httpHeaders } from "../../../constants/httpHeaders";
import { GenericProps } from "../../../types/common";
import { apiErrorHandler } from "../../../utils";
import { 
    CreativeConnectionType,
    CreativeExploreType
} from "../../../types/network";
import { CreativeProfileType, EmployerProfileType } from "../../../types/profile";

export interface CreativeExploreProps {
    token: GenericProps,
    params: {
        pageIndex: number
        pageSize: number
        keyword?: string
    }
}

export interface CreativeEmployerByIdProps {
    token: GenericProps,
    params: {
        userId: number
    }
}

export async function getCreativeConnections(payload: GenericProps): Promise<CreativeConnectionType> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get('/creatives/connections', {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.response;
        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function getCreativeExplore(payload: CreativeExploreProps): Promise<CreativeExploreType[]> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/creatives/explore', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.creatives;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function getAcceptConnection(payload: CreativeEmployerByIdProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/creatives/connection/request/accept/${payload.params.userId}`,{
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.creatives;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function getDeclineConnection(payload: CreativeEmployerByIdProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/creatives/connection/request/decline/${payload.params.userId}`,{
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.creatives;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function getRequestConnection(payload: CreativeEmployerByIdProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/creatives/connection/request/send/${payload.params.userId}`,{
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.creatives;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function getRequestCancel(payload: CreativeEmployerByIdProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/creatives/connection/request/cancel/${payload.params.userId}`,{
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.creatives;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function creativeProfileById(payload: CreativeEmployerByIdProps): Promise<CreativeProfileType> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`creatives/details/${payload.params.userId}`,{
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.creativeProfile;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 

export async function employerProfileById(payload: CreativeEmployerByIdProps): Promise<EmployerProfileType> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/cced/user/details/${payload.params.userId}`,{
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.employerProfile;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 