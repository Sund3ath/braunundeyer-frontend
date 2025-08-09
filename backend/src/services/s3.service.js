import { 
  S3Client, 
  PutObjectCommand, 
  DeleteObjectCommand, 
  GetObjectCommand,
  HeadObjectCommand,
  ListObjectsV2Command 
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { getSignedUrl as getCloudFrontSignedUrl } from '@aws-sdk/cloudfront-signer';
import multer from 'multer';
import multerS3 from 'multer-s3';
import sharp from 'sharp';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs/promises';
import logger from '../utils/logger.js';

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'eu-central-1',
  credentials: process.env.AWS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  } : undefined // Use IAM role if no credentials provided
});

const bucketName = process.env.S3_BUCKET_NAME || 'braunundeyer-assets';
const cloudfrontDomain = process.env.CLOUDFRONT_DOMAIN;

// Helper function to get file extension
const getFileExtension = (filename) => {
  return path.extname(filename).toLowerCase();
};

// Helper function to generate unique filename
const generateUniqueFilename = (originalname) => {
  const ext = getFileExtension(originalname);
  const timestamp = Date.now();
  const uuid = uuidv4().substring(0, 8);
  return `${timestamp}-${uuid}${ext}`;
};

// S3 upload configuration for multer
export const s3Upload = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: bucketName,
    acl: 'private', // Use private ACL and serve through signed URLs
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, {
        uploadedBy: req.user?.id?.toString() || 'anonymous',
        originalName: file.originalname,
        uploadDate: new Date().toISOString()
      });
    },
    key: (req, file, cb) => {
      const folder = file.fieldname === 'images' ? 'images' : 'media';
      const filename = generateUniqueFilename(file.originalname);
      cb(null, `${folder}/${new Date().getFullYear()}/${filename}`);
    }
  }),
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10485760 // 10MB default
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp|svg|pdf/;
    const extname = allowedTypes.test(getFileExtension(file.originalname));
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only images and PDFs are allowed.'));
    }
  }
});

// Upload file to S3 with image optimization
export const uploadToS3 = async (file, options = {}) => {
  try {
    const {
      folder = 'media',
      optimize = true,
      generateThumbnail = true,
      maxWidth = 2000,
      quality = 85
    } = options;

    const filename = generateUniqueFilename(file.originalname);
    const year = new Date().getFullYear();
    const basePath = `${folder}/${year}`;

    // Prepare file data
    let fileBuffer = file.buffer;
    let contentType = file.mimetype;

    // Optimize image if needed
    if (optimize && file.mimetype.startsWith('image/') && !file.mimetype.includes('svg')) {
      const sharpInstance = sharp(file.buffer);
      const metadata = await sharpInstance.metadata();

      // Only resize if image is larger than maxWidth
      if (metadata.width > maxWidth) {
        fileBuffer = await sharpInstance
          .resize(maxWidth, null, { withoutEnlargement: true })
          .jpeg({ quality, progressive: true })
          .toBuffer();
        contentType = 'image/jpeg';
      } else if (file.mimetype !== 'image/jpeg') {
        // Convert to JPEG for better compression
        fileBuffer = await sharpInstance
          .jpeg({ quality, progressive: true })
          .toBuffer();
        contentType = 'image/jpeg';
      }
    }

    // Upload main file
    const mainKey = `${basePath}/${filename}`;
    const uploadCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: mainKey,
      Body: fileBuffer,
      ContentType: contentType,
      Metadata: {
        originalName: file.originalname,
        uploadedAt: new Date().toISOString()
      },
      CacheControl: 'public, max-age=31536000', // 1 year cache
      ServerSideEncryption: 'AES256' // Enable server-side encryption
    });

    await s3Client.send(uploadCommand);

    const result = {
      key: mainKey,
      bucket: bucketName,
      filename: filename,
      originalName: file.originalname,
      size: fileBuffer.length,
      contentType: contentType,
      url: await getFileUrl(mainKey)
    };

    // Generate thumbnail if needed
    if (generateThumbnail && file.mimetype.startsWith('image/') && !file.mimetype.includes('svg')) {
      const thumbnailBuffer = await sharp(file.buffer)
        .resize(300, 300, { 
          fit: 'cover',
          position: 'center'
        })
        .jpeg({ quality: 80 })
        .toBuffer();

      const thumbnailKey = `${basePath}/thumb-${filename}`;
      const thumbnailCommand = new PutObjectCommand({
        Bucket: bucketName,
        Key: thumbnailKey,
        Body: thumbnailBuffer,
        ContentType: 'image/jpeg',
        Metadata: {
          originalName: file.originalname,
          isThumbnail: 'true'
        },
        CacheControl: 'public, max-age=31536000',
        ServerSideEncryption: 'AES256'
      });

      await s3Client.send(thumbnailCommand);
      result.thumbnailKey = thumbnailKey;
      result.thumbnailUrl = await getFileUrl(thumbnailKey);
    }

    logger.info(`File uploaded to S3: ${mainKey}`);
    return result;
  } catch (error) {
    logger.error('S3 upload error:', error);
    throw new Error(`Failed to upload file to S3: ${error.message}`);
  }
};

