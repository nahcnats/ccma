export default {
    loading: 'Loading...',
    promptTitle: {
        success: 'Success',
        error: 'Error',
        info: 'Info',
        attention: 'Attention'
    },
    commonActions: {
        search: 'Search',
        edit: 'Edit',
        next: 'Next',
        previous: 'Previous',
    },
    formErrors: {
        email: 'Email is required!',
        invalidEmail: 'Invalid email',
        invalidUrl: 'Invalid URL',
        invalidDate: 'Invalid date',
        password: 'Password is required!',
        confirmPassword: 'Confirm Password is required!',
        username: 'Username is required!',
        fullname: 'Full Name is required!',
        companyname: 'Company Name is required!',
        ssm: 'SSM Registration is required!',
        businessAddress: 'Business Address is required!',
        phone: 'Phone number is required!',
        dob: 'Date of Birth is required!',
        aboutme: 'About me is required!',
        employmentTypesError: 'Please select at least 1 preferred employment type',
        companyOverviewError: 'Company Overview is required!',
        remark: 'Remark is required!',
    },
    landing: {
        createYourAccountWith: 'Create your account with:',
        alreadyHaveAnAccount: 'Already have an account? Log in.'
    },
    login: {
        welcomeBack: 'Welcome back! Log in to enter 👾',
        yourEmailAddress: 'Your email address',
        yourEmailAddressPlaceholder: 'Your email address',
        yourPassword: 'Your password',
        yourPasswordPlaceholder: 'Your password',
        login: 'Log In',
        orLoginWith: 'Or, log in with:',
        uhOh: 'Uh-oh,',
        forgotPassword: 'forgot your password'
    },
    forgotPassword: {
        forgotPassword: 'Forgot your password?',
        submit: 'Submit',
        errorMessages: {
            email: "Email is required!"
        }
    },
    onboarding: {
        chooseYourSide: "Choose your side",
        sideDesc: "Every journey in Cult Creative begins by choosing your side.",
        creative: "Creative",
        employer: "Employer",
        title: 'Account Type',
        imcreative: "I'm A Creative",
        creativeBody: 'Be part of the creative community in Asia — find jobs, collaborate, and share your work.',
        imhiring: "I'm An Employer",
        hiringBody: "Hire creatives and explore new talents for your company's needs.",
        form: {
            profileImageError: 'Profile Image is required',
            bannerImageError: 'Banner Image is required',
            educationLevelError: 'Education level is required',
            email: 'Email Address',
            emailPlaceholder: 'Your email address',
            password: 'Password',
            passwordPlaceholder: 'Your password',
            confirmPassword: 'Confirm Password',
            confirmPasswordPlaceholder: 'Your confirm password',
            fullname: 'Your Full Name',
            fullnamePlaceholder: 'Your full name',
            companyname: 'Company Name',
            companynamePlaceholder: 'Your company name',
            phone: 'Phone Number',
            phonePlaceholder: 'Your phone number',
            phoneError: 'Phone country code is required',
            addressYou: 'Address You',
            addressYouPlaceholder: 'How to address you?',
            addressYouError: 'Address You is required',
            industry: 'Industry',
            industryPlaceholder: 'Choose industry',
            industryError: 'Industry is required',
            username: 'Enter your username',
            usernamePlaceholder: 'Enter your username'
        },
        registerUserError: '{{ username }} is taken. Try again',
        passwordNotMatch: 'The passwords do not match',
        passwordLengthText: "Password must have at least {{ length }} characters",
        errorMessage: {
            username: "Invalid username format. Eg. Min 3 character with username_1 or username.1"
        }
    },
    menu: {
        savePosts: 'Saved Posts',
        jobBoards: 'Your Job Board',
        notifications: 'Notifications',
        faqs: 'FAQs',
        signout: 'Sign Out',
    },
    bottomNavTab: {
        feed: 'Feed',
        network: 'Network',
        jobs: 'Jobs',
        hire: 'Hire',
        profile: 'Profile',
    },
    feedScreen: {
        whatAreYouWorkingOn: 'What are you working on?',
        completeYourProfilePrompt: 'Complete your profile now to start your journey 🚀',
        report: "Report",
        editDescription: 'Make changes to your post',
        reportDescription: "Flag this post **",
        commentPlaceholder: "Write a comment",
        monthsAgo: "months ago",
        weeksAgo: "weeks ago",
        daysAgo: "days ago",
        hoursAgo: "hours ago",
        minutesAgo: "minutes ago",
        aMomentAgo: "a moment ago",
        likes: "{{numLikes}} likes",
        comments: "{{numComments}} comments",
        maxImagesWarn: "Maximum {{imageNum}} is allowed",
        actions: {
            post: "Post",
            save: "Save",
            unsave: "Unsave",
            report: "Report",
            submit: "Submit"
        },
        actionSheets: {
            saveDesc: "Bookmark this post 📎",
            unsaveDesc: "I've absorbed what I needed ✍",
            reportDesc: "Flag this post 👀",
        },
        prompts: {
            noComments: "No comments. Please write a new comment",
        },
        forms: {
            remarkPlaceholder: 'Your remarks'
        }
    },
    commentScreen: {
        title: "Comments",
        noCommentsYet: 'No comments yet',
        writeAComment: 'Write a comment',
    },
    networkScreen: {
        actions: {
            inviteFriends: 'Invite friends from contacts',
            cancelRequest: 'Cancel Request',
            accept: 'Accept',
            ignore: 'Ignore',
        },
        networkTab: {
            explore: 'Explore',
            pendingRequests: 'Connection Requests',
            sentRequests: 'Sent Requests',
        },
        prompts: {
            noConnectionRequests: "You don't have any connection requests",
            noSentRequests: "You don't have any sent requests",
        }
    },
    jobScreen: {
        actions: {
            addYourVacancy: 'Add your vacancy',
            viewApplicants: 'View Applicants',
            closeJob: 'Close Job',
            applyNow: 'Apply Now',
            saveJob: 'Save Job',
            unsaveJob: 'Unsave Job',
            confirm: 'Confirm',
            submit: 'Submit',
            goBack: 'Go Back',
            sure: "I'm sure",
        },
        basicToken: 'Basic Token',
        premiumToken: 'Premium Token',
        addMoreToken: '+ Add more token',
        youHaveABalanceOf: 'You have a balance of',
        tokenCount: '{{tokenNum}} tokens',
        transactionHistory: 'Transaction History',
        theRole: 'Job Description',
        responsibilites: 'Job Requirements',
        jobDetails: 'Job Details',
        employmentType: 'Employment Type:',
        experienceLevel: 'Experience level:',
        educationLevel: 'Education level:',
        salaryRange: 'Salary Range:',
        workingDays: 'Working Days:',
        thePerks: 'The Perks',
        aboutMyCompany: 'About My Company',
        companySize: 'Company Size',
        companyOverview: 'Company Overview',
        publishedDays: '{{publishedNum}} days ago',
        applicants: '{{applicantsNum}} applicants',
        jobsTab: {
            openJobs: 'Open Jobs',
            expiredJobs: 'Expired Jobs',
            closedJobs: 'Closed Jobs',
            savedJobs: 'Saved Jobs',
            appliedJobs: 'Applied Jobs',
        },
        prompts: {
            noRecords: "We could not find what you're looking for. Try to adjust your search settings",
            noOpen: "You have no active jobs",
            noExpired: "You have no expired jobs",
            noClosed: "You hva no closed jobs",
            insufficientToken: 'Insufficient tokens available',

        },
        tokenUsed: "You are using 1 {{tokenName}} token",
        iWouldLikeToCreateA: 'I would Like To Create A',
        paidJobPosting: 'Paid Job Posting',
        requiredToken: "{{tokenNum}} {{ tokenType }} token per posting",
        freeJobPosting: 'Free Job Posting',
        noTokenRequired: 'No tokens required',
        availableJobs: {
            fulltime: 'Full-time position',
            parttime: 'Part-time position',
            freelance: 'Freelance position',
            contract: 'Contract position',
            internship: 'Internship position',
        },
        topUpTitle: 'Purchase tokens and start posting jobs today',
        topUpDescription: 'One token represents one job possting. To find out more about your token and its validity.',
        topUpClickHere: 'Click here',
        topUpTotal: 'Total',
        actionSheet: {
            title: "Are you sure?",
            bodyText: "Once the job is posted, you can't change the employment type."
        },
        bookmarkDesc: "Status check on your jobs"
    },
    savedJobs: {
        jobBy: "Job by"
    },
    vacancyFormScreen: {
        screenTitle: "Fill In The Details Of Your Job Position",
        jobTitleLabel: "Job Title",
        jobTitlePlaceholder: "Job Title",
        jobTitleRuleText: "Job title is required",
        jobDescLabel: "Job Description: What's The Role?",
        jobDescPlaceholder: "Job Description: What's The Role?",
        jobDescRuleText: "Job description is required",
        salaryRangeLabel: "Salary Range",
        salaryRangePlaceholder: "Salary Range",
        workTypeLabel: "Choose Working Type",
        workTypePlaceholder: "Choose Working Type",
        addressLabel: "Office Address",
        addressPlaceholder: "Search for your office address",
        countryLabel: "Country",
        countryPlaceholder: "Please choose your country",
        cityLabel: "City",
        cityPlaceholder: "Please choose your city",
        workDaysLabel: "Choose Working Days",
        workDaysPlaceholder: "Choose Working Days",
        responsibilitiesLabel: "What are the responsibilities of this role?",
        responsibilitiesPlaceholder: "What are the responsibilities of this role?",
        responsibilitiesRuleText: "Responsibilities of this role is required",
        benefitsLabel: "Benefits of this role",
        benefitsPlaceholder: "Benefits of this role",
        benefitsRuleText: "Benefits of this role is required",
        experienceLabel: "Experience Level",
        experiencePlaceholder: "Experience Level",
        educationLabel: "Educational Qualification",
        educationPlaceholder: "Educational Qualification",
        managerLabel: "Hiring Manager (Private)",
        managerPlaceholder: "Hiring Manager (Private)",
        managerRuleText: "Hiring Manager (Private) is required",
        prompts: {
            jobAddedSuccess: 'Job added successfully'
        }
    },
    applyJobScreen: {
        actions: {
            submit: 'Submit',
            label: 'Choose or upload resume',
            upload: 'Upload',
        },
        title: 'Apply Job',
        header: "Applying to {{jobTitle}} by {{author}}",
        emptyResume1: "There are no resume available yet. Please upload your resume by tapping the",
        emptyResume2: `"Upload"`,
        emptyResume3: "button above.",
        fileUploadSuccess: 'File uploaded successfully',
        prompts: {
            cancelPicker: 'Picker cancelled',
            multiplePickerOpened: 'Multiple pickers were opened, only the last will be consideredcancelled',
        }
    },
    closeJobScreen: {
        satisfication: "How satisfied are you with Cult Creative?",
        closeJobReasonTitle: "Why did you close this job?",
        confirmButtonLabel: "Confirm"
    },
    applicantItem: {
        prompts: {
            copyText: 'Copied to clipboard',
        },
        callButton: 'Call',
        sendEmailButton: 'Send Email',
        actionList: {
            copyPhoneTitle: "Copy Phone Number",
            copyPhoneText: "You can save this number to your contacts 🤙",
            copyEmailTitle: "Copy Email Address",
            copyEmailText: "You can save this email to your contacts 💌",
            shortListedTitle: "Shortlisted Applicant",
            shortListedText: "Great, they fit the bill 🤝",
            unsuccessfulTitle: "Unsuccessful Applicant",
            unsuccessfulText: "There's always next time 👋🏼",
        },
    },
    purchaseTokenScreen: {
        title: "Enter your promo code",
        placeHolder: "Have a coupon?",
        summary: "Summary:",
        totalLabel: "Total:",
        terms1: "I have read and understood the",
        terms2: "terms & condition",
        terms3: "of the implementations of job tokens.",
        purchaseButton: "Purchase",
        apply: "Apply",
        prompts: {
            wentWrong: "Ops! something went wrong while processing your payment",
            paymentCancel: "Payment cancelled",
            paymentSucceed: "The payment was confirmed successfully"
        }
    },
    transactionHistoryScreen: {
        title: "Transaction History",
        statuses: {
            topUpTitle: "Top up",
            topUpDesc: "Top up successful into account",
            inProgressTitle: "Topup In Progress",
            inProgressDesc: "Transaction is in progress. We will notify you once approved",
            failedTitle: "Unsuccessful Topup",
            failedDesc: "Something went wrong on the transaction. Please contact administrator or your bank"
        },
        totalDiscount: "Total Discount",
        totalAmountPaid: "Total Amount Paid",
        paymentMethod: "Payment Method",
        transactionDate: "Transaction Date"
    },
    profileScreen: {
        aboutMe: 'About Me',
        viewAll: 'View All',
        myProjects: 'My Projects',
        myNetwork: 'My Network',
        showCasePastProjects: '+ Add {{projectsNum}} more projects',
        companySize: 'Company Size',
        companyOverview: 'Company Overview',
        projectTitlePlaceholder: 'Project title',
        projectDescriptionPlaceholder: "Describe your project and tell the world what it's about",
        copyPaste: "Copy & paste a video link",
        prompts: {
            noProjects: "No projects",
            projectImageRequired: "Project image is required",
            projectDescRequired: "Project description is required",
        }

    },
    editProfileScreen: {
        profilePicture: 'Profile Picture',
        coverPhoto: 'Cover Photo',
        options: {
            myProfile: 'My Profile',
            myCareerDeets: 'My Career Deets',
            myLocation: 'My Location',
            myLinks: 'My Links',
            myTopics: 'My Topics',
            myGoals: 'My Goals',
            dangerousArea: 'Dangerous Area',
            myCompanyInformation: "Company Information",
            myGallery: "Gallery",
            companyInfo: "Company Info",
            uploadYourself: "Upload Yourself",
            careerDetails: "Career Details",
            loclink: "Location & Links"
        },
        actions: {
            deleteAccount: 'Delete Account',
            save: 'Save',
            addMore: 'Add more',
        },
        myProfileForm: {
            title: 'Edit My Profile',
            usernameLabel: 'Username',
            usernamePlaceholder: 'Username',
            companynameLabel: 'Company Name',
            companynamePlaceholder: 'Company Name',
            ssmLabel: 'SSM Registration',
            ssmPlaceholder: 'SSM Registration',
            fullnameLabel: 'Full Name',
            fullnamePlaceholder: 'Full Name',
            websiteLabel: 'Website',
            websitePlaceholder: 'www.example.com',
            employerIndustryLabel: 'Choose Industry',
            employerIndustryPlaceholder: 'Choose Industry',
            companySizeLabel: 'Choose Company Size',
            companySizePlaceholder: 'Choose Company Size',
            companyOverviewLabel: 'Company Overview',
            companyOverviewPlaceholder: 'Company Overview',
            emailLabel: 'Email Address',
            emailPlaceholder: 'Email Address',
            addressYouLabel: 'How should we addres you?',
            addressYouPlaceholder: 'Choose how we should address you?',
            phoneLabel: 'Phone number',
            phonePlaceholder: 'Phone number',
            dobLabel: 'Date of Birth',
            dobPlaceholder: 'Your birthdate format YYYY-MM-DD',
            educationLabel: 'Education Level',
            educationPlaceholder: 'Choose your education level',
            salaryLabel: 'Expected Salary',
            currentSalaryLabel: 'Expected Salary',
            salaryPlaceholder: 'Choose your salary range',
            employmentLabel: 'Preferred Employment Type',
            employmentPlaceholder: 'Choose your prefered employment',
            aboutMeLabel: "About Me (don't be shy)",
            aboutMePlaceholder: "Write something about yourself",
        },
        myCareerDeetsForm: {
            title: 'Edit My Career Deets',
            positionLabel: 'Title/Position',
            positionPlaceholder: 'Title/Position',
            jobLabel: 'Choose Job Type',
            jobPlaceholder: 'Choose Job Type',
            companyLabel: 'Company',
            companyPlaceholder: 'Company',
        },
        myLocationForm: {
            title: 'Edit My Location',
            nationalityLabel: 'Nationality',
            nationalityPlaceholder: 'Choose your nationality',
            countryLabel: 'Country',
            countryPlaceholder: 'Choose your country',
            cityLabel: 'City',
            cityPlaceholder: 'Choose your city',
            stateLabel: 'City',
            statePlaceholder: 'Choose your city',
        },
        myLinksForm: {
            title: 'Edit My Links',
            portFolioTitle: "Portfolio Links",
            websiteTitle: "Website Links",
            resumeTitle: "Curriculum Vitaes",
            addPortFolio: "Add Portfolio Links",
            addWebsite: "Add Website",
            addResume: "Upload Resume",
            addLinksDesc: "Please include “https://“ in your link",
        },
        myGoalsForm: {
            title: 'Edit My Goals',
            instructions: "Long press one of these intentions to feature them in your profile"
        },
        myTopicsForm: {
            title: 'Edit My Topic',
        },
    },
    deleteProfile: {
        question: "Tell us why you're deleting your account:",
        here: 'here',
        text1: `All data on this account will be removed and will not be restorable. Please export any important information you may like to keep.`,
        text2: 'If you have any questions, feel free to reach out via support@creative.asia.'
    },
    orangeTick: {
        avatarUploadStatus: "Profile Photo uploaded succesfully",
        bannerUploadStatus: "Banner Photo uploaded succesfully",
        tapChangeImage: "Tap again to change image",
        uploadAvatar: "Tap here to upload profile photo",
        uploadBanner: "Tap here to upload banner photo",
        congratulations: "Congratulations!",
        congratsText: "You have earned your Orange Tick. Your success of matching for a job, getting your work out there and connecting with other creatives has incresed.",
        goodLuck: "Good luck!"
    }
}