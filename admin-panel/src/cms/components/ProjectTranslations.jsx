import React, { useState, useEffect } from 'react';
import { API_BASE_URL, BACKEND_URL } from "../../config/api";
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Icon from 'components/AppIcon';
import axios from 'axios';

const ProjectTranslations = ({ project, onClose, onSave }) => {
  const { t } = useTranslation();
  const [translations, setTranslations] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeLanguage, setActiveLanguage] = useState('en');
  const [message, setMessage] = useState(null);

  const languages = [
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  useEffect(() => {
    fetchTranslations();
  }, [project]);

  const fetchTranslations = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${API_BASE_URL}/project-translations/project/${project.id}`,
        { 
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        }
      );

      // Convert array to object keyed by language
      const translationMap = {};
      response.data.forEach(trans => {
        translationMap[trans.language] = trans;
      });

      // Initialize missing languages with project defaults
      languages.forEach(lang => {
        if (!translationMap[lang.code]) {
          translationMap[lang.code] = {
            title: lang.code === 'de' ? project.title : '',
            description: lang.code === 'de' ? project.description : '',
            location: project.location || '',
            area: project.area || '',
            details: project.details || {}
          };
        }
      });

      setTranslations(translationMap);
    } catch (error) {
      console.error('Error fetching translations:', error);
      setMessage({ type: 'error', text: 'Failed to load translations' });
    } finally {
      setLoading(false);
    }
  };

  const handleTranslationChange = (language, field, value) => {
    setTranslations(prev => ({
      ...prev,
      [language]: {
        ...prev[language],
        [field]: value
      }
    }));
  };

  const saveTranslation = async (language) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      const translationData = translations[language];

      await axios.post(
        `${API_BASE_URL}/project-translations/project/${project.id}/${language}`,
        translationData,
        { 
          headers: token ? { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } : { 'Content-Type': 'application/json' }
        }
      );

      setMessage({ type: 'success', text: `${language.toUpperCase()} translation saved successfully` });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving translation:', error);
      setMessage({ type: 'error', text: 'Failed to save translation' });
    } finally {
      setSaving(false);
    }
  };

  const saveAllTranslations = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      for (const lang of languages) {
        if (lang.code === 'de') continue; // Skip German as it's the default
        
        const translationData = translations[lang.code];
        if (translationData && translationData.title) {
          await axios.post(
            `${API_BASE_URL}/project-translations/project/${project.id}/${lang.code}`,
            translationData,
            { 
              headers: token ? { 
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
              } : { 'Content-Type': 'application/json' }
            }
          );
        }
      }

      setMessage({ type: 'success', text: 'All translations saved successfully' });
      setTimeout(() => {
        setMessage(null);
        if (onSave) onSave();
      }, 2000);
    } catch (error) {
      console.error('Error saving translations:', error);
      setMessage({ type: 'error', text: 'Failed to save some translations' });
    } finally {
      setSaving(false);
    }
  };

  const autoTranslate = async (targetLanguage) => {
    try {
      setSaving(true);
      const token = localStorage.getItem('token');
      
      // For now, create placeholder translations
      // In production, this would call a translation API
      const response = await axios.post(
        `${API_BASE_URL}/project-translations/bulk-translate/${project.id}`,
        { targetLanguages: [targetLanguage] },
        { 
          headers: token ? { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          } : { 'Content-Type': 'application/json' }
        }
      );

      setMessage({ type: 'info', text: response.data.note });
      fetchTranslations(); // Reload translations
    } catch (error) {
      console.error('Error auto-translating:', error);
      setMessage({ type: 'error', text: 'Failed to auto-translate' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-8">
          <div className="flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span>Loading translations...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            Translations for: {project.title}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Message */}
        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`mx-6 mt-4 p-3 rounded-lg ${
                message.type === 'success' ? 'bg-green-100 text-green-800' :
                message.type === 'error' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}
            >
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Language Tabs */}
        <div className="px-6 py-3 border-b flex space-x-1 overflow-x-auto">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setActiveLanguage(lang.code)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                activeLanguage === lang.code
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              <span>{lang.flag}</span>
              <span>{lang.name}</span>
              {lang.code === 'de' && (
                <span className="text-xs opacity-75">(Original)</span>
              )}
            </button>
          ))}
        </div>

        {/* Translation Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                value={translations[activeLanguage]?.title || ''}
                onChange={(e) => handleTranslationChange(activeLanguage, 'title', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter ${languages.find(l => l.code === activeLanguage)?.name} title`}
                disabled={activeLanguage === 'de'}
              />
              {activeLanguage === 'de' && (
                <p className="mt-1 text-sm text-gray-500">
                  This is the original German content. Edit from the project details instead.
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={translations[activeLanguage]?.description || ''}
                onChange={(e) => handleTranslationChange(activeLanguage, 'description', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={4}
                placeholder={`Enter ${languages.find(l => l.code === activeLanguage)?.name} description`}
                disabled={activeLanguage === 'de'}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                value={translations[activeLanguage]?.location || ''}
                onChange={(e) => handleTranslationChange(activeLanguage, 'location', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter ${languages.find(l => l.code === activeLanguage)?.name} location`}
                disabled={activeLanguage === 'de'}
              />
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Area
              </label>
              <input
                type="text"
                value={translations[activeLanguage]?.area || ''}
                onChange={(e) => handleTranslationChange(activeLanguage, 'area', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder={`Enter ${languages.find(l => l.code === activeLanguage)?.name} area`}
                disabled={activeLanguage === 'de'}
              />
            </div>

          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => saveTranslation(activeLanguage)}
              disabled={saving || activeLanguage === 'de'}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Save {languages.find(l => l.code === activeLanguage)?.name}
            </button>
            <button
              onClick={saveAllTranslations}
              disabled={saving}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              Save All Translations
            </button>
            {activeLanguage !== 'de' && (
              <button
                onClick={() => autoTranslate(activeLanguage)}
                disabled={saving}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center space-x-2"
                title="Create placeholder translation text"
              >
                <Icon name="Globe" size={16} />
                <span>Auto-Translate</span>
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectTranslations;
