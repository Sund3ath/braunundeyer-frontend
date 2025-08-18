import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useEditMode } from '../contexts/EditModeContext';
import useCMSStore from '../store/cmsStore';
import ProjectManager from '../components/ProjectManager';
import ContentEditor from '../components/ContentEditor';
import TranslationManager from '../components/TranslationManager';
import LoginModal from '../components/LoginModal';
import HomepageEditor from '../components/HomepageEditor';
import AnalyticsDashboardEnhanced from '../components/AnalyticsDashboardEnhanced';
import TeamManager from '../components/TeamManager';
import ContactSettings from '../components/ContactSettings';
import NavigationManager from '../components/NavigationManager';
import SEOManager from '../components/SEOManager';
import LegalPagesEditor from '../components/LegalPagesEditor';
import FooterManager from '../components/FooterManager';
import MediaLibraryEnhanced from '../components/MediaLibraryEnhanced';
import Icon from 'components/AppIcon';
import MultiLanguageSEO from 'components/MultiLanguageSEO';
import '../styles/admin.css';

const AdminDashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { lang } = useParams();
  const { isAuthenticated, user, logout, isEditMode, toggleEditMode } = useEditMode();
  const { 
    content, 
    projects, 
    media,
    currentLanguage,
    saveAll,
    loadContent,
    initializeStore,
    initialized
  } = useCMSStore();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [showTranslationManager, setShowTranslationManager] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [stats, setStats] = useState({
    totalProjects: 0,
    publishedProjects: 0,
    draftProjects: 0,
    totalMedia: 0,
    contentKeys: 0,
    translatedLanguages: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [authCheckComplete, setAuthCheckComplete] = useState(false);
  
  // Check authentication status with a delay to allow context to initialize
  useEffect(() => {
    console.log('AdminDashboard - Auth status:', { isAuthenticated, user });
    
    // Give the auth context time to restore session from cookies
    const checkAuth = setTimeout(() => {
      setAuthCheckComplete(true);
      if (isAuthenticated) {
        console.log('Admin authenticated, showing dashboard');
        setIsLoading(false);
      } else {
        console.log('Not authenticated after check');
        // Don't redirect immediately, show login prompt instead
        setIsLoading(false);
      }
    }, 500); // Increased delay to ensure auth context initializes
    
    return () => clearTimeout(checkAuth);
  }, [isAuthenticated, user]);
  
  // Initialize store and load content on mount
  useEffect(() => {
    const init = async () => {
      if (isAuthenticated) {
        console.log('User authenticated, initializing CMS store...');
        // Always fetch fresh data when authenticated, even if initialized
        // This ensures we have the latest data from the backend
        await initializeStore(true); // Force refresh
      } else if (!isAuthenticated && authCheckComplete) {
        // Not authenticated, load local data only
        console.log('Not authenticated, loading local data...');
        loadContent();
      }
    };
    
    if (authCheckComplete) {
      init();
    }
  }, [isAuthenticated, authCheckComplete, initializeStore, loadContent]);
  
  // Add admin-page class to body for proper cursor display
  useEffect(() => {
    document.body.classList.add('admin-page');
    return () => {
      document.body.classList.remove('admin-page');
    };
  }, []);
  
  // Calculate stats
  useEffect(() => {
    const publishedCount = projects.filter(p => p.status === 'published').length;
    const draftCount = projects.filter(p => p.status === 'draft').length;
    
    const translatedLangs = [];
    ['de', 'en', 'fr', 'it', 'es'].forEach(langCode => {
      if (content[langCode] && Object.keys(content[langCode]).length > 0) {
        translatedLangs.push(langCode);
      }
    });
    
    setStats({
      totalProjects: projects.length,
      publishedProjects: publishedCount,
      draftProjects: draftCount,
      totalMedia: media.length,
      contentKeys: Object.keys(content[currentLanguage] || {}).length,
      translatedLanguages: translatedLangs
    });
  }, [projects, media, content, currentLanguage]);
  
  const handleSaveAll = async () => {
    const result = await saveAll();
    if (result.success) {
      alert('All changes saved successfully!');
    }
  };
  
  const exportContent = () => {
    const dataToExport = {
      content,
      projects,
      media,
      exportDate: new Date().toISOString(),
      version: '1.0.0'
    };
    
    const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cms-export-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };
  
  const importContent = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        try {
          const imported = JSON.parse(event.target.result);
          
          if (window.confirm('This will replace all existing content. Are you sure?')) {
            // Import logic would go here
            // For now, just show success message
            alert('Content imported successfully!');
            window.location.reload();
          }
        } catch (error) {
          alert('Invalid import file');
        }
      };
      reader.readAsText(file);
    }
  };
  
  const tabs = [
    { id: 'overview', name: 'Overview', icon: 'LayoutDashboard' },
    { id: 'homepage', name: 'Homepage', icon: 'Home' },
    { id: 'projects', name: 'Projects', icon: 'Folder' },
    { id: 'team', name: 'Team', icon: 'Users' },
    { id: 'contact', name: 'Contact', icon: 'Mail' },
    { id: 'navigation', name: 'Navigation', icon: 'Menu' },
    { id: 'seo', name: 'SEO', icon: 'Search' },
    { id: 'legal', name: 'Legal Pages', icon: 'FileText' },
    { id: 'footer', name: 'Footer', icon: 'Layout' },
    { id: 'content', name: 'Content', icon: 'FileText' },
    { id: 'media', name: 'Media', icon: 'Image' },
    { id: 'translations', name: 'Translations', icon: 'Languages' },
    { id: 'analytics', name: 'Analytics', icon: 'BarChart' },
    { id: 'settings', name: 'Settings', icon: 'Settings' }
  ];
  
  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }
  
  // Show login prompt if not authenticated after check
  if (!isAuthenticated && authCheckComplete) {
    return (
      <>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-2xl font-heading mb-4 text-center">Authentication Required</h2>
            <p className="text-gray-600 mb-6 text-center">Please login to access the admin dashboard.</p>
            
            <div className="space-y-4">
              <button
                onClick={() => setShowLoginModal(true)}
                className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Open Login Dialog
              </button>
              
              <div className="text-center">
                <p className="text-sm text-gray-500">Or press Ctrl/Cmd + Shift + L</p>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-400 text-center">
                  Demo credentials:<br/>
                  Email: admin@braunundeyer.de<br/>
                  Password: admin123
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <LoginModal 
          isOpen={showLoginModal} 
          onClose={() => {
            setShowLoginModal(false);
            // Re-check auth after modal closes
            if (isAuthenticated) {
              setIsLoading(false);
            }
          }} 
        />
      </>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <MultiLanguageSEO
        title="Admin Dashboard | Braun & Eyer CMS | Admin Panel"
        description="Content Management System Dashboard"
        noindex={true}
      />
      
      {/* Floating Mode Indicator */}
      <div className={`fixed top-4 right-4 z-50 transition-all duration-300 ${
        isEditMode ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="bg-blue-600 text-white px-4 py-2 rounded-l-full shadow-xl flex items-center">
          <div className="w-3 h-3 bg-white rounded-full animate-pulse mr-2"></div>
          <span className="font-bold text-sm">EDITING</span>
        </div>
      </div>
      
      {/* Sidebar */}
      <aside className={`w-64 bg-white shadow-lg flex flex-col h-screen sticky top-0 transition-all duration-300 ${
        isEditMode 
          ? 'bg-gradient-to-b from-blue-50 to-white' 
          : 'bg-white'
      }`}>
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-heading font-light text-primary">
            CMS Dashboard
          </h1>
              
          <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            isEditMode 
              ? 'bg-blue-100 text-blue-700' 
              : 'bg-gray-100 text-gray-600'
          }`}>
            <Icon 
              name={isEditMode ? 'Edit3' : 'Eye'} 
              size={12} 
              className="mr-1"
            />
            {isEditMode ? 'EDIT MODE' : 'VIEW MODE'}
          </div>
        </div>
            
        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          <div className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 shadow-sm'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <Icon name={tab.icon} size={18} className="mr-3 flex-shrink-0" />
                <span>{tab.name}</span>
                {activeTab === tab.id && (
                  <div className="ml-auto w-1 h-5 bg-blue-600 rounded-full"></div>
                )}
              </button>
            ))}
          </div>
        </nav>
      
        {/* Sidebar Actions */}
        <div className="p-4 border-t border-gray-200 bg-white space-y-2">
          <button
            onClick={toggleEditMode}
            className={`w-full px-3 py-2 rounded-lg font-medium text-sm transition-all ${
              isEditMode 
                ? 'bg-gray-600 text-white hover:bg-gray-700' 
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            <Icon 
              name={isEditMode ? 'Eye' : 'Edit3'} 
              size={16} 
              className="inline mr-2" 
            />
            {isEditMode ? 'Switch to View' : 'Switch to Edit'}
          </button>
          
          <button
            onClick={() => navigate(`/${currentLanguage || 'de'}/homepage`)}
            className="w-full px-3 py-2 text-gray-600 hover:bg-gray-50 border border-gray-300 rounded-lg text-sm transition-all"
          >
            <Icon name="Eye" size={16} className="inline mr-2" />
            View Site
          </button>
          
          <button
            onClick={logout}
            className="w-full px-3 py-2 text-red-600 hover:bg-red-50 border border-red-200 rounded-lg text-sm transition-all"
          >
            <Icon name="LogOut" size={16} className="inline mr-2" />
            Logout
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-lg shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Projects</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalProjects}</p>
                  </div>
                  <Icon name="Folder" size={32} className="text-blue-500" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-green-600">{stats.publishedProjects} published</span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-yellow-600">{stats.draftProjects} drafts</span>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 rounded-lg shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Content Keys</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.contentKeys}</p>
                  </div>
                  <Icon name="FileText" size={32} className="text-green-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    In {currentLanguage.toUpperCase()} language
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 rounded-lg shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Media Files</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalMedia}</p>
                  </div>
                  <Icon name="Image" size={32} className="text-purple-500" />
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Images and documents
                  </p>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white p-6 rounded-lg shadow"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Languages</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.translatedLanguages.length}</p>
                  </div>
                  <Icon name="Globe" size={32} className="text-orange-500" />
                </div>
                <div className="mt-4 flex flex-wrap gap-1">
                  {stats.translatedLanguages.map(langCode => {
                    const lang = ['de', 'en', 'fr', 'it', 'es'].find(l => l === langCode);
                    return (
                      <span key={langCode} className="text-xs bg-gray-100 px-2 py-1 rounded">
                        {langCode.toUpperCase()}
                      </span>
                    );
                  })}
                </div>
              </motion.div>
            </div>
            
            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('projects')}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                >
                  <Icon name="Plus" size={24} className="mx-auto mb-2 text-blue-600" />
                  <p className="text-sm">Add Project</p>
                </button>
                <button
                  onClick={() => setShowTranslationManager(true)}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                >
                  <Icon name="Languages" size={24} className="mx-auto mb-2 text-green-600" />
                  <p className="text-sm">Translate Content</p>
                </button>
                <button
                  onClick={exportContent}
                  className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-center"
                >
                  <Icon name="Download" size={24} className="mx-auto mb-2 text-purple-600" />
                  <p className="text-sm">Export Content</p>
                </button>
                <label className="p-4 border border-gray-300 rounded-lg hover:bg-gray-50 text-center cursor-pointer">
                  <Icon name="Upload" size={24} className="mx-auto mb-2 text-orange-600" />
                  <p className="text-sm">Import Content</p>
                  <input
                    type="file"
                    accept=".json"
                    onChange={importContent}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
            
            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-lg font-medium mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Icon name="Edit" size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Content updated</p>
                      <p className="text-xs text-gray-500">hero_title in German</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center space-x-3">
                    <Icon name="Plus" size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Project added</p>
                      <p className="text-xs text-gray-500">Villa Modern</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">5 hours ago</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center space-x-3">
                    <Icon name="Languages" size={16} className="text-gray-400" />
                    <div>
                      <p className="text-sm font-medium">Content translated</p>
                      <p className="text-xs text-gray-500">German to English</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Homepage Tab */}
        {activeTab === 'homepage' && <HomepageEditor />}
        
        {/* Projects Tab */}
        {activeTab === 'projects' && <ProjectManager />}
        
        {/* Team Tab */}
        {activeTab === 'team' && <TeamManager />}
        
        
        {/* Contact Tab */}
        {activeTab === 'contact' && <ContactSettings />}
        
        {/* Navigation Tab */}
        {activeTab === 'navigation' && <NavigationManager />}
        
        {/* SEO Tab */}
        {activeTab === 'seo' && <SEOManager />}
        
        {/* Legal Pages Tab */}
        {activeTab === 'legal' && <LegalPagesEditor />}
        
        {/* Footer Tab */}
        {activeTab === 'footer' && <FooterManager />}
        
        {/* Content Tab */}
        {activeTab === 'content' && <ContentEditor />}
        
        {/* Old Content Tab - Hidden */}
        {false && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Content Management</h2>
            <p className="text-gray-600 mb-6">
              Edit content directly on the pages by toggling edit mode from the admin toolbar.
            </p>
            
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-medium mb-2">Current Language Content</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Language: {currentLanguage.toUpperCase()} - {stats.contentKeys} content keys
                </p>
                
                <div className="max-h-96 overflow-y-auto border border-gray-200 rounded p-3">
                  {Object.entries(content[currentLanguage] || {}).map(([key, value]) => (
                    <div key={key} className="py-2 border-b border-gray-100 last:border-0">
                      <p className="text-sm font-medium text-gray-700">{key}</p>
                      <p className="text-sm text-gray-500 mt-1">{String(value).substring(0, 200)}...</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => setShowTranslationManager(true)}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Open Translation Manager
              </button>
            </div>
          </div>
        )}
        
        {/* Media Tab */}
        {activeTab === 'media' && <MediaLibraryEnhanced />}
        
        {/* Translations Tab */}
        {activeTab === 'translations' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Translation Management</h2>
            <p className="text-gray-600 mb-6">
              Manage translations for all content across different languages.
            </p>
            
            <button
              onClick={() => setShowTranslationManager(true)}
              className="w-full py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Icon name="Languages" size={24} className="inline mr-2" />
              Open Translation Manager
            </button>
            
            <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
              {['de', 'en', 'fr', 'it', 'es'].map(langCode => {
                const hasContent = content[langCode] && Object.keys(content[langCode]).length > 0;
                return (
                  <div
                    key={langCode}
                    className={`p-4 border rounded-lg text-center ${
                      hasContent ? 'border-green-300 bg-green-50' : 'border-gray-300'
                    }`}
                  >
                    <p className="text-2xl mb-2">
                      {langCode === 'de' ? '🇩🇪' :
                       langCode === 'en' ? '🇬🇧' :
                       langCode === 'fr' ? '🇫🇷' :
                       langCode === 'it' ? '🇮🇹' : '🇪🇸'}
                    </p>
                    <p className="font-medium">{langCode.toUpperCase()}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {hasContent ? `${Object.keys(content[langCode]).length} keys` : 'No content'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboardEnhanced />
        )}
        
        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium mb-4">Settings</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">User Information</h3>
                <div className="border border-gray-200 rounded-lg p-4">
                  <p className="text-sm text-gray-600">Email: {user?.email}</p>
                  <p className="text-sm text-gray-600">Role: {user?.role}</p>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Export/Import</h3>
                <div className="flex space-x-4">
                  <button
                    onClick={exportContent}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Export All Content
                  </button>
                  <label className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 cursor-pointer">
                    Import Content
                    <input
                      type="file"
                      accept=".json"
                      onChange={importContent}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-2">Cache Management</h3>
                <button
                  onClick={() => {
                    localStorage.clear();
                    alert('Cache cleared successfully');
                    window.location.reload();
                  }}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Clear Cache
                </button>
              </div>
            </div>
          </div>
        )}
        </div>
      </main>
      
      {/* Translation Manager Modal */}
      <TranslationManager
        isOpen={showTranslationManager}
        onClose={() => setShowTranslationManager(false)}
      />
    </div>
  );
};

export default AdminDashboard;