import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { projectsAPI, contentAPI, mediaAPI } from '../../services/api';

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

        initializeStore: async () => {
          if (get().initialized) return;
          
          set({ isLoading: true, error: null });
          
          // First, load from localStorage as fallback
          const localProjects = JSON.parse(localStorage.getItem('cms_projects') || '[]');
          const localMedia = JSON.parse(localStorage.getItem('cms_media') || '[]');
          const localContent = JSON.parse(localStorage.getItem('cms_content') || '{}');
          
          // Set local data immediately for offline functionality
          set({
            projects: localProjects,
            media: localMedia,
            content: localContent,
            initialized: true,
            isLoading: false
          });
          
          // Then try to fetch from API (non-blocking)
          try {
            // Use Promise.allSettled to handle individual failures gracefully
            const [projectsResult, mediaResult, contentResult] = await Promise.allSettled([
              projectsAPI.getAll().catch(err => {
                console.log('Projects API unavailable, using local storage');
                return { projects: localProjects };
              }),
              mediaAPI.getAll().catch(err => {
                console.log('Media API unavailable, using local storage');
                return { media: localMedia };
              }),
              contentAPI.getAll({ language: get().currentLanguage }).catch(err => {
                console.log('Content API unavailable, using local storage');
                return { content: localContent };
              })
            ]);
            
            const projects = projectsResult.status === 'fulfilled' ? 
              (projectsResult.value?.projects || localProjects) : localProjects;
            
            // Process media URLs to use backend server
            let media = mediaResult.status === 'fulfilled' ? 
              (mediaResult.value?.media || localMedia) : localMedia;
            
            // Fix media URLs to point to backend server
            const API_BASE = 'http://localhost:3001';
            media = media.map(item => ({
              ...item,
              url: item.url?.startsWith('http') ? item.url : `${API_BASE}${item.url?.startsWith('/') ? '' : '/'}${item.url}`,
              thumbnail: item.thumbnail?.startsWith('http') ? item.thumbnail : `${API_BASE}${item.thumbnail?.startsWith('/') ? '' : '/'}${item.thumbnail}`
            }));
            
            const content = contentResult.status === 'fulfilled' ? 
              (contentResult.value?.content || localContent) : localContent;
            
            set({
              projects,
              media,
              content,
              initialized: true,
              isLoading: false
            });
          } catch (error) {
            console.log('Using local storage fallback for CMS data');
            // Already set local data above, so no action needed
          }
        },

        // Actions
        setContent: async (key, value, language = null) => {
          const lang = language || get().currentLanguage;
          
          try {
            // Update on server
            await contentAPI.update(key, value, lang);
          } catch (error) {
            console.error('Failed to update content on server:', error);
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
            console.error('Failed to add project:', error);
            // Fallback to local storage
            const newProject = {
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              status: 'draft',
              ...project
            };
            
            set((state) => ({
              projects: [...state.projects, newProject]
            }));
            get().addToHistory();
            return newProject;
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
            console.error('Failed to update project:', error);
            // Fallback to local update
            set((state) => ({
              projects: state.projects.map(p => 
                p.id === id 
                  ? { ...p, ...updates, updatedAt: new Date().toISOString() }
                  : p
              )
            }));
          }
          get().addToHistory();
        },
        
        deleteProject: async (id) => {
          try {
            await projectsAPI.delete(id);
          } catch (error) {
            console.error('Failed to delete project:', error);
          }
          set((state) => ({
            projects: state.projects.filter(p => p.id !== id)
          }));
          get().addToHistory();
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
              mediaUrl = `http://localhost:3001${mediaUrl.startsWith('/') ? '' : '/'}${mediaUrl}`;
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
            console.error('Failed to upload to API, using local storage:', error);
            // Fallback to local storage
            return new Promise((resolve, reject) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                const media = {
                  id: Date.now().toString(),
                  url: reader.result,
                  name: file.name,
                  type: file.type,
                  size: file.size,
                  uploadedAt: new Date().toISOString()
                };
                
                set((state) => ({
                  media: [...state.media, media]
                }));
                
                resolve(media);
              };
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
          }
        },
        
        deleteMedia: async (id) => {
          try {
            await mediaAPI.delete(id);
          } catch (error) {
            console.error('Failed to delete media:', error);
          }
          set((state) => ({
            media: state.media.filter(m => m.id !== id)
          }));
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
          
          localStorage.setItem('cms_content', JSON.stringify(dataToSave));
          return { success: true };
        }
      }),
      {
        name: 'cms-store',
        partialize: (state) => ({
          currentLanguage: state.currentLanguage
        })
      }
    )
  )
);

export default useCMSStore;