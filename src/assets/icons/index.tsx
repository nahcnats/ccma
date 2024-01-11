import { 
    FontAwesome, 
    FontAwesome5, 
    MaterialCommunityIcons,
    Feather,
    AntDesign,
    Octicons,
    Ionicons,
    Entypo,
    MaterialIcons
} from '@expo/vector-icons';
import { View, Text } from 'react-native';

interface IconProps {
    size: number,
    color: string,
    [x: string]: any;
}

const IconFeeds = ({size, color, ...props}: IconProps) => <FontAwesome name="stack-exchange" size={size} color={color} {...props} />;
const IconNetwork = ({ size, color, ...props }: IconProps) => <FontAwesome5 name="user-friends" size={size} color={color} {...props} />;
const IconJobs = ({ size, color, ...props }: IconProps) => <MaterialCommunityIcons name="briefcase" size={size} color={color} {...props} />;
const IconProfile = ({ size, color, ...props }: IconProps) => <FontAwesome name="user" size={size} color={color} {...props} />;
const IconBars = ({ size, color, ...props }: IconProps) => (
    <View className='flex p-2 w-11 rounded-full border border-gray-300 bg-white'>
        <Text className='self-center'><FontAwesome name="bars" size={size} color={color} {...props} /></Text>
    </View>  
);
const IconQuestion = ({ size, color, ...props }: IconProps) => <FontAwesome5 name="question-circle" size={size} color={color} {...props} />;
const IconPrivacy = ({ size, color, ...props }: IconProps) => <MaterialIcons name="privacy-tip" size={size} color={color} {...props} />;
const IconExclamation = ({ size, color, ...props }: IconProps) => <AntDesign name="exclamationcircleo" size={size} color={color} {...props} />;
const IconSignOut = ({ size, color, ...props }: IconProps) => <FontAwesome name="sign-out" size={size} color={color} {...props} />;
const IconNotification = ({ size, color, ...props }: IconProps) => <FontAwesome name="bell" size={size} color={color} {...props} />;
const IconBookmark = ({ size, color, ...props }: IconProps) => <FontAwesome name="bookmark-o" size={size} color={color} {...props} />;
const IconBack = ({ size, color, ...props }: IconProps) => (
    <View className='flex p-1 rounded-full border border-gray-300 bg-white'>
        <Text className='self-center'>
            <Feather name="chevron-left" size={size} color={color} {...props} />
        </Text>
    </View>
);
const IconHeart = ({ size, color, ...props }: IconProps) => <AntDesign name="hearto" size={size} color={color} {...props} />;
const IconHeartFill = ({ size, color, ...props }: IconProps) => <AntDesign name="heart" size={size} color={color} {...props} />;
const IconComment = ({ size, color, ...props }: IconProps) => <Octicons name="comment-discussion" size={size} color={color} {...props} />;
const IconShare = ({ size, color, ...props }: IconProps) => <AntDesign name="sharealt" size={size} color={color} {...props} />;
const IconRight = ({ size, color, ...props }: IconProps) => <AntDesign name="right" size={size} color={color} {...props} />;
const IconLeft = ({ size, color, ...props }: IconProps) => <AntDesign name="left" size={size} color={color} {...props} />;
const IconDown = ({ size, color, ...props }: IconProps) => <AntDesign name="down" size={size} color={color} {...props} />;
const IconUp = ({ size, color, ...props }: IconProps) => <AntDesign name="up" size={size} color={color} {...props} />;
const IconMoreVertical = ({ size, color, ...props }: IconProps) => <Feather name="more-vertical" size={size} color={color} {...props} />;
const IconSearch = ({ size, color, ...props }: IconProps) => <Feather name="search" size={size} color={color} {...props} />;
const IconTelescope = ({ size, color, ...props }: IconProps) => <Octicons name="telescope" size={size} color={color} {...props} />;
const IconReport = ({ size, color, ...props }: IconProps) => <Octicons name="report" size={size} color={color} {...props} />;
const IconEdit = ({ size, color, ...props }: IconProps) => <Feather name="edit" size={size} color={color} {...props} />;
const IconUserEdit = ({ size, color, ...props }: IconProps) => (
    <View className='flex items-center justify-center py-2 px-1 rounded-full border border-gray-300 bg-white'>
        <Text className='self-center'>
            <FontAwesome5 name="user-edit" size={size} color={color} {...props} />
        </Text>
    </View>
);
const IconCheckCircle = ({ size, color, ...props }: IconProps) => <AntDesign name="checkcircle" size={size} color={color} {...props} />;
const IconCloseCircle = ({ size, color, ...props }: IconProps) => <AntDesign name="closecircle" size={size} color={color} {...props} />;
const IconAdd = ({ size, color, ...props }: IconProps) => <Ionicons name="add" size={size} color={color} {...props} />;
const IconText = ({ size, color, ...props }: IconProps) => <MaterialCommunityIcons name="format-text" size={size} color={color} {...props} />;
const IconYoutube = ({ size, color, ...props }: IconProps) => <MaterialCommunityIcons name="youtube" size={size} color={color} {...props} />;
const IconImage = ({ size, color, ...props }: IconProps) => <Entypo name="image" size={size} color={color} {...props} />;
const IconImages = ({ size, color, ...props }: IconProps) => <Entypo name="images" size={size} color={color} {...props} />;
const IconClose = ({ size, color, ...props }: IconProps) => (
    <View className='flex items-center justify-center py-2 px-1 rounded-full border border-gray-300 bg-white'>
        <Text className='self-center'>
            <AntDesign name="close" size={size} color={color} {...props} />
        </Text>
    </View>
);
const IconCalendar = ({ size, color, ...props }: IconProps) => <Entypo name="calendar" size={size} color={color} {...props} />;
const IconDelete = ({ size, color, ...props }: IconProps) => <MaterialIcons name="delete" size={size} color={color} {...props} />;
const IconFile = ({ size, color, ...props }: IconProps) => <FontAwesome name="file" size={size} color={color} {...props} />;
const IconEmail = ({ size, color, ...props }: IconProps) => <MaterialIcons name="email" size={size} color={color} {...props} />;
const IconLock = ({ size, color, ...props }: IconProps) => <Entypo name="lock" size={size} color={color} {...props} />;
const IconShowPassword = ({ size, color, ...props }: IconProps) => <Entypo name="eye-with-line" size={size} color={color} {...props} />;
const IconFacebook = ({ size, color, ...props }: IconProps) => <Entypo name="facebook-with-circle" size={size} color={color} {...props} />;
const IconGoogle = ({ size, color, ...props }: IconProps) => <Entypo name="google--with-circle" size={size} color={color} {...props} />;
const IconApple = ({ size, color, ...props }: IconProps) => <FontAwesome name="apple" size={size} color={color} {...props} />;
const IconFileUpload = ({ size, color, ...props }: IconProps) => <MaterialCommunityIcons name="file-upload-outline" size={size} color={color} {...props} />;
const IconFilePDF = ({ size, color, ...props }: IconProps) => <FontAwesome name="file-pdf-o" size={size} color={color} {...props} />;
const IconCall = ({ size, color, ...props }: IconProps) => <Ionicons name="call" size={size} color={color} {...props} />;
const IconKeypad = ({ size, color, ...props }: IconProps) => <Ionicons name="keypad" size={size} color={color} {...props} />;
const IconAlias = ({ size, color, ...props }: IconProps) => <Entypo name="email" size={size} color={color} {...props} />;
const IconThumbsUp = ({ size, color, ...props }: IconProps) => <Entypo name="thumbs-up" size={size} color={color} {...props} />;
const IconThumbsDown = ({ size, color, ...props }: IconProps) => <Entypo name="thumbs-down" size={size} color={color} {...props} />;
const IconCaretUp = ({ size, color, ...props }: IconProps) => <AntDesign name="caretup" size={size} color={color} {...props} />;
const IconCaretDown = ({ size, color, ...props }: IconProps) => <AntDesign name="caretdown" size={size} color={color} {...props} />;
const IconPlay = ({ size, color, ...props }: IconProps) => <FontAwesome name="play" size={size} color={color} {...props} />;
    
export {
    IconFeeds,
    IconNetwork,
    IconJobs,
    IconProfile,
    IconBars,
    IconQuestion,
    IconPrivacy,
    IconExclamation,
    IconSignOut,
    IconNotification,
    IconBookmark,
    IconBack,
    IconHeart,
    IconHeartFill,
    IconComment,
    IconShare,
    IconRight,
    IconLeft,
    IconDown,
    IconUp,
    IconMoreVertical,
    IconSearch,
    IconTelescope,
    IconReport,
    IconEdit,
    IconUserEdit,
    IconCheckCircle,
    IconCloseCircle,
    IconAdd,
    IconText,
    IconYoutube,
    IconImage,
    IconImages,
    IconClose, 
    IconCalendar,
    IconDelete,
    IconFile,
    IconEmail,
    IconLock,
    IconShowPassword,
    IconFacebook,
    IconGoogle,
    IconApple,
    IconFileUpload,
    IconFilePDF,
    IconCall,
    IconKeypad,
    IconAlias,
    IconThumbsUp,
    IconThumbsDown,
    IconCaretUp,
    IconCaretDown,
    IconPlay,
}