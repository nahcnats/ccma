export type CreativeUserLinkType = {
    createdDate: string
    userLinkType: string
    id: number
    value: string
    userId: number
    status: string
}

export type CreativePortfoliosType = {
    createdDate: string
    imageUrl: string
    publishingStatus: string
    description: string
    id: number
    title: string
    userId: number
    status: string
}

export type CreativeProfileType = {
    currentPositionEmploymentType: string
    preferredWorkModeIds: number[]
    preferredGoalIds: number[]
    genderPreference: string,
    genderPreferenceId: number,
    bio: string
    preferredExperienceLevelIds: number[]
    preferredSalaryRangeIds: number[]
    preferredEmploymentTypeIds: number[]
    preferredWorkingDayIds: number[]
    joinedOnDate: string
    preferredEmployerCompanySizeIds: number[]
    educationLevel: string
    phoneNumberDataId: number
    currentPositionTitle: string
    id: number
    profileImageUrl: string
    completedProfileOnDate: string
    email: string
    educationLevelId: number
    preferredWorkLocationIds: number[]
    nationalityId: number
    dateOfBirth: string
    profileBannerUrl: string
    preferredEducationLevelIds: number[],
    preferredTopicIds: number[]
    phoneNumber: string
    phoneNumberCountry: string
    nationality: string
    preferredEmployerIndustryIds: number[]
    currentPositionEmploymentTypeId: number
    name: string
    currentPositionCompanyName: string
    countryId: number
    cityId: number
    status: string
    username: string
    userLinks: CreativeUserLinkType[]
    websiteLinks: CreativeUserLinkType[]
    creativesPortfolios: CreativePortfoliosType[]
    profileStatus: string
}