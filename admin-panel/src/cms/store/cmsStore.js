import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { projectsAPI, contentAPI, mediaAPI } from '../../services/api';

// Track initialization promise to prevent concurrent calls
let initializationPromise = null;

// Tell the editor that a change was NOT saved on the server. Throttled so a
// failing auto-save does not open one dialog per keystroke.
let lastSaveErrorAt = 0;
const notifySaveError = (action, error) => {
  console.error(`${action} failed:`, error);
  const now = Date.now();
  if (now - lastSaveErrorAt < 5000) return;
  lastSaveErrorAt = now;
  const reason = error?.message ? `\n\n(${error.message})` : '';
  window.alert(
    `${action} fehlgeschlagen – die Änderung wurde NICHT gespeichert.\n` +
    `Bitte prüfen Sie die Verbindung bzw. melden Sie sich neu an und versuchen Sie es erneut.${reason}`
  );
};

const useCMSStore = create(
  devtools(
    persist(
      (set, get) => ({
        // Content state
        content: {},
        projects: [],
        sections: {},
        media: [],
        
        // Language state
        currentLanguage: 'de',
        availableLanguages: ['de', 'en', 'fr', 'it', 'es'],
        
        // Edit state
        editingItem: null,
        editHistory: [],
        historyIndex: -1,
        
        // Initialization
        initialized: false,
        isLoading: false,
        error: null,

        initializeStore: async (forceRefresh = false) => {
          // If already initialized and not forcing refresh, return immediately
          if (get().initialized && !forceRefresh) {
            console.log('Store already initialized, skipping...');
            return;
          }
          
          // If initialization is already in progress, return the existing promise
          if (initializationPromise && !forceRefresh) {
            console.log('Initialization already in progress, waiting...');
            return initializationPromise;
          }
          
          // Create new initialization promise
          initializationPromise = (async () => {
            set({ isLoading: true, error: null });
          
          // First, load from localStorage as fallback
          const localProjects = JSON.parse(localStorage.getItem('cms_projects') || '[]');
          const localMedia = JSON.parse(localStorage.getItem('cms_media') || '[]');
          const localContent = JSON.parse(localStorage.getItem('cms_content') || '{}');
          
          // Check if we have authentication
          const token = localStorage.getItem('token');
          
          if (!token) {
            // No auth, just use local data
            set({
              projects: localProjects,
              media: localMedia,
              content: localContent,
              initialized: true,
              isLoading: false
            });
            return;
          }
          
          // We have auth, try to fetch fresh data from API
          try {
            console.log('Fetching fresh data from API...');
            
            // Use Promise.allSettled to handle individual failures gracefully
            const [projectsResult, mediaResult, contentResult] = await Promise.allSettled([
              projectsAPI.getAll(),
              mediaAPI.getAll(),
              contentAPI.getAll({ language: get().currentLanguage })
            ]);
            
            const projects = projectsResult.status === 'fulfilled' && projectsResult.value?.projects ? 
              projectsResult.value.projects : localProjects;
            
            // Process media URLs to use backend server
            let media = mediaResult.status === 'fulfilled' && mediaResult.value?.media ? 
              mediaResult.value.media : localMedia;
            
            console.log('API Response - Projects:', projectsResult.status, projects?.length);
            console.log('API Response - Media:', mediaResult.status, media?.length);
            console.log('API Response - Content:', contentResult.status, contentResult.value);
            
            // Fix media URLs to point to backend server
            const API_BASE = (import.meta.env.VITE_API_URL || 'http://api.braunundeyer.de/api').replace('/api', '');
            media = media.map(item => ({
              ...item,
              url: item.url?.startsWith('http') ? item.url : `${API_BASE}${item.url?.startsWith('/') ? '' : '/'}${item.url}`,
              thumbnail: item.thumbnail?.startsWith('http') ? item.thumbnail : `${API_BASE}${item.thumbnail?.startsWith('/') ? '' : '/'}${item.thumbnail}`
            }));
            
            const content = contentResult.status === 'fulfilled' && contentResult.value?.content ? 
              contentResult.value.content : localContent;
            
            // Save to local storage for offline use (without large image data)
            try {
              // Store projects without base64 image data
              const projectsForStorage = projects.map(p => ({
                ...p,
                image: p.image?.startsWith('data:') ? null : p.image,
                gallery: p.gallery?.map(g => g?.startsWith('data:') ? null : g)
              }));
              localStorage.setItem('cms_projects', JSON.stringify(projectsForStorage));
              
              // Store media references only (not full data)
              const mediaForStorage = media.map(m => ({
                id: m.id,
                filename: m.filename,
                path: m.path,
                url: m.url,
                thumbnail: m.thumbnail
              }));
              localStorage.setItem('cms_media', JSON.stringify(mediaForStorage));
              
              // Content is usually smaller, but let's be safe
              const contentStr = JSON.stringify(content);
              if (contentStr.length < 1000000) { // Only store if less than 1MB
                localStorage.setItem('cms_content', contentStr);
              }
            } catch (storageError) {
              console.warn('Could not save to localStorage:', storageError);
              // Clear localStorage if quota exceeded
              if (storageError.name === 'QuotaExceededError') {
                localStorage.removeItem('cms_projects');
                localStorage.removeItem('cms_media');
                localStorage.removeItem('cms_content');
              }
            }
            
            set({
              projects,
              media,
              content,
              initialized: true,
              isLoading: false
            });
            
            console.log('Store initialized with API data');
          } catch (error) {
            console.error('Failed to fetch from API, using local storage:', error);
            
            // Use local data as fallback
            set({
              projects: localProjects,
              media: localMedia,
              content: localContent,
              initialized: true,
              isLoading: false
            });
          }
          })();
          
          // Wait for initialization to complete
          try {
            await initializationPromise;
          } finally {
            // Clear the promise when done
            initializationPromise = null;
          }
          
          return initializationPromise;
        },

        // Actions
        // Server first: the local state only changes when the API call
        // succeeded. Returns true/false so callers can react.
        setContent: async (key, value, language = null) => {
          const lang = language || get().currentLanguage;
          
          try {
            // Update on server
            await contentAPI.update(key, value, lang);
          } catch (error) {
            notifySaveError('Speichern', error);
            set({ error: error?.message || 'Save failed' });
            return false;
          }
          
          // Update locally
          set((state) => ({
            content: {
              ...state.content,
              [lang]: {
                ...state.content[lang],
                [key]: value
              }
            }
          }));
          get().addToHistory();
          return true;
        },
        
        setProjects: (projects) => set({ projects }),
        
        addProject: async (project) => {
          try {
            const newProject = await projectsAPI.create({
              ...project,
              status: project.status || 'draft'
            });
            
            set((state) => ({
              projects: [...state.projects, newProject]
            }));
            get().addToHistory();
            
            return newProject;
          } catch (error) {
            // No local-only fallback: the project would never reach the website
            notifySaveError('Projekt anlegen', error);
            set({ error: error?.message || 'Save failed' });
            return null;
          }
        },
        
        updateProject: async (id, updates) => {
          try {
            const updatedProject = await projectsAPI.update(id, updates);
            set((state) => ({
              projects: state.projects.map(p => 
                p.id === id ? updatedProject : p
              )
            }));
          } catch (error) {
            // Keep the last saved state; do not pretend the update worked
            notifySaveError('Projekt speichern', error);
            set({ error: error?.message || 'Save failed' });
            return false;
          }
          get().addToHistory();
          return true;
        },
        
        deleteProject: async (id) => {
          try {
            await projectsAPI.delete(id);
          } catch (error) {
            notifySaveError('Projekt löschen', error);
            set({ error: error?.message || 'Delete failed' });
            return false;
          }
          set((state) => ({
            projects: state.projects.filter(p => p.id !== id)
          }));
          get().addToHistory();
          return true;
        },
        
        addSection: (pageId, section) => {
          const newSection = {
            id: Date.now().toString(),
            pageId,
            order: 0,
            type: 'text',
            ...section
          };
          
          set((state) => ({
            sections: {
              ...state.sections,
              [pageId]: [...(state.sections[pageId] || []), newSection]
            }
          }));
          get().addToHistory();
          return newSection;
        },
        
        updateSection: (pageId, sectionId, updates) => {
          set((state) => ({
            sections: {
              ...state.sections,
              [pageId]: state.sections[pageId]?.map(s => 
                s.id === sectionId ? { ...s, ...updates } : s
              ) || []
            }
          }));
          get().addToHistory();
        },
        
        deleteSection: (pageId, sectionId) => {
          set((state) => ({
            sections: {
              ...state.sections,
              [pageId]: state.sections[pageId]?.filter(s => s.id !== sectionId) || []
            }
          }));
          get().addToHistory();
        },
        
        reorderSections: (pageId, sections) => {
          set((state) => ({
            sections: {
              ...state.sections,
              [pageId]: sections
            }
          }));
          get().addToHistory();
        },
        
        uploadMedia: async (file, metadata = {}) => {
          try {
            // Try to upload to API
            const response = await mediaAPI.upload(file, metadata);
            // Ensure proper URL formatting for uploaded media
            let mediaUrl = response.media.url || response.media.path;
            if (mediaUrl && !mediaUrl.startsWith('http')) {
              const BACKEND_URL = (import.meta.env.VITE_API_URL || 'http://api.braunundeyer.de/api').replace('/api', '');
              mediaUrl = `${BACKEND_URL}${mediaUrl.startsWith('/') ? '' : '/'}${mediaUrl}`;
            }
            
            const media = {
              id: response.media.id.toString(),
              url: mediaUrl,
              thumbnail: response.media.thumbnail,
              name: response.media.original_name || file.name,
              type: response.media.mimetype || file.type,
              size: response.media.size || file.size,
              uploadedAt: response.media.created_at || new Date().toISOString(),
              ...response.media
            };
            
            set((state) => ({
              media: [...state.media, media]
            }));
            
            return media;
          } catch (error) {
            console.error('Failed to upload to API:', error);
            // Don't use base64 fallback - it causes issues
            // Instead, throw the error so the user knows the upload failed
            throw new Error(`Failed to upload image: ${error.message || 'Unknown error'}`);
          }
        },
        
        deleteMedia: async (id) => {
          try {
            await mediaAPI.delete(id);
          } catch (error) {
            notifySaveError('Datei löschen', error);
            return false;
          }
          set((state) => ({
            media: state.media.filter(m => m.id !== id)
          }));
          return true;
        },
        
        setCurrentLanguage: (language) => {
          set({ currentLanguage: language });
        },
        
        setEditingItem: (item) => {
          set({ editingItem: item });
        },
        
        // History management
        addToHistory: () => {
          const currentState = {
            content: get().content,
            projects: get().projects,
            sections: get().sections
          };
          
          set((state) => {
            const newHistory = state.editHistory.slice(0, state.historyIndex + 1);
            newHistory.push(JSON.stringify(currentState));
            
            // Keep only last 50 history items
            if (newHistory.length > 50) {
              newHistory.shift();
            }
            
            return {
              editHistory: newHistory,
              historyIndex: newHistory.length - 1
            };
          });
        },
        
        undo: () => {
          const { historyIndex, editHistory } = get();
          if (historyIndex > 0) {
            const previousState = JSON.parse(editHistory[historyIndex - 1]);
            set({
              ...previousState,
              historyIndex: historyIndex - 1
            });
          }
        },
        
        redo: () => {
          const { historyIndex, editHistory } = get();
          if (historyIndex < editHistory.length - 1) {
            const nextState = JSON.parse(editHistory[historyIndex + 1]);
            set({
              ...nextState,
              historyIndex: historyIndex + 1
            });
          }
        },
        
        // Load initial data
        loadContent: async () => {
          try {
            // Load from localStorage for now
            const storedContent = localStorage.getItem('cms_content');
            if (storedContent) {
              const parsed = JSON.parse(storedContent);
              set({
                content: parsed.content || {},
                projects: parsed.projects || [],
                sections: parsed.sections || {}
              });
            }
          } catch (error) {
            console.error('Failed to load content:', error);
          }
        },
        
        // Save all content
        saveAll: async () => {
          const state = get();
          const dataToSave = {
            content: state.content,
            projects: state.projects,
            sections: state.sections,
            media: state.media
          };
          
          try {
            const dataStr = JSON.stringify(dataToSave);
            if (dataStr.length < 1000000) { // Only store if less than 1MB
              localStorage.setItem('cms_content', dataStr);
            }
          } catch (error) {
            console.warn('Could not save to localStorage:', error);
          }
          return { success: true };
        },
        
        // Reset store (useful for logout)
        resetStore: () => {
          // Clear any pending initialization
          initializationPromise = null;
          
          set({
            content: {},
            projects: [],
            sections: {},
            media: [],
            editingItem: null,
            editHistory: [],
            historyIndex: -1,
            initialized: false,
            isLoading: false,
            error: null
          });
          
          // Clear local storage
          localStorage.removeItem('cms_projects');
          localStorage.removeItem('cms_media');
          localStorage.removeItem('cms_content');
          
          // Clear the persisted store data
          localStorage.removeItem('cms-store');
        }
      }),
      {
        name: 'cms-store',
        partialize: (state) => ({
          currentLanguage: state.currentLanguage,
          content: state.content,
          projects: state.projects,
          media: state.media,
          sections: state.sections,
          initialized: state.initialized
        })
      }
    )
  )
);

export default useCMSStore;