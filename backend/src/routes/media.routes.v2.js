import express from 'express';
import multer from 'multer';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import db from '../config/db-simple.js';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import logger from '../utils/logger.js';
import { 
  uploadToS3, 
  deleteFromS3, 
  getFileUrl,
  getUploadPresignedUrl,
  s3Upload 
} from '../services/s3.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Check if S3 is enabled
const useS3 = process.env.USE_S3 === 'true';

// Local storage configuration
const localStorage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../..', 'uploads');
    await fs.mkdir(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// File filter for both local and S3
const fileFilter = (req, file, cb) => {
  // Allow images, videos, and PDFs
  const allowedImageTypes = /jpeg|jpg|png|gif|webp|svg|pdf/;
  const allowedVideoTypes = /mp4|webm|ogg|mov|avi|mkv/;
  
  const ext = path.extname(file.originalname).toLowerCase().substring(1);
  const isImage = allowedImageTypes.test(ext);
  const isVideo = allowedVideoTypes.test(ext);
  
  // Also check mimetype
  const isImageMime = file.mimetype.startsWith('image/') || file.mimetype === 'application/pdf';
  const isVideoMime = file.mimetype.startsWith('video/');

  if ((isImage && isImageMime) || (isVideo && isVideoMime)) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files, videos, and PDFs are allowed'));
  }
};

// Choose storage based on configuration
const upload = useS3 
  ? s3Upload 
  : multer({
      storage: localStorage,
      limits: {
        fileSize: parseInt(process.env.MAX_FILE_SIZE) || 104857600 // 100MB default (increased for videos)
      },
      fileFilter: fileFilter
    });

