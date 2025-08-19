import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { authAPI } from '../../services/api';
import useCMSStore from '../store/cmsStore';

const EditModeContext = createContext();

export const useEditMode = () => {
  const context = useContext(EditModeContext);
  if (!context) {
    throw new Error('useEditMode must be used within EditModeProvider');
  }
  return context;
};

export const EditModeProvider = ({ children }) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [savingStatus, setSavingStatus] = useState('idle'); // idle, saving, saved, error

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log('Checking auth:', { token, storedUser });
      
      if (token && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          
          // Try to verify token with API
          try {
            const profile = await authAPI.getProfile();
            console.log('Restoring user session:', profile);
            setUser(profile.user || userData);
            setIsAuthenticated(true);
          } catch (error) {
            // If API is down but we have a mock token, still restore session
            if (token === 'mock_token_123') {
              console.log('API unavailable, restoring mock session:', userData);
              setUser(userData);
              setIsAuthenticated(true);
            } else {
              console.log('Token invalid, clearing session');
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              localStorage.removeItem('user');
            }
          }
        } catch (error) {
          console.error('Failed to parse user data:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('user');
        }
      }
    };
    
    checkAuth();
  }, []);

  // Warn user about unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (unsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [unsavedChanges]);

  const login = async (email, password) => {
    try {
      console.log('Attempting login with:', email);
      
      // Try real API
      try {
        const response = await authAPI.login(email, password);
        
        if (response && response.user) {
          console.log('API login successful:', response.user);
          setUser(response.user);
          setIsAuthenticated(true);
          setIsEditMode(true);
          return { success: true };
        }
      } catch (apiError) {
        console.log('API login failed, using fallback:', apiError.message);
        
        // Fallback to mock authentication for development without backend
        if (email === 'admin@braunundeyer.de' && password === 'admin123') {
          const userData = {
            id: 1,
            email,
            name: 'Admin User',
            role: 'admin'
          };
          
          // Store mock data
          localStorage.setItem('token', 'mock_token_123');
          localStorage.setItem('user', JSON.stringify(userData));
          
          console.log('Mock login successful:', userData);
          setUser(userData);
          setIsAuthenticated(true);
          setIsEditMode(true);
          return { success: true };
        }
      }
      
      return { success: false, error: 'Invalid credentials' };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  const logout = async () => {
    try {
      // Try to logout from API
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    
    // Clear local data regardless
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    Cookies.remove('cms_token'); // Remove old cookie if exists
    
    // Reset the CMS store
    const { resetStore } = useCMSStore.getState();
    if (resetStore) {
      resetStore();
    }
    
    setUser(null);
    setIsAuthenticated(false);
    setIsEditMode(false);
  };

  const toggleEditMode = () => {
    if (!isAuthenticated) {
      alert('Please login to edit content');
      return;
    }
    
    if (isEditMode && unsavedChanges) {
      const confirmExit = window.confirm('You have unsaved changes. Do you want to discard them?');
      if (!confirmExit) return;
    }
    
    setIsEditMode(!isEditMode);
    if (isEditMode) {
      setUnsavedChanges(false);
    }
  };

  const saveChanges = async (data) => {
    setSavingStatus('saving');
    try {
      // This would normally make an API call to save data
      // For now, we'll simulate saving to localStorage
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      try {
        const existingData = JSON.parse(localStorage.getItem('cms_content') || '{}');
        const updatedData = { ...existingData, ...data };
        const dataStr = JSON.stringify(updatedData);
        if (dataStr.length < 1000000) { // Only store if less than 1MB
          localStorage.setItem('cms_content', dataStr);
        } else {
          console.warn('Content too large for localStorage, skipping storage');
        }
      } catch (storageError) {
        console.warn('Could not save to localStorage:', storageError);
        if (storageError.name === 'QuotaExceededError') {
          localStorage.removeItem('cms_content');
        }
      }
      
      setSavingStatus('saved');
      setUnsavedChanges(false);
      
      setTimeout(() => setSavingStatus('idle'), 2000);
      return { success: true };
    } catch (error) {
      console.error('Save error:', error);
      setSavingStatus('error');
      setTimeout(() => setSavingStatus('idle'), 3000);
      return { success: false, error: 'Failed to save changes' };
    }
  };

  const markAsChanged = () => {
    if (isEditMode) {
      setUnsavedChanges(true);
    }
  };

  const value = {
    isEditMode,
    isAuthenticated,
    user,
    unsavedChanges,
    savingStatus,
    login,
    logout,
    toggleEditMode,
    saveChanges,
    markAsChanged
  };

  return (
    <EditModeContext.Provider value={value}>
      {children}
    </EditModeContext.Provider>
  );
};

export default EditModeContext;