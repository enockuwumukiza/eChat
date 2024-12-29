import { uploadMedia } from '../middlewares/uploadMedia';

type ResourceType = 'image' | 'video' | 'raw';

interface MediaUrl {
  public_id: string;
  secure_url: string;
}

interface TransformationOptions {
  transformation: Record<string, unknown> | Record<string, unknown>[];
}

export const uploadFileHandler = async (
  file: Express.Multer.File,
  type: ResourceType
): Promise<MediaUrl> => {
  if (!file) {
    throw new Error('No file provided.');
  }

  try {
    let transformation: TransformationOptions | undefined;

    // Define transformation options based on type
    switch (type) {
      case 'image':
        transformation = {
          transformation: {
            width: 800,
            height: 800,
            crop: 'fill',
            gravity: 'center',
            format: 'png',
          },
        };
        break;
      case 'video':
        transformation = {
          transformation: [
            {
              width: 1280,
              height: 720,
              crop: 'limit',
              quality: 'auto',
              format: 'mp4',
            },
            {
              overlay: 'your_watermark_id',
              gravity: 'south_east',
              x: 10,
              y: 10,
              opacity: 50,
            },
            { effect: 'sepia' },
            { start_offset: 10, end_offset: 60 },
          ],
        };
        break;
      case 'raw':
        transformation = undefined; // No transformation for raw files
        break;
      default:
        throw new Error('Unsupported media type.');
    }

    // Upload media with the corresponding transformation
    const mediaUrl = await uploadMedia(file, type, transformation);

    // Validate response
    if (!mediaUrl || !mediaUrl.public_id || !mediaUrl.secure_url) {
      throw new Error(`Failed to upload ${type} to Cloudinary`);
    }

    return mediaUrl;
  } catch (error: any) {
    throw new Error(`Error uploading media: ${error?.message || 'Unknown error'}`);
  }
};
