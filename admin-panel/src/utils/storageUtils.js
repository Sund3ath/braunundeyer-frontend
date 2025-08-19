// Storage utility functions to handle localStorage safely

export const clearCMSStorage = () => {
  try {
    localStorage.removeItem('cms_projects');
    localStorage.removeItem('cms_media');
    localStorage.removeItem('cms_content');
    localStorage.removeItem('legal_versions');
    console.log('CMS storage cleared');
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
};

export const getStorageSize = () => {
  let totalSize = 0;
  try {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        const item = localStorage.getItem(key);
        totalSize += item ? item.length + key.length : 0;
      }
    }
  } catch (error) {
    console.error('Error calculating storage size:', error);
  }
  return totalSize;
};

export const isStorageAvailable = () => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, 'test');
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

export const safeSetItem = (key, value, maxSize = 500000) => {
  try {
    const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
    
    // Check size before storing
    if (stringValue.length > maxSize) {
      console.warn(`Storage item ${key} exceeds max size (${stringValue.length} > ${maxSize}), not storing`);
      return false;
    }
    
    localStorage.setItem(key, stringValue);
    return true;
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      console.warn('Storage quota exceeded, clearing old data...');
      clearCMSStorage();
      
      // Try once more after clearing
      try {
        localStorage.setItem(key, stringValue);
        return true;
      } catch (retryError) {
        console.error('Storage still full after clearing:', retryError);
        return false;
      }
    }
    console.error('Storage error:', error);
    return false;
  }
};

export const safeGetItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading ${key} from storage:`, error);
    return defaultValue;
  }
};