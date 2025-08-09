import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useEditMode } from '../contexts/EditModeContext';
import useCMSStore from '../store/cmsStore';
import { 
  translateContent, 
  translateContentObject, 
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
  
  const stats = getTranslationStats();
  
  // Get all content keys for current language
  const contentKeys = Object.keys(content[currentLanguage] || {});
  
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
          const sourceText = content[selectedSourceLang]?.[key] || '';
          
          if (sourceText) {
            const translatedText = await translateContent(
              sourceText,
              selectedSourceLang,
              targetLang,
              { useDeepSeek: translationMode === 'auto' && stats.hasDeepSeekKey }
            );
            
            langResults.translations.push({
              key,
              original: sourceText,
              translated: translatedText,
              status: 'success'
            });
            
            // Auto-apply if in auto mode
            if (translationMode === 'auto') {
              setContent(key, translatedText, targetLang);
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
                <h2 className="text-2xl font-heading font-light text-primary">
                  Translation Manager
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-lg"
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
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Source Language
                  </label>
                  <select
                    value={selectedSourceLang}
                    onChange={(e) => setSelectedSourceLang(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                    Target Languages
                  </label>
                  <div className="space-y-2">
                    {languages.filter(l => l.code !== selectedSourceLang).map(lang => (
                      <label key={lang.code} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={selectedTargetLangs.includes(lang.code)}
                          onChange={() => toggleTargetLanguage(lang.code)}
                          className="mr-2"
                        />
                        <span>{lang.flag} {lang.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Content Selection */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">
                    Content to Translate
                  </label>
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
                      {contentKeys.map(key => (
                        <label key={key} className="flex items-start">
                          <input
                            type="checkbox"
                            checked={selectedContent[key] || false}
                            onChange={() => toggleContentKey(key)}
                            className="mr-2 mt-1"
                          />
                          <div>
                            <span className="font-medium text-sm">{key}</span>
                            <p className="text-xs text-gray-500 truncate">
                              {content[selectedSourceLang]?.[key]?.substring(0, 100)}...
                            </p>
                          </div>
                        </label>
                      ))}
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
              <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Translation Service Status</h3>
                <div className="space-y-1 text-sm">
                  <p>Cache Size: {stats.cacheSize} translations</p>
                  <p>Cache Enabled: {stats.cacheEnabled ? 'Yes' : 'No'}</p>
                  <p>DeepSeek API: {stats.hasDeepSeekKey ? 'Configured' : 'Not configured (using mock)'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TranslationManager;