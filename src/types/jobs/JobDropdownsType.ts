export type GenericDropDownsType = {
    id: number,
    value: string
}

export type JobDropdownsType = {
    experienceLevels: GenericDropDownsType[]
    workingDays: GenericDropDownsType[]
    educationLevels: GenericDropDownsType[]
    employmentTypes: {
        isPaidJob?: boolean
        id: number
        value: string
    }[]
    salaryRanges: GenericDropDownsType[]
    workModes: GenericDropDownsType[]
}