import { launchImageLibrary } from "react-native-image-picker";
import ImagePicker from 'react-native-image-crop-picker';
import { convertImageUrlToBase64, showErrorToast } from "../../../utils";

interface Contents {
    fileData: string | undefined | unknown
    fileName: string | undefined
    fileType: string | undefined
    type: string
}

export interface Content {
    id: number | string
    type: string
    content: string
    contents: Contents[]
}

export const transformContentImages = async (imageUrl: string) => {
    try {
        const fileData = await convertImageUrlToBase64(imageUrl);
        const fileName = imageUrl.split('images/')[1];
        const fileType = `image/${fileName.split('.').pop()}`;

        return {
            fileData,
            fileName,
            fileType,
        }
    } catch (error) {
        throw error;
    }
}

export const formatPayloadContents = (content: Content[]) => {
    let contents = [];

    for (let i = 0; i < content.length; i++) {
        if (content[i].type === 'TEXT') {
            contents.push({
                contentType: 'TEXT',
                content: content[i].content,
            });
        }

        if (content[i].type === 'VIDEO') {
            contents.push({
                contentType: 'VIDEO',
                content: content[i].content,
            });
        }

        if (content[i].type === 'IMAGE') {
            contents.push({
                contentType: 'IMAGE',
                content: '',
                fileData: content[i].contents[0].fileData,
                fileName: content[i].contents[0].fileName,
            });
        }

        if (content[i].type === 'IMAGES') {
            let images = [];

            for (const item of content[i].contents) {
                images.push({
                    contentType: 'IMAGE',
                    content: '',
                    fileData: item.fileData,
                    fileName: item.fileName,
                });
            }

            contents.push({
                contentType: 'IMAGES',
                content: images,
            });
        }
    }

    return contents;
}