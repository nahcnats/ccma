import server from "../../../API";
import { httpHeaders } from "../../../constants/httpHeaders";
import { apiErrorHandler } from "../../../utils";
import { GenericProps } from "../../../types/common";

export interface OrangeTickProps {
    token: GenericProps,
    params: {
        dateOfBirth?: string,
        educationLevelId?: number,
        nationalityId?: number,
        bio?: string,
        countryId?: number,
        stateId?: number,
        creativesEmploymentPosition?: {
            employmentTypeId?: number,
            positionTitle?: string,
            positionCompany?: string,
            details?: string,
        },
        creativesEmploymentTypes?: any[],
        creativesSalaryRanges?: any[]
        userLinks?: object[]
        websiteLinks?: object[]
    }
}

export async function postOrangeTick(payload: OrangeTickProps): Promise<string> {
    try {
        const headerOptions = {
            'Authorization': `Bearer ${payload.token}`,
            'Accept': 'application/json'
        }

        const res = await server.post(`/user/orange-tick`, payload.params, {
            headers: headerOptions
        });

        if (res.data.errorMessage) {
            throw new Error(res.data.errorMessage)
        }

        const result = await res.data;

        return result;
    } catch (error: any) {
        console.log('orangeTick', error)
        throw new Error(`${apiErrorHandler(error)}`);
    }
} 