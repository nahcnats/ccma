import React from "react";
import { createStackNavigator, StackView, TransitionPreset, } from '@react-navigation/stack';
import { useTranslation } from "react-i18next";
import { useColorScheme } from "react-native";
import colors from "tailwindcss/colors";

import { IS_ANDROID } from "../utils";
import DrawerNavigation from "./DrawerNavigation";
import { Header } from "../components/common/Header";
import { 
    FeedListingScreen,
    FeedDetailScreen, 
    CreateFeedScreen, 
    EditFeedScreen,
    CommentListScreen,
    ReportPostScreen,
} from "../screens/feeds";
import { PrimaryRight, PrimaryLeft ,SecondaryLeft } from "../components/common/headers";
import { 
    ConnectionsListingScreen,
    CreativeProfileViewScreen as ConnectionsProfileView,
    ImportContactsScreen
} from "../screens/connections";
import { 
    JobsListingScreen, 
    JobDetailScreen as ShowJob, 
    HireScreen, 
    TransactionHistoryScreen,
    AddVacancyScreen,
    TopUpTokenSelectionScreen,
    ApplyJobScreen,
    ApplicantsScreen,
    CloseJobScreen,
    PurchaseTokenScreen,
    VacancyFormScreen,
    EmployerProfileViewScreen as EmployerProfileView,
} from "../screens/jobs";
import { 
    ProfileScreen,
    CreateProjectsScreen,
    EditProjectsScreen,
    ProjectsDetailScreen,
    EditCreativeProfileScreen,
    EditEmployerProfileScreen,
    MyProfileForm,
    MyCareerDeetsForm,
    MyLocationForm,
    MyLinksForm,
    MyGoalsForm,
    MyTopicsForm,
    DeleteProfileScreen,
    MyCompanyForm,
    MyGalleryForm,
    AdditionalLinks,
} from "../screens/profile";
import {
    UploadYourselfScreen,
    MyProfileScreen,
    CareerDetailsScreen,
    LocationLinksScreen,
    CongratsScreen,
} from '../screens/orangetick';

export type MainNavigationParams = {
    Drawer: undefined | {screen?: string, params?: object}

    FeedListing: undefined,
    ShowFeed: {id: number, toComment?: boolean | false },
    CreateFeed: undefined,
    EditFeed: { postId: number },
    CommentListing: {postId: number},
    ReportPost: {postId: number},

    ConnectionsListing: undefined,
    ConnectionsProfile: {userId: number},
    ConnectionsProfileView: {userId: number},
    ImportContacts: undefined,

    JobsListing: undefined,
    ShowJob: {jobId: number},
    EmployerProfileView: { userId: number },
    Hire: undefined,
    TransactionHistory: undefined,
    AddVacancy: undefined,
    TopUpTokenSelection: undefined,
    ApplyJob: { jobId: number, title: string, companyName: string },
    Applicants: { jobId: number, title: string, companyName: string },
    CloseJob: { jobId: number },
    PurchaseToken: undefined,
    VacancyForm: { employmentTypeId: number, isPaidJob: boolean, tokenId: number, tokenName: string },

    Profile: undefined,
    CreateProjects: undefined,
    EditProjects: {id: number}
    ProjectsDetail: {id: number}
    EditCreativeProfile: undefined,
    EditEmployerProfile: undefined,
    MyProfileForm: undefined,
    MyCareerDeetsForm: undefined,
    MyLocationForm: undefined,
    MyLinksForm: undefined,
    MyGoalsForm: undefined,
    MyTopicsForm: undefined,
    DeleteProfile: undefined,
    MyCompanyForm: undefined,
    MyGalleryForm: undefined,
    AdditionalLinks: undefined,

    UploadYourself: undefined,
    MyProfile: undefined,
    CareerDetails: undefined,
    LocationLinks: undefined,
    Congrats: undefined
}

const Stack = createStackNavigator<MainNavigationParams>();

