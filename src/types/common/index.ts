export type FeedMediaType = {
    type: "url" | "base64" | "Youtube"
    url: string | null
    fullUrl: string | null
    thumbnail?: string | null
    fileData?: string | null
    fileName?: string | null
    mimeType?: string | null
}

export interface GenericProps {
    token: string
}

export type LocationDataType = {
    createdDate: string
    id: number
    type: string
    value: string
    status: string
}

export type WorkingDaysType = {
    code: string
    createdDate: string
    id: number,
    updatedDate: string
    value: string
    status: string
}

export type GenericSettingsType = {
    code: string
    createdDate: string
    settingsGroupingType: string
    id: number
    updatedDate: string
    value: string
    status: string
}

export type JobApplicationStatusesType = {
    code: string
    createdDate:string
    id: number
    updatedDate: string
    value: string
    status: string
}

export type PhoneNumbersDataType = {
    callingCode: string
    createdDate: string
    countryCode: string
    id: number
    updatedDate: string
    countryName: string
    status: string
}

export type ReactionTypesType = {
    code: string
    createdDate: string
    id: number
    updatedDate: string
    value: string
    status: string
}

export type SalaryRangesType = {
    code: string
    createdDate: string
    rangeEndValue: number
    rangeStartValue: number
    id: number,
    updatedDate: string
    status: string
}

export type SkillsType = {
    code: string
    createdDate: string
    skillType: string
    id: number
    updatedDate: string
    value: string
    status: string
}

export type EmployerIndustriesType = {
    code: string
    createdDate: string
    id: number
    updatedDate: string
    value: string
    status: string
}

export type JobPostingStatusesType = {
    code: string
    createdDate: string
    id: number
    updatedDate: string
    value: string
    status: string
}

export type CreativesGoalsType = {
    code: string
    createdDate: string
    id: number
    updatedDate: string
    value: string
    status: string
}

export type ExperienceLevelsType = {
    code: string
    createdDate: string
    yearsEndValue: number
    id: number,
    updatedDate: string
    yearsStartValue: number
    status: string
}

export type TokensTypesType = {
    code: string
    createdDate: string
    name: string
    id: number
    updatedDate: string
    status: string
}

export type GenderPreferencesType = {
    code: string
    createdDate: string
    id: number
    updatedDate: string
    value: string
    status: string
}

export type EducationLevelsType = {
    code: string
    createdDate: string
    id: number
    updatedDate: string
    value: string
    status: string
}

export type StatusesType = {
    createdDate: string
    id: number
    value: string
}

export type UploadTypesTypes = {
    code: string
    createdDate: string
    id: number
    updatedDate: number
    value: string
    status: string
}

export type EmployerCompanySizesType = {
    sizeEndValue: number,
    code: string,
    createdDate: string
    sizeStartValue: number
    id: number
    updatedDate: string
    status: string
}

export type EmploymentTypesTypes = {
    code: string
    createdDate: string
    id: number
    updatedDate: string
    value: string
    isPaidEmploymentType: boolean
    status: string
}

export type CreativesTopicsType = {
    code: string
    createdDate: string
    id: number
    updatedDate: string
    value: string
    status: string
}

export type WorkModesType = {
    code: string
    createdDate: string
    id: number
    updatedDate: string
    value: string
    status: string
}

export type UtilitiesType = {
    locationsData: LocationDataType[]
    workingDays: WorkingDaysType[]
    genericSettings: GenericSettingsType[]
    jobApplicationStatus: JobApplicationStatusesType[]
    phoneNumbersData: PhoneNumbersDataType[]
    reactionTypes: ReactionTypesType[]
    salaryRanges: SalaryRangesType[]
    skills: SkillsType[]
    employerIndustries: EmployerIndustriesType[]
    jobPostingStatuses: JobPostingStatusesType[]
    creativesGoals: CreativesGoalsType[]
    experienceLevels: ExperienceLevelsType[]
    tokensTypes: TokensTypesType[]
    genderPreferences: GenderPreferencesType[]
    educationLevels: EducationLevelsType[]
    statuses: StatusesType[]
    uploadTypes: UploadTypesTypes[]
    employerCompanySizes: EmployerCompanySizesType[]
    employmentTypes: EmploymentTypesTypes[]
    creativesTopics: CreativesTopicsType[]
    workModes: WorkModesType[]
}