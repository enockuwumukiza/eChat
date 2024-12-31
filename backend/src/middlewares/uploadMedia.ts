import { getFileUrl } from "../utils/urlGenerator";
import cloudinary from 'cloudinary';


type ResourceType = 'image' | 'video' | 'raw';

export const uploadMedia = async (fileBuffer: Express.Multer.File, type: ResourceType, transformations = {}) => {
    try {
        if (!fileBuffer) throw new Error('No file provided');

        
        const fileBufferUrl = getFileUrl(fileBuffer);

        if (!fileBufferUrl.content) throw new Error('Failed to generate file URL');

        // Upload to Cloudinary
        const result = await cloudinary.v2.uploader.upload(fileBufferUrl.content, {
            resource_type: type,
            folder:'media_files',
        });

        return result;
    } catch (error: any) {
        throw new Error(`Error uploading file: ${error.message || 'Unknown error'}`);
    }
};
