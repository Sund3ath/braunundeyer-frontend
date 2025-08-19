import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useEditMode } from '../contexts/EditModeContext';
import useCMSStore from '../store/cmsStore';
import Icon from 'components/AppIcon';
import { languages } from '../../i18n/config';

const AdminToolbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    isEditMode,
    isAuthenticated,
    user,
    unsavedChanges,
    savingStatus,
    toggleEditMode,
    saveChanges,
    logout
  } = useEditMode();
  
  const {
    currentLanguage,
    setCurrentLanguage,
    undo,
    redo,
    historyIndex,
    editHistory,
    saveAll
  } = useCMSStore();
  
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  if (!isAuthenticated) return null;

  const handleSave = async () => {
    const result = await saveAll();
    if (result.success) {
      await saveChanges({});
    }
  };

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    i18n.changeLanguage(langCode);
    setShowLanguageMenu(false);
    
    // Update URL with language prefix
    const currentPath = window.location.pathname;
    const pathWithoutLang = currentPath.replace(/^\/(de|en|fr|it|es)/, '');
    window.history.pushState({}, '', `/${langCode}${pathWithoutLang}`);
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-[10000] bg-gray-900 text-white shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-accent rounded flex items-center justify-center">
                <Icon name="Settings" size={20} />
              </div>
              <span className="font-medium">CMS</span>
            </div>
            
            {/* Admin Dashboard Button */}
            {!location.pathname.includes('/admin') && (
              <button
                onClick={() => {
                  const lang = location.pathname.split('/')[1] || 'de';
                  navigate(`/${lang}/admin`);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all"
              >
                <Icon name="LayoutDashboard" size={16} className="inline mr-2" />
                Admin Dashboard
              </button>
            )}
            
            {/* Edit Mode Toggle */}
            <button
              onClick={toggleEditMode}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                isEditMode
                  ? 'bg-accent text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {isEditMode ? (
                <>
                  <Icon name="Edit" size={16} className="inline mr-2" />
                  {t('cms.editMode')}
                </>
              ) : (
                <>
                  <Icon name="Eye" size={16} className="inline mr-2" />
                  {t('cms.preview')}
                </>
              )}
            </button>
            
            {/* Undo/Redo */}
            {isEditMode && (
              <>
                <button
                  onClick={undo}
                  disabled={historyIndex <= 0}
                  className="p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Undo"
                >
                  <Icon name="Undo" size={20} />
                </button>
                <button
                  onClick={redo}
                  disabled={historyIndex >= editHistory.length - 1}
                  className="p-2 rounded hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Redo"
                >
                  <Icon name="Redo" size={20} />
                </button>
              </>
            )}
          </div>
          
          {/* Center Section - Status */}
          {isEditMode && (
            <div className="flex items-center space-x-4">
              {unsavedChanges && (
                <span className="text-yellow-400 text-sm">
                  <Icon name="AlertCircle" size={16} className="inline mr-1" />
                  Unsaved changes
                </span>
              )}
              
              {savingStatus === 'saving' && (
                <span className="text-blue-400 text-sm">
                  <Icon name="Loader2" size={16} className="inline mr-1 animate-spin" />
                  {t('cms.saving')}
                </span>
              )}
              
              {savingStatus === 'saved' && (
                <span className="text-green-400 text-sm">
                  <Icon name="CheckCircle" size={16} className="inline mr-1" />
                  {t('cms.saved')}
                </span>
              )}
              
              {savingStatus === 'error' && (
                <span className="text-red-400 text-sm">
                  <Icon name="XCircle" size={16} className="inline mr-1" />
                  Error saving
                </span>
              )}
            </div>
          )}
          
          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {/* Save Button */}
            {isEditMode && unsavedChanges && (
              <button
                onClick={handleSave}
                disabled={savingStatus === 'saving'}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                <Icon name="Save" size={16} className="inline mr-2" />
                {t('cms.save')}
              </button>
            )}
            
            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setShowLanguageMenu(!showLanguageMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-700"
              >
                <span className="text-lg">
                  {languages.find(l => l.code === currentLanguage)?.flag}
                </span>
                <span className="text-sm">{currentLanguage.toUpperCase()}</span>
                <Icon name="ChevronDown" size={16} />
              </button>
              
              <AnimatePresence>
                {showLanguageMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-2"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleLanguageChange(lang.code)}
                        className={`w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-3 ${
                          lang.code === currentLanguage ? 'bg-gray-700' : ''
                        }`}
                      >
                        <span className="text-lg">{lang.flag}</span>
                        <span>{lang.name}</span>
                        {lang.code === currentLanguage && (
                          <Icon name="Check" size={16} className="ml-auto text-accent" />
                        )}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center space-x-2 px-3 py-2 rounded hover:bg-gray-700"
              >
                <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                  <Icon name="User" size={16} />
                </div>
                <span className="text-sm">{user?.name || user?.email}</span>
                <Icon name="ChevronDown" size={16} />
              </button>
              
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl py-2"
                  >
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm text-gray-400">Signed in as</p>
                      <p className="text-sm font-medium">{user?.email}</p>
                    </div>
                    <button
                      onClick={logout}
                      className="w-full px-4 py-2 text-left hover:bg-gray-700 flex items-center space-x-2 text-red-400"
                    >
                      <Icon name="LogOut" size={16} />
                      <span>Logout</span>
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminToolbar;