// Upload single image (works with both local and S3)
router.post('/upload',
  authenticate,
  authorize('admin', 'editor'),
  upload.single('image'),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const { alt_text, caption } = req.body;
      let mediaData = {};

      if (useS3) {
        // S3 upload - file already uploaded by multer-s3
        const fileUrl = await getFileUrl(req.file.key);
        
        mediaData = {
          filename: req.file.key,
          original_name: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: req.file.key, // Store S3 key
          url: fileUrl,
          storage_type: 's3',
          bucket: req.file.bucket
        };

        // Generate thumbnail for S3 images
        if (req.file.mimetype.startsWith('image/') && !req.file.mimetype.includes('svg')) {
          try {
            // Download image from S3 for processing
            const response = await fetch(fileUrl);
            const buffer = await response.arrayBuffer();
            
            const thumbnailResult = await uploadToS3({
              buffer: Buffer.from(buffer),
              originalname: `thumb-${req.file.originalname}`,
              mimetype: 'image/jpeg'
            }, {
              folder: 'thumbnails',
              maxWidth: 300,
              quality: 80
            });
            
            mediaData.thumbnail_key = thumbnailResult.key;
            mediaData.thumbnail = thumbnailResult.url;
          } catch (err) {
            logger.warn('Thumbnail generation failed:', err);
          }
        }
      } else {
        // Local storage
        const uploadDir = path.join(__dirname, '../..', 'uploads');
        
        // Generate thumbnails for local storage
        if (req.file.mimetype.startsWith('image/') && !req.file.mimetype.includes('svg')) {
          const thumbnailPath = path.join(uploadDir, 'thumb-' + req.file.filename);
          const mediumPath = path.join(uploadDir, 'medium-' + req.file.filename);

          try {
            // Create thumbnail (300px width)
            await sharp(req.file.path)
              .resize(300, null, { withoutEnlargement: true })
              .toFile(thumbnailPath);

            // Create medium size (800px width)
            await sharp(req.file.path)
              .resize(800, null, { withoutEnlargement: true })
              .toFile(mediumPath);
          } catch (err) {
            logger.warn('Local thumbnail generation failed:', err);
          }
        }

        mediaData = {
          filename: req.file.filename,
          original_name: req.file.originalname,
          mimetype: req.file.mimetype,
          size: req.file.size,
          path: `/uploads/${req.file.filename}`,
          url: `/uploads/${req.file.filename}`,
          thumbnail: `/uploads/thumb-${req.file.filename}`,
          medium: `/uploads/medium-${req.file.filename}`,
          storage_type: 'local'
        };
      }

      // Save to database
      const result = await db.prepare(`
        INSERT INTO media (
          filename, original_name, mimetype, size, path, 
          alt_text, caption, uploaded_by, storage_type, bucket, s3_key
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).run(
        mediaData.filename,
        mediaData.original_name,
        mediaData.mimetype,
        mediaData.size,
        mediaData.path,
        alt_text || '',
        caption || '',
        req.user.id,
        mediaData.storage_type || 'local',
        mediaData.bucket || null,
        useS3 ? req.file.key : null
      );

      logger.info(`Image uploaded${useS3 ? ' to S3' : ''}: ${mediaData.filename} by ${req.user.email}`);

      res.json({
        success: true,
        media: {
          id: result.lastInsertRowid,
          ...mediaData,
          alt_text,
          caption
        }
      });
    } catch (error) {
      logger.error('Upload error:', error);
      
      // Clean up S3 file if database save failed
      if (useS3 && req.file && req.file.key) {
        try {
          await deleteFromS3(req.file.key);
        } catch (cleanupError) {
          logger.error('Failed to cleanup S3 file:', cleanupError);
        }
      }
      
      res.status(500).json({ error: 'Failed to upload file' });
    }
  }
);

// Get presigned upload URL for direct browser upload to S3
router.post('/upload-url',
  authenticate,
  authorize('admin', 'editor'),
  async (req, res) => {
    if (!useS3) {
      return res.status(400).json({ 
        error: 'Direct upload is only available with S3 storage' 
      });
    }

    try {
      const { filename, contentType } = req.body;
      
      if (!filename || !contentType) {
        return res.status(400).json({ 
          error: 'Filename and content type are required' 
        });
      }

      const uploadData = await getUploadPresignedUrl(filename, contentType, {
        uploadedBy: req.user.id.toString(),
        uploadedByEmail: req.user.email
      });

      res.json({
        success: true,
        ...uploadData
      });
    } catch (error) {
      logger.error('Presigned URL error:', error);
      res.status(500).json({ error: 'Failed to generate upload URL' });
    }
  }
);

// Upload multiple images
router.post('/upload-multiple',
  authenticate,
  authorize('admin', 'editor'),
  upload.array('images', 10),
  async (req, res) => {
    try {
      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ error: 'No files uploaded' });
      }

      const uploadedFiles = [];

      for (const file of req.files) {
        let mediaData = {};

        if (useS3) {
          const fileUrl = await getFileUrl(file.key);
          mediaData = {
            filename: file.key,
            original_name: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: file.key,
            url: fileUrl,
            storage_type: 's3'
          };
        } else {
          // Local storage with thumbnails
          const uploadDir = path.join(__dirname, '../..', 'uploads');
          
          if (file.mimetype.startsWith('image/') && !file.mimetype.includes('svg')) {
            const thumbnailPath = path.join(uploadDir, 'thumb-' + file.filename);
            const mediumPath = path.join(uploadDir, 'medium-' + file.filename);

            try {
              await sharp(file.path)
                .resize(300, null, { withoutEnlargement: true })
                .toFile(thumbnailPath);

              await sharp(file.path)
                .resize(800, null, { withoutEnlargement: true })
                .toFile(mediumPath);
            } catch (err) {
              logger.warn('Thumbnail generation failed:', err);
            }
          }

          mediaData = {
            filename: file.filename,
            original_name: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: `/uploads/${file.filename}`,
            url: `/uploads/${file.filename}`,
            thumbnail: `/uploads/thumb-${file.filename}`,
            medium: `/uploads/medium-${file.filename}`,
            storage_type: 'local'
          };
        }

        // Save to database
        const result = await db.prepare(`
          INSERT INTO media (
            filename, original_name, mimetype, size, path, 
            uploaded_by, storage_type, s3_key
          )
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          mediaData.filename,
          mediaData.original_name,
          mediaData.mimetype,
          mediaData.size,
          mediaData.path,
          req.user.id,
          mediaData.storage_type,
          useS3 ? file.key : null
        );

        uploadedFiles.push({
          id: result.lastInsertRowid,
          ...mediaData
        });
      }

      logger.info(`${req.files.length} images uploaded by ${req.user.email}`);

      res.json({
        success: true,
        media: uploadedFiles
      });
    } catch (error) {
      logger.error('Multiple upload error:', error);
      res.status(500).json({ error: 'Failed to upload files' });
    }
  }
);