export default function () {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();

    const defaultNavOptions = {
        headerStyle: {
            backgroundColor: 'transparent'
        },
        headerShadowVisible: false,
        headerTintColor: colorScheme === 'dark' ? colors.gray[200] : colors.black
    }

    // const primaryNavOptions = (title?: string) => {
    //     return {
    //         headerTitle: title || '',
    //         headerLeft: () => (
    //             <PrimaryLeft />
    //         ),
    //         headerRight: () => (
    //             <PrimaryRight />
    //         ),
    //     }
    // }

    const secondaryNavOptions = (title?: string) => {
        return {
            headerTitle: title || '',
            headerLeft: () => <SecondaryLeft />
        }
    }

    return (
        <Stack.Navigator
            initialRouteName="Drawer"
            // screenOptions={{
            //     header: (props) => <Header stackHeaderProps={props} preset="secondary" />
            // }}
            screenOptions={defaultNavOptions}
        >
            <Stack.Screen 
                name="Drawer"
                component={DrawerNavigation}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Group
                key="FeedGroup"
            >
                <Stack.Screen 
                    name="FeedListing"
                    component={FeedListingScreen}
                    // options={() => primaryNavOptions()}
                />
                <Stack.Screen 
                    name="ShowFeed"
                    component={FeedDetailScreen} 
                    options={() => secondaryNavOptions()}   
                />
                <Stack.Screen 
                    name="CreateFeed"
                    component={CreateFeedScreen}  
                    options={{
                        headerShown: false,
                    }}  
                />
                <Stack.Screen 
                    name="EditFeed"
                    component={EditFeedScreen}    
                    options={{
                        headerShown: false,
                    }}  
                />
                <Stack.Screen 
                    name="CommentListing"
                    component={CommentListScreen}  
                    options={() => secondaryNavOptions(`${t('commentScreen.title')}`)}  
                />
                <Stack.Screen 
                    name="ReportPost"
                    component={ReportPostScreen}  
                    options={() => secondaryNavOptions()}  
                />
            </Stack.Group>
            <Stack.Group
                key="ConnectionGroup"
            >
                <Stack.Screen
                    name="ConnectionsListing"
                    component={ConnectionsListingScreen}
                />
                <Stack.Screen
                    name="ConnectionsProfile"
                    component={ConnectionsProfileView}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="ImportContacts"
                    component={ImportContactsScreen}
                    options={() => secondaryNavOptions()}
                />
            </Stack.Group>
            <Stack.Group
                key="JobsGroup"
            >
                <Stack.Screen
                    name="JobsListing"
                    component={JobsListingScreen}
                />
                <Stack.Screen
                    name="ShowJob"
                    component={ShowJob}
                    options={() => secondaryNavOptions()}
                />
                <Stack.Screen
                    name="EmployerProfileView"
                    component={EmployerProfileView}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Hire"
                    component={HireScreen}
                    options={() => secondaryNavOptions()}
                />
                <Stack.Screen
                    name="TransactionHistory"
                    component={TransactionHistoryScreen}
                    options={() => secondaryNavOptions()}
                />
                <Stack.Screen
                    name="AddVacancy"
                    component={AddVacancyScreen}
                    options={() => secondaryNavOptions()}
                />
                <Stack.Screen
                    name="VacancyForm"
                    component={VacancyFormScreen}
                    options={() => secondaryNavOptions()}
                />
                <Stack.Screen
                    name="TopUpTokenSelection"
                    component={TopUpTokenSelectionScreen}
                    options={() => secondaryNavOptions()}
                />
                <Stack.Screen
                    name="ApplyJob"
                    component={ApplyJobScreen}
                    options={() => secondaryNavOptions(`${t('applyJobScreen.title')}`)}
                />
                <Stack.Screen
                    name="Applicants"
                    component={ApplicantsScreen}
                    options={() => secondaryNavOptions()}
                />
                <Stack.Screen
                    name="CloseJob"
                    component={CloseJobScreen}
                    options={() => secondaryNavOptions()}
                />
                <Stack.Screen
                    name="PurchaseToken"
                    component={PurchaseTokenScreen}
                    options={() => secondaryNavOptions()}
                />
            </Stack.Group>
            <Stack.Group
                key="Profile"
            >
                <Stack.Screen 
                    name="Profile"
                    component={ProfileScreen}
                    options={() => secondaryNavOptions(`${t('editProfileScreen.myProfileForm.title')}`)}
                />
                <Stack.Screen
                    name="EditCreativeProfile"
                    component={EditCreativeProfileScreen}
                    options={() => secondaryNavOptions(`${t('editProfileScreen.myProfileForm.title')}`)}
                />
                <Stack.Screen
                    name="EditEmployerProfile"
                    component={EditEmployerProfileScreen}
                    options={() => secondaryNavOptions(`${t('editProfileScreen.myProfileForm.title')}`)}
                />
                <Stack.Screen
                    name="DeleteProfile"
                    component={DeleteProfileScreen}
                    options={() => secondaryNavOptions()}
                />
                <Stack.Screen 
                    name="CreateProjects"
                    component={CreateProjectsScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen 
                    name="EditProjects"
                    component={EditProjectsScreen}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen 
                    name="ProjectsDetail"
                    component={ProjectsDetailScreen}
                    options={() => secondaryNavOptions()}
                />
                <Stack.Screen 
                    name="MyProfileForm"
                    component={MyProfileForm}
                    options={() => secondaryNavOptions(`${t('editProfileScreen.myProfileForm.title')}`)}
                />
                <Stack.Screen 
                    name="MyCareerDeetsForm"
                    component={MyCareerDeetsForm}
                    options={() => secondaryNavOptions(`${t('editProfileScreen.myCareerDeetsForm.title')}`)}
                />
                <Stack.Screen 
                    name="MyLocationForm"
                    component={MyLocationForm}
                    options={() => secondaryNavOptions(`${t('editProfileScreen.myLocationForm.title')}`)}
                />
                <Stack.Screen 
                    name="MyLinksForm"
                    component={MyLinksForm}
                    options={() => secondaryNavOptions(`${t('editProfileScreen.myLinksForm.title')}`)}
                />
                <Stack.Screen 
                    name="MyGoalsForm"
                    component={MyGoalsForm}
                    options={() => secondaryNavOptions(`${t('editProfileScreen.myGoalsForm.title')}`)}
                />
                <Stack.Screen 
                    name="MyTopicsForm"
                    component={MyTopicsForm}
                    options={() => secondaryNavOptions(`${t('editProfileScreen.myTopicsForm.title')}`)}
                />
                <Stack.Screen 
                    name="MyCompanyForm"
                    component={MyCompanyForm}
                    options={() => secondaryNavOptions(`${t('editProfileScreen.options.companyInfo')}`)}
                />
                <Stack.Screen 
                    name="MyGalleryForm"
                    component={MyGalleryForm}
                    options={() => secondaryNavOptions(`${t('editProfileScreen.options.myGallery')}`)}
                />
                <Stack.Screen 
                    name="AdditionalLinks"
                    component={AdditionalLinks}
                    options={() => secondaryNavOptions(`${t('editProfileScreen.myLinksForm.title')}`)}
                />
            </Stack.Group>
            <Stack.Group
                key="OrangeTick"
            >
                <Stack.Screen 
                    name="UploadYourself"
                    component={UploadYourselfScreen}
                    options={() => secondaryNavOptions(`${t('editProfileScreen.options.uploadYourself')}`)}
                />
                <Stack.Screen 
                    name="MyProfile"
                    component={MyProfileScreen}
                    options={() => secondaryNavOptions(`${t('editProfileScreen.options.myProfile')}`)}
                />
                <Stack.Screen 
                    name="CareerDetails"
                    component={CareerDetailsScreen}
                    options={() => secondaryNavOptions(`${t('editProfileScreen.options.careerDetails')}`)}
                />
                <Stack.Screen 
                    name="LocationLinks"
                    component={LocationLinksScreen}
                    options={() => secondaryNavOptions(`${t('editProfileScreen.options.loclink')}`)}
                />
                <Stack.Screen 
                    name="Congrats"
                    component={CongratsScreen}
                    options={() => secondaryNavOptions()}
                />
            </Stack.Group>
        </Stack.Navigator>
    );
}