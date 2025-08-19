import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { useEditMode } from '../contexts/EditModeContext';
import useCMSStore from '../store/cmsStore';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';

const EditableImage = ({
  contentKey,
  defaultSrc = '/assets/images/no_image.png',
  alt = '',
  className = '',
  containerClassName = '',
  width,
  height,
  objectFit = 'cover',
  ...props
}) => {
  const { isEditMode, markAsChanged } = useEditMode();
  const { content, currentLanguage, setContent, uploadMedia } = useCMSStore();
  
  const [isUploading, setIsUploading] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Get image from store or use default
  const storedImage = content[currentLanguage]?.[contentKey];
  const imageSrc = storedImage?.url || storedImage || defaultSrc;
  const imageAlt = storedImage?.alt || alt;
  
  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    
    // Validate file
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      alert('File size must be less than 10MB');
      return;
    }
    
    setIsUploading(true);
    setUploadProgress(0);
    
    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);
      
      // Upload media
      const media = await uploadMedia(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      // Save to content store
      setContent(contentKey, {
        url: media.url,
        alt: imageAlt,
        id: media.id,
        name: media.name
      });
      
      markAsChanged();
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setShowOverlay(false);
      }, 500);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Failed to upload image');
      setIsUploading(false);
      setUploadProgress(0);
    }
  }, [contentKey, imageAlt, setContent, uploadMedia, markAsChanged]);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg']
    },
    multiple: false,
    disabled: !isEditMode || isUploading
  });
  
  const handleRemoveImage = () => {
    if (window.confirm('Are you sure you want to remove this image?')) {
      setContent(contentKey, null);
      markAsChanged();
      setShowOverlay(false);
    }
  };
  
  const handleEditAlt = () => {
    const newAlt = prompt('Enter image description (for SEO and accessibility):', imageAlt);
    if (newAlt !== null && newAlt !== imageAlt) {
      setContent(contentKey, {
        url: imageSrc,
        alt: newAlt
      });
      markAsChanged();
    }
  };
  
  if (!isEditMode) {
    return (
      <div className={containerClassName}>
        <Image
          src={imageSrc}
          alt={imageAlt}
          className={className}
          width={width}
          height={height}
          style={{ objectFit }}
          {...props}
        />
      </div>
    );
  }
  
  return (
    <div
      className={`relative group ${containerClassName}`}
      onMouseEnter={() => setShowOverlay(true)}
      onMouseLeave={() => !isDragActive && !isUploading && setShowOverlay(false)}
    >
      <div {...getRootProps()} className="relative">
        <input {...getInputProps()} />
        
        <Image
          src={imageSrc}
          alt={imageAlt}
          className={`${className} ${isDragActive ? 'opacity-50' : ''}`}
          width={width}
          height={height}
          style={{ objectFit }}
          {...props}
        />
        
        {/* Edit Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs z-10"
        >
          <Icon name="Image" size={12} />
        </motion.div>
        
        {/* Overlay */}
        <AnimatePresence>
          {(showOverlay || isDragActive || isUploading) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/70 flex items-center justify-center rounded-lg"
            >
              {isUploading ? (
                <div className="text-white text-center">
                  <Icon name="Loader2" size={32} className="animate-spin mb-2" />
                  <p className="text-sm">Uploading... {uploadProgress}%</p>
                  <div className="w-32 h-2 bg-gray-700 rounded-full mt-2">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              ) : isDragActive ? (
                <div className="text-white text-center">
                  <Icon name="Upload" size={32} className="mb-2" />
                  <p>Drop image here</p>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-4">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      title="Upload new image"
                    >
                      <Icon name="Upload" size={20} />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditAlt();
                      }}
                      className="p-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                      title="Edit alt text"
                    >
                      <Icon name="Type" size={20} />
                    </button>
                    {imageSrc !== defaultSrc && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveImage();
                        }}
                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        title="Remove image"
                      >
                        <Icon name="Trash2" size={20} />
                      </button>
                    )}
                  </div>
                  <p className="text-white text-xs">Click or drag to upload</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default EditableImage;
