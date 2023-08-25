import { apiErrorHandler } from "../../../utils";
import { GenericProps } from "../../../types/common";
import server from "../../../API";
import { CreativeProfileType, EmployerProfileType, CreativePortfolioByIdType } from "../../../types/profile";

interface EditCreativeProps {
    token: GenericProps,
    params: {
        email: string,
        // username: string,
        name: string,
        phoneNumber: string,
        phoneNumberDataId: number
    }
}

interface UpdateCreativePreferencesProps {
    token: GenericProps,
    params: {
        creativePreferences: any[]
    }
}

interface EditEmployerProps {
    token: GenericProps,
    params: {
        companyName: string
        businessAddress: string
        industryId: number
        companySizeId: number
        companyOverview: string
        websiteUrl: string
        phoneNumber: string
        phoneNumberDataId: number
    }
}

export interface AddProjectProps {
    token: GenericProps
    params: {
        title: string
        description: string
        fileData: string
        fileName: string
        contents: any[]
    }
}

export interface UpdateProjectProps {
    token: GenericProps
    params: {
        id: number
        title: string
        description: string
        fileData: string
        fileName: string
        contents: any[]
    }
}

export interface PortfolioByIdProps {
    token: GenericProps,
    params: {
        id: number,
    }
}

export interface UpdateAdditionalLinksProps {
    token: GenericProps
    params: {
        additionalLinks: string[]
    }
}

interface GalleryProps {
    fileData: string
    fileName: string
}

export interface UploadEmployerGalleryProps {
    token: GenericProps
    params: GalleryProps[]
}

export async function loggedInCreativeProfile(payload: GenericProps): Promise<CreativeProfileType> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get('/creatives/details/logged-in', {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.creativeProfile;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error.message)}`);
    }
}

export async function loggedInEmployerProfile(payload: GenericProps): Promise<EmployerProfileType> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get('/cced/user/details/logged-in', {
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

export async function removeUser(payload: GenericProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/user/account/delete', null, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function editCreative(payload: EditCreativeProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/user/details/edit', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function updateCreativePreferences(payload: UpdateCreativePreferencesProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/creatives/creative/preferences', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function editEmployer(payload: EditEmployerProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/cced/user/details/edit', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function addProjects(payload: AddProjectProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/creatives/portfolio/add', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function portfolioById(payload: PortfolioByIdProps): Promise<CreativePortfolioByIdType> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.get(`/creatives/portfolio/${payload.params.id}`, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data.creativesPortfolio;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function updateAdditionalLinks(payload: UpdateAdditionalLinksProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/cced/user/details/edit', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function addProject(payload: AddProjectProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/creatives/portfolio/add', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function updateProject(payload: UpdateProjectProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/creatives/portfolio/edit', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function deletePortfolioById(payload: PortfolioByIdProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post(`/creatives/portfolio/delete`, payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}

export async function uploadEmployerGallery(payload: UploadEmployerGalleryProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post('/uploads/upload/image/gallery', payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result;
    } catch (error: any) {
        throw new Error(`${apiErrorHandler(error)}`);
    }
}