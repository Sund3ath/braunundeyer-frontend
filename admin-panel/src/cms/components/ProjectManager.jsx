import React, { useState, useEffect } from 'react';
import { API_BASE_URL, BACKEND_URL } from "../../config/api";
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTranslation } from 'react-i18next';
import { useEditMode } from '../contexts/EditModeContext';
import useCMSStore from '../store/cmsStore';
import EditableText from './EditableText';
import EditableImage from './EditableImage';
import Icon from 'components/AppIcon';
import ProjectTranslations from './ProjectTranslations';
import { projectsAPI } from '../../services/api';

// Sortable Project Card
const SortableProjectCard = ({ project, onEdit, onDelete }) => {
  const { t } = useTranslation();
  const { isEditMode } = useEditMode();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: project.id });
  
  const style = isEditMode ? {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  } : {};
  
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg shadow-md overflow-hidden ${!isEditMode ? 'cursor-default' : ''}`}
      whileHover={isEditMode ? { scale: 1.02 } : {}}
    >
      <div className="flex">
        {/* Drag Handle - Only show in edit mode */}
        {isEditMode && (
          <div
            {...attributes}
            {...listeners}
            className="w-12 bg-gray-100 flex items-center justify-center cursor-move hover:bg-gray-200"
          >
            <Icon name="GripVertical" size={20} className="text-gray-500" />
          </div>
        )}
        
        {/* Project Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className="font-medium text-lg mb-1">{project.title || 'Untitled Project'}</h3>
              <p className="text-gray-600 text-sm mb-2">{project.description || ''}</p>
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <span>{project.category || 'Uncategorized'}</span>
                <span>{project.year}</span>
                <span>{project.location}</span>
              </div>
            </div>
            
            {/* Thumbnail */}
            {project.image && (
              <img
                src={project.image.startsWith('http') ? project.image : `${BACKEND_URL}${project.image.startsWith('/') ? '' : '/'}${project.image}`}
                alt={project.title || 'Project'}
                className="w-20 h-20 object-cover rounded ml-4"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80"%3E%3Crect width="80" height="80" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="system-ui" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                }}
              />
            )}
          </div>
          
          {/* Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                project.status === 'published' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {project.status}
              </span>
            </div>
            
            {isEditMode && (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onEdit(project)}
                  className="p-1 hover:bg-gray-100 rounded"
                  title={t('cms.edit')}
                >
                  <Icon name="Edit2" size={16} />
                </button>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('openProjectTranslations', { detail: project }))}
                  className="p-1 hover:bg-blue-100 rounded text-blue-600"
                  title="Translate"
                >
                  <Icon name="Globe" size={16} />
                </button>
                <button
                  onClick={() => onDelete(project.id)}
                  className="p-1 hover:bg-red-100 rounded text-red-600"
                  title={t('cms.delete')}
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Project Editor Modal
const ProjectEditorModal = ({ project, isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
  const { uploadMedia } = useCMSStore();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Neubau',
    year: new Date().getFullYear().toString(),
    location: '',
    area: '',
    image: '',
    gallery: [],
    details: '',
    status: 'draft'
  });
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizingField, setOptimizingField] = useState(null);
  
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || project.name || '',
        description: project.description || '',
        category: project.category || 'Neubau',
        year: project.year || new Date().getFullYear().toString(),
        location: project.location || '',
        area: project.area || '',
        image: project.image || project.featured_image || '',
        gallery: project.gallery || project.images || [],
        details: project.details || '',
        status: project.status || 'draft'
      });
    } else {
      setFormData({
        title: '',
        description: '',
        category: 'Neubau',
        year: new Date().getFullYear().toString(),
        location: '',
        area: '',
        image: '',
        gallery: [],
        details: '',
        status: 'draft'
      });
    }
  }, [project]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const media = await uploadMedia(file);
      setFormData({ ...formData, image: media.url });
    }
  };
  
  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    const uploadedImages = [];
    
    for (const file of files) {
      const media = await uploadMedia(file);
      uploadedImages.push(media.url);
    }
    
    setFormData({
      ...formData,
      gallery: [...formData.gallery, ...uploadedImages]
    });
  };
  
  const handleOptimizeText = async (field, type = 'optimize') => {
    if (!formData[field] || formData[field].trim() === '') {
      alert('Please enter some text first');
      return;
    }
    
    setIsOptimizing(true);
    setOptimizingField(field);
    
    try {
      // Get auth token from localStorage - check both possible keys
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      if (!token) {
        console.error('No auth token found');
        alert('Authentication required. Please log in again.');
        return;
      }
      
      console.log('Using token for AI optimization:', token ? 'Token found' : 'No token');
      
      const response = await fetch(API_BASE_URL + '/ai/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          text: formData[field],
          type: type,
          language: 'de',
          context: field === 'title' ? 'Architecture project title' : 
                   field === 'description' ? 'Architecture project description' :
                   'Architecture project details'
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('AI optimization failed:', response.status, errorData);
        throw new Error(errorData.message || `Failed to optimize text (${response.status})`);
      }
      
      const data = await response.json();
      
      // Update the form field with optimized text
      setFormData({
        ...formData,
        [field]: data.optimizedText
      });
      
    } catch (error) {
      console.error('Error optimizing text:', error);
      alert('Failed to optimize text. Please try again.');
    } finally {
      setIsOptimizing(false);
      setOptimizingField(null);
    }
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
            className="fixed inset-0 bg-black/50 z-[9997]"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed inset-0 z-[9998] overflow-y-auto"
          >
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl">
                <div className="sticky top-0 bg-white rounded-t-xl border-b border-gray-200 px-6 py-4 z-10">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-heading font-light text-primary">
                      {project ? t('cms.edit') : t('cms.addProject')} Project
                    </h2>
                    <button
                      onClick={onClose}
                      className="p-1 hover:bg-gray-100 rounded-lg"
                    >
                      <Icon name="X" size={24} />
                    </button>
                  </div>
                </div>
                
                <div className="p-6 max-h-[calc(90vh-80px)] overflow-y-auto">
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      value={formData.title || ''}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category
                    </label>
                    <select
                      value={formData.category || 'Neubau'}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Neubau">Neubau</option>
                      <option value="Altbausanierung">Altbausanierung</option>
                      <option value="Gewerbebau">Gewerbebau</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Year
                    </label>
                    <input
                      type="text"
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Area
                    </label>
                    <input
                      type="text"
                      value={formData.area || ''}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 250 m²"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status || 'draft'}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
                
                {/* Description */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Short Description
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOptimizeText('description', 'optimize')}
                        disabled={isOptimizing && optimizingField === 'description'}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                      >
                        {isOptimizing && optimizingField === 'description' ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Optimizing...</span>
                          </>
                        ) : (
                          <>
                            <Icon name="Sparkles" size={12} />
                            <span>Optimize</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOptimizeText('description', 'extend')}
                        disabled={isOptimizing && optimizingField === 'description'}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                      >
                        <Icon name="Maximize2" size={12} />
                        <span>Extend</span>
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                  />
                </div>
                
                {/* Main Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Main Image
                  </label>
                  <div className="flex items-center space-x-4">
                    {formData.image && (
                      <img
                        src={formData.image.startsWith('http') ? formData.image : `${BACKEND_URL}${formData.image.startsWith('/') ? '' : '/'}${formData.image}`}
                        alt="Main"
                        className="w-32 h-32 object-cover rounded"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128"%3E%3Crect width="128" height="128" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="system-ui" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                        }}
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="flex-1"
                    />
                  </div>
                </div>
                
                {/* Gallery */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gallery Images
                  </label>
                  <div className="grid grid-cols-4 gap-4 mb-4">
                    {formData.gallery?.map((img, index) => (
                      <div key={index} className="relative">
                        <img
                          src={img.startsWith('http') ? img : `${BACKEND_URL}${img.startsWith('/') ? '' : '/'}${img}`}
                          alt={`Gallery ${index + 1}`}
                          className="w-full h-24 object-cover rounded"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="96" viewBox="0 0 128 96"%3E%3Crect width="128" height="96" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="system-ui" font-size="10"%3ENo Image%3C/text%3E%3C/svg%3E';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newGallery = formData.gallery.filter((_, i) => i !== index);
                            setFormData({ ...formData, gallery: newGallery });
                          }}
                          className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded"
                        >
                          <Icon name="X" size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleGalleryUpload}
                  />
                </div>
                
                {/* Details */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-sm font-medium text-gray-700">
                      Detailed Description
                    </label>
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => handleOptimizeText('details', 'optimize')}
                        disabled={isOptimizing && optimizingField === 'details'}
                        className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                      >
                        {isOptimizing && optimizingField === 'details' ? (
                          <>
                            <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Optimizing...</span>
                          </>
                        ) : (
                          <>
                            <Icon name="Sparkles" size={12} />
                            <span>Optimize</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOptimizeText('details', 'extend')}
                        disabled={isOptimizing && optimizingField === 'details'}
                        className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                      >
                        <Icon name="Maximize2" size={12} />
                        <span>Extend</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOptimizeText('details', 'shorten')}
                        disabled={isOptimizing && optimizingField === 'details'}
                        className="px-3 py-1 text-xs bg-orange-600 text-white rounded hover:bg-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
                      >
                        <Icon name="Minimize2" size={12} />
                        <span>Shorten</span>
                      </button>
                    </div>
                  </div>
                  <textarea
                    value={formData.details || ''}
                    onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={6}
                  />
                </div>
                
                {/* Actions */}
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    {t('cms.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    {t('cms.save')}
                  </button>
                </div>
              </form>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Main Project Manager Component
const ProjectManager = () => {
  const { t } = useTranslation();
  const { isEditMode, isAuthenticated } = useEditMode();
  const { projects, setProjects, addProject, updateProject, deleteProject } = useCMSStore();
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [showTranslations, setShowTranslations] = useState(false);
  const [translatingProject, setTranslatingProject] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  // Fetch fresh projects when component mounts
  useEffect(() => {
    const fetchProjects = async () => {
      if (isAuthenticated) {
        setIsLoading(true);
        try {
          console.log('Fetching projects from API...');
          const response = await projectsAPI.getAll();
          if (response && response.projects) {
            console.log(`Fetched ${response.projects.length} projects from API`);
            setProjects(response.projects);
          }
        } catch (error) {
          console.error('Failed to fetch projects:', error);
          // Projects from store will be used as fallback
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchProjects();
  }, [isAuthenticated, setProjects]);

  // Listen for translation event
  useEffect(() => {
    const handleOpenTranslations = (event) => {
      setTranslatingProject(event.detail);
      setShowTranslations(true);
    };

    window.addEventListener('openProjectTranslations', handleOpenTranslations);
    return () => window.removeEventListener('openProjectTranslations', handleOpenTranslations);
  }, []);
  
  // Filter projects
  const filteredProjects = projects.filter(project => {
    const matchesCategory = filterCategory === 'all' || project.category === filterCategory;
    const matchesSearch = (project.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (project.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = projects.findIndex(p => p.id === active.id);
      const newIndex = projects.findIndex(p => p.id === over.id);
      
      setProjects(arrayMove(projects, oldIndex, newIndex));
    }
  };
  
  const handleEdit = (project) => {
    setEditingProject(project);
    setShowEditor(true);
  };
  
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
    }
  };
  
  const handleSave = (formData) => {
    if (editingProject) {
      updateProject(editingProject.id, formData);
    } else {
      addProject(formData);
    }
    setEditingProject(null);
  };
  
  const handleRefresh = async () => {
    setIsLoading(true);
    try {
      console.log('Refreshing projects from API...');
      const response = await projectsAPI.getAll();
      if (response && response.projects) {
        console.log(`Refreshed ${response.projects.length} projects from API`);
        setProjects(response.projects);
      }
    } catch (error) {
      console.error('Failed to refresh projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-heading font-light text-primary">
          {isEditMode ? 'Project Management' : 'Projects'}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
            title="Refresh projects"
          >
            <Icon name={isLoading ? "Loader2" : "RefreshCw"} 
                  size={20} 
                  className={isLoading ? "animate-spin" : ""} />
          </button>
          {isEditMode && (
            <button
              onClick={() => {
                setEditingProject(null);
                setShowEditor(true);
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <Icon name="Plus" size={20} />
              <span>{t('cms.addProject')}</span>
            </button>
          )}
        </div>
      </div>
      
      {/* Filters */}
      <div className="flex items-center space-x-4 mb-6">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="Neubau">Neubau</option>
          <option value="Altbausanierung">Altbausanierung</option>
          <option value="Gewerbebau">Gewerbebau</option>
        </select>
      </div>
      
      {/* Projects List */}
      <div className="relative">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 flex items-center justify-center z-10">
            <div className="flex items-center space-x-2">
              <Icon name="Loader2" size={24} className="animate-spin text-blue-600" />
              <span className="text-gray-600">Loading projects...</span>
            </div>
          </div>
        )}
        
        {isEditMode ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={filteredProjects.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {filteredProjects.map(project => (
                  <SortableProjectCard
                    key={project.id}
                    project={project}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map(project => (
              <SortableProjectCard
                key={project.id}
                project={project}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Icon name="Folder" size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">No projects found</p>
        </div>
      )}
      
      {/* Editor Modal - Only in edit mode */}
      {isEditMode && (
        <ProjectEditorModal
          project={editingProject}
          isOpen={showEditor}
          onClose={() => {
            setShowEditor(false);
            setEditingProject(null);
          }}
          onSave={handleSave}
        />
      )}
      
      {/* Translation Modal */}
      {showTranslations && translatingProject && (
        <ProjectTranslations
          project={translatingProject}
          onClose={() => {
            setShowTranslations(false);
            setTranslatingProject(null);
          }}
          onSave={() => {
            setShowTranslations(false);
            setTranslatingProject(null);
          }}
        />
      )}
    </div>
  );
};

export default ProjectManager;
