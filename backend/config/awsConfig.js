import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';
import dotenv from 'dotenv';
import Jimp from 'jimp';

dotenv.config();

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async (file, bucketName) => {
  if (!bucketName) {
    throw new Error('Bucket name is not defined');
  }

  try {
    // Load image using Jimp
    const image = await Jimp.read(file.buffer);

    // Resize and compress the image (adjust parameters as needed)
    image.resize(800, Jimp.AUTO) // Resize width to 800px, maintain aspect ratio
         .quality(80) // Set JPEG quality to 80%

    // Convert Jimp image to buffer
    const compressedImageBuffer = await image.getBufferAsync(Jimp.MIME_JPEG);

    // Prepare S3 upload parameters
    const params = {
      Bucket: bucketName,
      Key: `${nanoid()}-${file.originalname}`,
      Body: compressedImageBuffer, // Use compressed image buffer
      ContentType: 'image/jpeg', // Set appropriate content type
      ACL: 'public-read', // Set appropriate permissions
    };

    // Upload to S3 and return the promise
    const uploadResult = await s3.upload(params).promise();
    return uploadResult;
  } catch (error) {
    throw new Error(`Error uploading image to S3: ${error.message}`);
  }
};

