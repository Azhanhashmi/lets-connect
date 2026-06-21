import { cloudinary } from '../config/cloudinary';
import { UploadApiResponse } from 'cloudinary';

export const uploadToCloudinary = (
  buffer: Buffer,
  folder: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }],
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error('Upload failed: no result returned'));
        resolve(result);
      }
    );
    stream.end(buffer);
  });
};

export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};

export const extractPublicId = (url: string): string => {
  const parts = url.split('/');
  const filenameWithExt = parts[parts.length - 1];
  const filename = filenameWithExt.split('.')[0];
  const folder = parts[parts.length - 2];
  return `${folder}/${filename}`;
};
