import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import useCMSStore from '../store/cmsStore';
import { useEditMode } from '../contexts/EditModeContext';
import Icon from 'components/AppIcon';
import { mediaAPI, contentAPI } from '../../services/api';

const ContentEditor = () => {
  const { t, i18n } = useTranslation();
  const { isEditMode } = useEditMode();
  const { content, setContent, uploadMedia, media } = useCMSStore();
  const [activeSection, setActiveSection] = useState('about');
  const [loading, setLoading] = useState(false);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [selectedField, setSelectedField] = useState(null);
  
  const currentLang = i18n.language || 'de';
  
  // Content sections structure
  const contentSections = {
    about: {
      title: 'About Section',
      icon: 'Info',
      fields: [
        { key: 'about_title', label: 'Section Title', type: 'text' },
        { key: 'about_subtitle', label: 'Subtitle', type: 'text' },
        { key: 'about_content', label: 'Main Content', type: 'richtext' },
        { key: 'about_image1', label: 'Image 1', type: 'image' },
        { key: 'about_image2', label: 'Image 2', type: 'image' },
        { key: 'about_stats1_number', label: 'Stat 1 Number', type: 'text' },
        { key: 'about_stats1_label', label: 'Stat 1 Label', type: 'text' },
        { key: 'about_stats2_number', label: 'Stat 2 Number', type: 'text' },
        { key: 'about_stats2_label', label: 'Stat 2 Label', type: 'text' }
      ]
    },
    services: {
      title: 'Services Section',
      icon: 'Briefcase',
      fields: [
        { key: 'services_title', label: 'Section Title', type: 'text' },
        { key: 'services_subtitle', label: 'Subtitle', type: 'text' },
        { key: 'service1_title', label: 'Service 1 Title', type: 'text' },
        { key: 'service1_description', label: 'Service 1 Description', type: 'textarea' },
        { key: 'service1_icon', label: 'Service 1 Icon', type: 'icon' },
        { key: 'service2_title', label: 'Service 2 Title', type: 'text' },
        { key: 'service2_description', label: 'Service 2 Description', type: 'textarea' },
        { key: 'service2_icon', label: 'Service 2 Icon', type: 'icon' },
        { key: 'service3_title', label: 'Service 3 Title', type: 'text' },
        { key: 'service3_description', label: 'Service 3 Description', type: 'textarea' },
        { key: 'service3_icon', label: 'Service 3 Icon', type: 'icon' }
      ]
    },
    contact: {
      title: 'Contact Section',
      icon: 'Mail',
      fields: [
        { key: 'contact_title', label: 'Section Title', type: 'text' },
        { key: 'contact_subtitle', label: 'Subtitle', type: 'text' },
        { key: 'contact_address', label: 'Address', type: 'textarea' },
        { key: 'contact_phone', label: 'Phone', type: 'text' },
        { key: 'contact_email', label: 'Email', type: 'text' },
        { key: 'contact_hours', label: 'Business Hours', type: 'textarea' },
        { key: 'contact_map_embed', label: 'Map Embed Code', type: 'textarea' }
      ]
    },
    footer: {
      title: 'Footer',
      icon: 'Navigation',
      fields: [
        { key: 'footer_copyright', label: 'Copyright Text', type: 'text' },
        { key: 'footer_description', label: 'Company Description', type: 'textarea' },
        { key: 'social_facebook', label: 'Facebook URL', type: 'text' },
        { key: 'social_instagram', label: 'Instagram URL', type: 'text' },
        { key: 'social_linkedin', label: 'LinkedIn URL', type: 'text' },
        { key: 'social_twitter', label: 'Twitter URL', type: 'text' }
      ]
    }
  };
  
  const getContentValue = (key) => {
    return content[currentLang]?.[key] || '';
  };
  
  const handleContentChange = async (key, value) => {
    setContent(key, value, currentLang);
    
    // Auto-save to API
    try {
      await contentAPI.update(key, value, currentLang);
    } catch (error) {
      console.error('Failed to save content:', error);
    }
  };
  
  const handleImageSelect = (imageUrl) => {
    if (selectedField) {
      handleContentChange(selectedField, imageUrl);
      setSelectedField(null);
      setShowMediaLibrary(false);
    }
  };
  
  const handleImageUpload = async (e, fieldKey) => {
    const file = e.target.files[0];
    if (file) {
      setLoading(true);
      try {
        const uploadedMedia = await uploadMedia(file);
        handleContentChange(fieldKey, uploadedMedia.url);
      } catch (error) {
        console.error('Failed to upload image:', error);
      }
      setLoading(false);
    }
  };
  
  const renderField = (field) => {
    const value = getContentValue(field.key);
    
    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleContentChange(field.key, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            disabled={!isEditMode}
          />
        );
        
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleContentChange(field.key, e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[100px]"
            placeholder={`Enter ${field.label.toLowerCase()}`}
            disabled={!isEditMode}
          />
        );
        
      case 'richtext':
        return (
          <div className="border border-gray-300 rounded-lg p-2">
            <div className="flex items-center space-x-2 border-b pb-2 mb-2">
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => document.execCommand('bold')}
                disabled={!isEditMode}
              >
                <Icon name="Bold" size={16} />
              </button>
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => document.execCommand('italic')}
                disabled={!isEditMode}
              >
                <Icon name="Italic" size={16} />
              </button>
              <button
                className="p-1 hover:bg-gray-100 rounded"
                onClick={() => document.execCommand('underline')}
                disabled={!isEditMode}
              >
                <Icon name="Underline" size={16} />
              </button>
            </div>
            <div
              contentEditable={isEditMode}
              className="min-h-[150px] p-2 focus:outline-none"
              dangerouslySetInnerHTML={{ __html: value }}
              onBlur={(e) => handleContentChange(field.key, e.target.innerHTML)}
            />
          </div>
        );
        
      case 'image':
        return (
          <div className="space-y-2">
            {value && (
              <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={value}
                  alt={field.label}
                  className="w-full h-full object-cover"
                />
                {isEditMode && (
                  <button
                    onClick={() => handleContentChange(field.key, '')}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    <Icon name="X" size={16} />
                  </button>
                )}
              </div>
            )}
            {isEditMode && (
              <div className="flex space-x-2">
                <label className="flex-1">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, field.key)}
                    className="hidden"
                  />
                  <div className="w-full px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 cursor-pointer">
                    <Icon name="Upload" size={16} className="inline mr-2" />
                    Upload Image
                  </div>
                </label>
                <button
                  onClick={() => {
                    setSelectedField(field.key);
                    setShowMediaLibrary(true);
                  }}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <Icon name="Image" size={16} className="inline mr-2" />
                  Media Library
                </button>
              </div>
            )}
          </div>
        );
        
      case 'icon':
        const icons = ['Home', 'Users', 'Settings', 'Building', 'PenTool', 'Layers'];
        return (
          <div className="grid grid-cols-6 gap-2">
            {icons.map(iconName => (
              <button
                key={iconName}
                onClick={() => handleContentChange(field.key, iconName)}
                className={`p-3 border rounded-lg hover:bg-gray-50 ${
                  value === iconName ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                disabled={!isEditMode}
              >
                <Icon name={iconName} size={20} />
              </button>
            ))}
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-light text-primary">
          Content Management
        </h2>
        {!isEditMode && (
          <div className="px-4 py-2 bg-yellow-100 text-yellow-800 rounded-lg">
            <Icon name="AlertCircle" size={16} className="inline mr-2" />
            Switch to Edit Mode to modify content
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-12 gap-6">
        {/* Section Navigation */}
        <div className="col-span-3">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h3 className="font-medium text-gray-700 mb-4">Sections</h3>
            <nav className="space-y-2">
              {Object.entries(contentSections).map(([key, section]) => (
                <button
                  key={key}
                  onClick={() => setActiveSection(key)}
                  className={`w-full text-left px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                    activeSection === key
                      ? 'bg-blue-600 text-white'
                      : 'hover:bg-gray-100 text-gray-700'
                  }`}
                >
                  <Icon name={section.icon} size={20} />
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>
        
        {/* Content Fields */}
        <div className="col-span-9">
          <div className="bg-white rounded-lg shadow-md p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <h3 className="text-xl font-medium mb-6">
                  {contentSections[activeSection].title}
                </h3>
                
                <div className="space-y-6">
                  {contentSections[activeSection].fields.map(field => (
                    <div key={field.key}>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        {field.label}
                      </label>
                      {renderField(field)}
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Media Library Modal */}
      <AnimatePresence>
        {showMediaLibrary && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowMediaLibrary(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-lg shadow-xl z-50 max-h-[80vh] overflow-hidden"
            >
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-medium">Media Library</h3>
                <button
                  onClick={() => setShowMediaLibrary(false)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>
              
              <div className="p-4 overflow-y-auto max-h-[60vh]">
                <div className="grid grid-cols-4 gap-4">
                  {media.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleImageSelect(item.url)}
                      className="relative group overflow-hidden rounded-lg border-2 border-gray-200 hover:border-blue-500 transition-colors"
                    >
                      <img
                        src={item.url}
                        alt={item.name}
                        className="w-full h-32 object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Icon name="Check" size={24} className="text-white" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      {loading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4">
            <Icon name="Loader2" size={24} className="animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
