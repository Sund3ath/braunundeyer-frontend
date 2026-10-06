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
            console.log('Token invalid, clearing session');
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
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

  // Real API login only. A failed request is reported as an error; there is
  // no offline/mock fallback (it used to open a CMS that saved nothing).
  const login = async (email, password) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response && response.user) {
        setUser(response.user);
        setIsAuthenticated(true);
        setIsEditMode(true);
        return { success: true };
      }
      
      return { success: false, error: 'Login failed: unexpected server response' };
    } catch (error) {
      console.error('Login error:', error);
      const message = error?.message || '';
      if (/invalid credentials/i.test(message)) {
        return { success: false, error: 'E-Mail oder Passwort ist falsch.' };
      }
      if (/too many/i.test(message)) {
        return { success: false, error: 'Zu viele Anmeldeversuche. Bitte warten Sie 15 Minuten.' };
      }
      return {
        success: false,
        error: `Anmeldung fehlgeschlagen – Server nicht erreichbar oder Fehler (${message || 'unbekannt'}).`
      };
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