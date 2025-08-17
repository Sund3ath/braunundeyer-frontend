import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEditMode } from '../contexts/EditModeContext';
import useCMSStore from '../store/cmsStore';
import { 
  translateContent, 
  translateContentObject,
  translateHomepageContent,
  detectLanguage,
  getTranslationStats 
} from '../../services/translationService';
import Icon from 'components/AppIcon';
import { languages } from '../../i18n/config';

const TranslationManager = ({ isOpen, onClose }) => {
  const { t } = useTranslation();
  const { markAsChanged } = useEditMode();
  const { 
    content, 
    setContent, 
    currentLanguage,
    projects,
    updateProject 
  } = useCMSStore();
  
  const [selectedSourceLang, setSelectedSourceLang] = useState('de');
  const [selectedTargetLangs, setSelectedTargetLangs] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationProgress, setTranslationProgress] = useState(0);
  const [translationResults, setTranslationResults] = useState([]);
  const [selectedContent, setSelectedContent] = useState({});
  const [translationMode, setTranslationMode] = useState('auto'); // auto, manual, review
  
  const stats = getTranslationStats((content && content[currentLanguage]) || {});
  
  // Get all content keys for current language
  const contentKeys = Object.keys((content && content[currentLanguage]) || {});
  
  // Handle language selection
  const toggleTargetLanguage = (lang) => {
    if (selectedTargetLangs.includes(lang)) {
      setSelectedTargetLangs(selectedTargetLangs.filter(l => l !== lang));
    } else {
      setSelectedTargetLangs([...selectedTargetLangs, lang]);
    }
  };
  
  // Handle content selection
  const toggleContentKey = (key) => {
    setSelectedContent({
      ...selectedContent,
      [key]: !selectedContent[key]
    });
  };
  
  // Select all content
  const selectAllContent = () => {
    const allSelected = {};
    contentKeys.forEach(key => {
      allSelected[key] = true;
    });
    setSelectedContent(allSelected);
  };
  
  // Clear selection
  const clearSelection = () => {
    setSelectedContent({});
  };
  
  // Perform translation
  const handleTranslate = async () => {
    if (selectedTargetLangs.length === 0) {
      alert('Please select at least one target language');
      return;
    }
    
    const keysToTranslate = Object.keys(selectedContent).filter(key => selectedContent[key]);
    if (keysToTranslate.length === 0) {
      alert('Please select content to translate');
      return;
    }
    
    setIsTranslating(true);
    setTranslationProgress(0);
    setTranslationResults([]);
    
    const results = [];
    const totalTranslations = selectedTargetLangs.length * keysToTranslate.length;
    let completed = 0;
    
    try {
      for (const targetLang of selectedTargetLangs) {
        const langResults = {
          language: targetLang,
          translations: []
        };
        
        for (const key of keysToTranslate) {
          const sourceContent = content[selectedSourceLang]?.[key];
          
          if (sourceContent) {
            let translatedContent;
            let original = sourceContent;
            
            // Special handling for homepage content
            if (key === 'homepage' && typeof sourceContent === 'object') {
              translatedContent = await translateHomepageContent(
                sourceContent,
                targetLang,
                selectedSourceLang
              );
              original = JSON.stringify(sourceContent, null, 2);
            } 
            // Handle other objects
            else if (typeof sourceContent === 'object') {
              translatedContent = await translateContentObject(
                sourceContent,
                targetLang,
                selectedSourceLang
              );
              original = JSON.stringify(sourceContent, null, 2);
            }
            // Handle strings
            else if (typeof sourceContent === 'string') {
              translatedContent = await translateContent(
                sourceContent,
                targetLang,
                selectedSourceLang
              );
            } else {
              translatedContent = sourceContent;
            }
            
            langResults.translations.push({
              key,
              original: original,
              translated: typeof translatedContent === 'object' 
                ? JSON.stringify(translatedContent, null, 2) 
                : translatedContent,
              status: 'success',
              isObject: typeof sourceContent === 'object'
            });
            
            // Auto-apply if in auto mode
            if (translationMode === 'auto') {
              setContent(key, translatedContent, targetLang);
            }
          }
          
          completed++;
          setTranslationProgress(Math.round((completed / totalTranslations) * 100));
        }
        
        results.push(langResults);
      }
      
      setTranslationResults(results);
      
      if (translationMode === 'auto') {
        markAsChanged();
        alert('Translations applied successfully!');
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('Error during translation. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };
  
  // Apply reviewed translations
  const applyTranslations = () => {
    translationResults.forEach(langResult => {
      langResult.translations.forEach(trans => {
        if (trans.approved) {
          setContent(trans.key, trans.translated, langResult.language);
        }
      });
    });
    
    markAsChanged();
    alert('Approved translations applied successfully!');
    onClose();
  };
  
  // Update translation
  const updateTranslation = (langIndex, transIndex, newValue) => {
    const newResults = [...translationResults];
    newResults[langIndex].translations[transIndex].translated = newValue;
    newResults[langIndex].translations[transIndex].edited = true;
    setTranslationResults(newResults);
  };
  
  // Toggle approval
  const toggleApproval = (langIndex, transIndex) => {
    const newResults = [...translationResults];
    newResults[langIndex].translations[transIndex].approved = 
      !newResults[langIndex].translations[transIndex].approved;
    setTranslationResults(newResults);
  };
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[9996]"
          />
          
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed right-0 top-0 h-full w-full max-w-4xl bg-white shadow-2xl z-[9997] overflow-y-auto"
          >
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-heading font-light text-primary">
                    Translation Manager
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Automatically translate your content to multiple languages with AI-powered grammar and spelling correction
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                  title="Close Translation Manager"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>
              
              {/* Translation Mode */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Translation Mode
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="auto"
                      checked={translationMode === 'auto'}
                      onChange={(e) => setTranslationMode(e.target.value)}
                      className="mr-2"
                    />
                    <span>Auto-translate & Apply</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      value="review"
                      checked={translationMode === 'review'}
                      onChange={(e) => setTranslationMode(e.target.value)}
                      className="mr-2"
                    />
                    <span>Translate & Review</span>
                  </label>
                </div>
              </div>
              
              {/* Language Selection */}
              <div className="grid grid-cols-2 gap-6 mb-6 bg-gray-50 p-4 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Translate FROM
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Select the original language of your content
                  </p>
                  <select
                    value={selectedSourceLang}
                    onChange={(e) => setSelectedSourceLang(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    {languages.map(lang => (
                      <option key={lang.code} value={lang.code}>
                        {lang.flag} {lang.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Translate TO
                  </label>
                  <p className="text-xs text-gray-500 mb-2">
                    Select all languages you want to translate into
                  </p>
                  <div className="space-y-2 bg-white p-3 rounded-lg border border-gray-200">
                    {languages.filter(l => l.code !== selectedSourceLang).map(lang => (
                      <label key={lang.code} className="flex items-center hover:bg-gray-50 p-1 rounded cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedTargetLangs.includes(lang.code)}
                          onChange={() => toggleTargetLanguage(lang.code)}
                          className="mr-3"
                        />
                        <span className="text-sm">{lang.flag} {lang.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Content Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Select Content to Translate
                    </label>
                    <p className="text-xs text-gray-500 mt-1">
                      Choose which sections you want to translate to other languages
                    </p>
                  </div>
                  <div className="space-x-2">
                    <button
                      onClick={selectAllContent}
                      className="text-sm text-blue-600 hover:text-blue-700"
                    >
                      Select All
                    </button>
                    <button
                      onClick={clearSelection}
                      className="text-sm text-gray-600 hover:text-gray-700"
                    >
                      Clear
                    </button>
                  </div>
                </div>
                
                <div className="border border-gray-300 rounded-lg max-h-48 overflow-y-auto p-3">
                  {contentKeys.length === 0 ? (
                    <p className="text-gray-500 text-sm">No content available for translation</p>
                  ) : (
                    <div className="space-y-2">
                      {contentKeys.map(key => {
                        // Create user-friendly labels
                        const getFriendlyName = (key) => {
                          const labels = {
                            'about_content': 'About Us - Main Text',
                            'about_subtitle': 'About Us - Subtitle',
                            'about_image1': 'About Us - Image 1 (URL)',
                            'about_image2': 'About Us - Image 2 (URL)',
                            'homepage': 'Homepage Content (Hero & Projects)',
                            'services': 'Services Page Content',
                            'contact': 'Contact Page Content',
                            'projects': 'Projects Information',
                            'footer': 'Footer Text',
                            'navigation': 'Navigation Menu',
                          };
                          return labels[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                        };
                        
                        const value = content[selectedSourceLang]?.[key];
                        const isImage = key.includes('image') || key.includes('logo') || key.includes('img');
                        
                        return (
                          <label key={key} className="flex items-start hover:bg-gray-50 p-2 rounded">
                            <input
                              type="checkbox"
                              checked={selectedContent[key] || false}
                              onChange={() => toggleContentKey(key)}
                              className="mr-3 mt-1"
                              disabled={isImage} // Disable selection for image URLs
                            />
                            <div className="flex-1">
                              <span className="font-medium text-sm text-gray-800">
                                {getFriendlyName(key)}
                              </span>
                              {isImage && (
                                <span className="ml-2 text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded">
                                  Image URL - No translation needed
                                </span>
                              )}
                              <p className="text-xs text-gray-500 mt-1">
                                {(() => {
                                  if (isImage) {
                                    return `URL: ${value || 'Not set'}`;
                                  }
                                  if (typeof value === 'string') {
                                    return value.substring(0, 100) + (value.length > 100 ? '...' : '');
                                  } else if (typeof value === 'object') {
                                    if (key === 'homepage') {
                                      return 'Contains hero slides and featured projects';
                                    }
                                    return `Complex content with multiple fields`;
                                  }
                                  return 'Empty';
                                })()}
                              </p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Translation Button */}
              {!isTranslating && translationResults.length === 0 && (
                <button
                  onClick={handleTranslate}
                  disabled={selectedTargetLangs.length === 0 || Object.keys(selectedContent).filter(k => selectedContent[k]).length === 0}
                  className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  <Icon name="Languages" size={20} className="inline mr-2" />
                  Start Translation
                </button>
              )}
              
              {/* Translation Progress */}
              {isTranslating && (
                <div className="text-center py-8">
                  <Icon name="Loader2" size={32} className="animate-spin mx-auto mb-4 text-blue-600" />
                  <p className="text-lg mb-2">Translating content...</p>
                  <div className="w-full max-w-md mx-auto">
                    <div className="bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${translationProgress}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{translationProgress}% complete</p>
                  </div>
                </div>
              )}
              
              {/* Translation Results (Review Mode) */}
              {translationMode === 'review' && translationResults.length > 0 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Review Translations</h3>
                  
                  {translationResults.map((langResult, langIndex) => (
                    <div key={langResult.language} className="border border-gray-300 rounded-lg p-4">
                      <h4 className="font-medium mb-3">
                        {languages.find(l => l.code === langResult.language)?.flag} {' '}
                        {languages.find(l => l.code === langResult.language)?.name}
                      </h4>
                      
                      <div className="space-y-3">
                        {langResult.translations.map((trans, transIndex) => (
                          <div key={trans.key} className="border-b border-gray-200 pb-3 last:border-0">
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-medium text-sm">{trans.key}</span>
                              <input
                                type="checkbox"
                                checked={trans.approved || false}
                                onChange={() => toggleApproval(langIndex, transIndex)}
                                className="mt-1"
                              />
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Original</p>
                                <p className="text-sm">{trans.original}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">
                                  Translation {trans.edited && <span className="text-blue-600">(edited)</span>}
                                </p>
                                <textarea
                                  value={trans.translated}
                                  onChange={(e) => updateTranslation(langIndex, transIndex, e.target.value)}
                                  className="w-full text-sm border border-gray-300 rounded p-2"
                                  rows={2}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <button
                    onClick={applyTranslations}
                    className="w-full py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium"
                  >
                    Apply Approved Translations
                  </button>
                </div>
              )}
              
              {/* Stats */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-medium text-blue-900 mb-2">
                  <Icon name="Info" size={16} className="inline mr-1" />
                  Translation Service Information
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32">Service Status:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      stats.hasDeepSeekKey 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {stats.hasDeepSeekKey ? '✓ AI Translation Active' : 'Demo Mode (Mock Data)'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32">Cached Translations:</span>
                    <span className="text-gray-800">{stats.cacheSize || 0} saved</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32">Quality Features:</span>
                    <span className="text-gray-800">✓ Grammar Check ✓ Spelling Correction</span>
                  </div>
                </div>
                {!stats.hasDeepSeekKey && (
                  <p className="text-xs text-yellow-700 mt-3 p-2 bg-yellow-50 rounded">
                    <strong>Note:</strong> Currently using demo translations. Configure DeepSeek API for professional AI translations.
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TranslationManager;