// Get all media
router.get('/',
  authenticate,
  async (req, res) => {
    try {
      const { page = 1, limit = 50, storage_type } = req.query;
      const offset = (page - 1) * limit;

      let query = `
        SELECT m.*, u.name as uploaded_by_name
        FROM media m
        LEFT JOIN users u ON m.uploaded_by = u.id
      `;

      const params = [];
      if (storage_type) {
        query += ' WHERE m.storage_type = ?';
        params.push(storage_type);
      }

      query += ' ORDER BY m.created_at DESC LIMIT ? OFFSET ?';
      params.push(parseInt(limit), offset);

      const media = await db.prepare(query).all(...params);

      // Get total count
      let countQuery = 'SELECT COUNT(*) as total FROM media';
      const countParams = [];
      if (storage_type) {
        countQuery += ' WHERE storage_type = ?';
        countParams.push(storage_type);
      }
      const { total } = await db.prepare(countQuery).get(...countParams);

      // Generate URLs for S3 files
      for (const item of media) {
        if (item.storage_type === 's3' && item.s3_key) {
          item.url = await getFileUrl(item.s3_key);
          if (item.thumbnail_key) {
            item.thumbnail = await getFileUrl(item.thumbnail_key);
          }
        } else if (item.storage_type === 'local') {
          // Local files already have URLs
          item.url = item.path;
          item.thumbnail = `/uploads/thumb-${item.filename}`;
          item.medium = `/uploads/medium-${item.filename}`;
        }
      }

      res.json({
        media,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        }
      });
    } catch (error) {
      logger.error('Get media error:', error);
      res.status(500).json({ error: 'Failed to fetch media' });
    }
  }
);

// Delete media
router.delete('/:id',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      const { id } = req.params;
      
      const media = await db.prepare('SELECT * FROM media WHERE id = ?').get(id);
      
      if (!media) {
        return res.status(404).json({ error: 'Media not found' });
      }

      // Delete from storage
      if (media.storage_type === 's3' && media.s3_key) {
        // Delete from S3
        try {
          await deleteFromS3(media.s3_key);
          if (media.thumbnail_key) {
            await deleteFromS3(media.thumbnail_key);
          }
        } catch (err) {
          logger.error('S3 deletion error:', err);
        }
      } else {
        // Delete local files
        const uploadDir = path.join(__dirname, '../..', 'uploads');
        const filePath = path.join(uploadDir, media.filename);
        const thumbPath = path.join(uploadDir, 'thumb-' + media.filename);
        const mediumPath = path.join(uploadDir, 'medium-' + media.filename);

        try {
          await fs.unlink(filePath);
          await fs.unlink(thumbPath);
          await fs.unlink(mediumPath);
        } catch (err) {
          logger.warn('Local file deletion error:', err);
        }
      }

      // Delete from database
      await db.prepare('DELETE FROM media WHERE id = ?').run(id);

      logger.info(`Media deleted: ${media.filename} by ${req.user.email}`);

      res.json({ success: true, message: 'Media deleted successfully' });
    } catch (error) {
      logger.error('Delete media error:', error);
      res.status(500).json({ error: 'Failed to delete media' });
    }
  }
);

// Migrate local files to S3
router.post('/migrate-to-s3',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    if (!useS3) {
      return res.status(400).json({ 
        error: 'S3 storage is not enabled. Set USE_S3=true in .env' 
      });
    }

    try {
      // Get all local media files
      const localMedia = await db.prepare(
        'SELECT * FROM media WHERE storage_type = ? OR storage_type IS NULL'
      ).all('local');

      const migrated = [];
      const failed = [];

      for (const media of localMedia) {
        try {
          const localPath = path.join(__dirname, '../..', 'uploads', media.filename);
          
          // Check if file exists
          await fs.access(localPath);
          
          // Read file
          const fileBuffer = await fs.readFile(localPath);
          
          // Upload to S3
          const s3Result = await uploadToS3({
            buffer: fileBuffer,
            originalname: media.original_name || media.filename,
            mimetype: media.mimetype
          }, {
            folder: 'migrated',
            optimize: false // Keep original
          });

          // Update database
          await db.prepare(`
            UPDATE media 
            SET storage_type = ?, s3_key = ?, bucket = ?, path = ?
            WHERE id = ?
          `).run('s3', s3Result.key, s3Result.bucket, s3Result.key, media.id);

          migrated.push({
            id: media.id,
            filename: media.filename,
            s3_key: s3Result.key
          });

          logger.info(`Migrated to S3: ${media.filename}`);
        } catch (error) {
          logger.error(`Failed to migrate ${media.filename}:`, error);
          failed.push({
            id: media.id,
            filename: media.filename,
            error: error.message
          });
        }
      }

      res.json({
        success: true,
        migrated: migrated.length,
        failed: failed.length,
        details: {
          migrated,
          failed
        }
      });
    } catch (error) {
      logger.error('Migration error:', error);
      res.status(500).json({ error: 'Migration failed' });
    }
  }
);

export default router;