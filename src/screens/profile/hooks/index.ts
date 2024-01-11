import { useQuery, useMutation } from "react-query";

import { CreativeProfileType, EmployerProfileType, CreativePortfolioByIdType } from "../../../types/profile";
import { GenericProps } from "../../../types/common";
import { 
    addProject,
    AddProjectProps,
    deletePortfolioById,
    loggedInCreativeProfile, 
    loggedInEmployerProfile,
    portfolioById,
    PortfolioByIdProps,
    updateAdditionalLinks,
    UpdateAdditionalLinksProps,
    updateProject,
    UpdateProjectProps,
    uploadEmployerGallery,
    UploadEmployerGalleryProps,
} from "../services";
import { postOrangeTick, OrangeTickProps } from "../../orangetick/services";
import { queryClient } from "../../../App";

/** Queries */

export const useCreativeProfile = (payload: GenericProps) => {
    return useQuery<CreativeProfileType, Error>('creativeProfile', () => loggedInCreativeProfile(payload));
}

export const useEmployerProfile = (payload: GenericProps) => {
    return useQuery<EmployerProfileType, Error>('employerProfile', () => loggedInEmployerProfile(payload));
}

export const useCreativePortfolioById = (payload: PortfolioByIdProps) => {
    return useQuery<CreativePortfolioByIdType, Error>('creativePortfolioById', () => portfolioById(payload));
}

/** End queries */

/** Mutations */ 

export const useUpdateLinks = () => {
    return useMutation((payload: OrangeTickProps): Promise<string> => postOrangeTick(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries('creativeProfile');
        },
        onError: (error) => {
            throw error;
        }
    })
}

export const useUpdateAdditionalLinks = () => {
    return useMutation((payload: UpdateAdditionalLinksProps): Promise<string> => updateAdditionalLinks(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries('employerProfile');
        },
        onError: (error) => {
            throw error;
        }
    })
}

export const useAddProject = () => {
    return useMutation((payload: AddProjectProps): Promise<string> => addProject(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries('creativeProfile');
        },
        onError: (error) => {
            throw error;
        }
    })
}

export const useUpdateProject = () => {
    return useMutation((payload: UpdateProjectProps): Promise<string> => updateProject(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries('creativeProfile');
        },
        onError: (error) => {
            throw error;
        }
    })
}

export const useDeleteProject = () => {
    return useMutation((payload: PortfolioByIdProps): Promise<string> => deletePortfolioById(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries('creativeProfile');
        },
        onError: (error) => {
            throw error;
        }
    })
}

export const useUploadEmployerGallery = () => {
    return useMutation((payload: UploadEmployerGalleryProps): Promise<string> => uploadEmployerGallery(payload), {
        onSuccess: () => {
            queryClient.invalidateQueries('employerProfile');
        },
        onError: (error) => {
            throw error;
        }
    })
}

/** End Mutations */ 