// Delete file from S3
export const deleteFromS3 = async (key) => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    await s3Client.send(command);
    logger.info(`File deleted from S3: ${key}`);
    return true;
  } catch (error) {
    logger.error('S3 delete error:', error);
    throw new Error(`Failed to delete file from S3: ${error.message}`);
  }
};

// Delete multiple files from S3
export const deleteMultipleFromS3 = async (keys) => {
  try {
    const deletePromises = keys.map(key => deleteFromS3(key));
    await Promise.all(deletePromises);
    logger.info(`Deleted ${keys.length} files from S3`);
    return true;
  } catch (error) {
    logger.error('S3 bulk delete error:', error);
    throw new Error(`Failed to delete files from S3: ${error.message}`);
  }
};

// Get signed URL for file access
export const getFileUrl = async (key, expiresIn = 3600) => {
  try {
    // If CloudFront is configured, use CloudFront signed URL
    if (cloudfrontDomain && process.env.CLOUDFRONT_KEY_PAIR_ID) {
      const privateKey = await fs.readFile(
        process.env.CLOUDFRONT_PRIVATE_KEY_PATH || './cloudfront-private-key.pem',
        'utf8'
      );

      const url = `${cloudfrontDomain}/${key}`;
      const dateLessThan = new Date(Date.now() + expiresIn * 1000);

      return getCloudFrontSignedUrl({
        url,
        dateLessThan,
        privateKey,
        keyPairId: process.env.CLOUDFRONT_KEY_PAIR_ID
      });
    }

    // Otherwise, use S3 presigned URL
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    logger.error('Get file URL error:', error);
    // Return a placeholder URL if error
    return `/api/media/placeholder?key=${encodeURIComponent(key)}`;
  }
};

// Check if file exists in S3
export const fileExistsInS3 = async (key) => {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    if (error.name === 'NotFound') {
      return false;
    }
    throw error;
  }
};

// List files in S3 bucket
export const listS3Files = async (prefix = '', maxKeys = 100) => {
  try {
    const command = new ListObjectsV2Command({
      Bucket: bucketName,
      Prefix: prefix,
      MaxKeys: maxKeys
    });

    const response = await s3Client.send(command);
    return response.Contents || [];
  } catch (error) {
    logger.error('S3 list error:', error);
    throw new Error(`Failed to list files from S3: ${error.message}`);
  }
};

// Get file metadata
export const getFileMetadata = async (key) => {
  try {
    const command = new HeadObjectCommand({
      Bucket: bucketName,
      Key: key
    });

    const response = await s3Client.send(command);
    return {
      size: response.ContentLength,
      contentType: response.ContentType,
      lastModified: response.LastModified,
      metadata: response.Metadata
    };
  } catch (error) {
    logger.error('S3 metadata error:', error);
    throw new Error(`Failed to get file metadata: ${error.message}`);
  }
};

// Generate upload presigned URL for direct browser upload
export const getUploadPresignedUrl = async (filename, contentType, metadata = {}) => {
  try {
    const key = `uploads/${new Date().getFullYear()}/${generateUniqueFilename(filename)}`;
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: key,
      ContentType: contentType,
      Metadata: metadata,
      ServerSideEncryption: 'AES256'
    });

    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    return {
      uploadUrl,
      key,
      publicUrl: await getFileUrl(key)
    };
  } catch (error) {
    logger.error('Presigned URL generation error:', error);
    throw new Error(`Failed to generate upload URL: ${error.message}`);
  }
};

// Migrate local files to S3
export const migrateToS3 = async (localPath, s3Path) => {
  try {
    const fileBuffer = await fs.readFile(localPath);
    const filename = path.basename(localPath);
    
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: s3Path,
      Body: fileBuffer,
      ContentType: 'application/octet-stream',
      Metadata: {
        migratedFrom: localPath,
        migratedAt: new Date().toISOString()
      }
    });

    await s3Client.send(command);
    logger.info(`File migrated to S3: ${localPath} -> ${s3Path}`);
    
    return {
      key: s3Path,
      url: await getFileUrl(s3Path)
    };
  } catch (error) {
    logger.error('Migration error:', error);
    throw new Error(`Failed to migrate file: ${error.message}`);
  }
};

export default {
  s3Upload,
  uploadToS3,
  deleteFromS3,
  deleteMultipleFromS3,
  getFileUrl,
  fileExistsInS3,
  listS3Files,
  getFileMetadata,
  getUploadPresignedUrl,
  migrateToS3
};