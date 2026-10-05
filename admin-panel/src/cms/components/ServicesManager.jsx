import React, { useState, useEffect } from 'react';
import { API_BASE_URL, BACKEND_URL } from "../../config/api";
import { motion, AnimatePresence } from 'framer-motion';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Icon from 'components/AppIcon';
import axios from 'axios';
import useCMSStore from '../store/cmsStore';
import MediaLibraryEnhanced from './MediaLibraryEnhanced';

// Sortable Service Card
const SortableServiceCard = ({ id, service, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3"
    >
      <div className="flex items-start justify-between">
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-move flex-1"
        >
          <div className="flex items-center space-x-3">
            <Icon name="GripVertical" size={20} className="text-gray-400" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900">{service.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{service.description}</p>
              {service.features && service.features.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {service.features.map((feature, idx) => (
                    <span key={idx} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                      {feature}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2 ml-4">
          <button
            onClick={() => onEdit(service)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Icon name="Edit2" size={18} />
          </button>
          <button
            onClick={() => onDelete(service.id)}
            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <Icon name="Trash2" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Sortable Process Step
const SortableProcessStep = ({ id, step, onEdit, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3"
    >
      <div className="flex items-center justify-between">
        <div 
          {...attributes} 
          {...listeners}
          className="cursor-move flex-1 flex items-center space-x-3"
        >
          <Icon name="GripVertical" size={20} className="text-gray-400" />
          <div className="flex items-center space-x-4">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
              {step.number}
            </div>
            <div>
              <h4 className="font-semibold text-gray-900">{step.title}</h4>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(step)}
            className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
          >
            <Icon name="Edit2" size={18} />
          </button>
          <button
            onClick={() => onDelete(step.id)}
            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <Icon name="Trash2" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

const ServicesManager = () => {
  const { uploadMedia, media } = useCMSStore();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('services');
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [processSteps, setProcessSteps] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingStep, setEditingStep] = useState(null);
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showStepModal, setShowStepModal] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null);
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedMediaFor, setSelectedMediaFor] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Load services configuration
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${API_BASE_URL}/content/services`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data && response.data.value) {
        const data = JSON.parse(response.data.value);
        setServices(data.services || []);
        setCategories(data.categories || []);
        setProcessSteps(data.processSteps || []);
      }
    } catch (error) {
      console.error('Error loading services:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveServices = async () => {
    setLoading(true);
    setSaveStatus('saving');
    try {
      const token = localStorage.getItem('token');
      const data = {
        services,
        categories,
        processSteps
      };

      await axios.post(
        `${API_BASE_URL}/content/services`,
        {
          key: 'services',
          value: JSON.stringify(data),
          language: 'de'
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2000);
    } catch (error) {
      console.error('Error saving services:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(null), 3000);
    } finally {
      setLoading(false);
    }
  };

  // Handle image upload for service
  const handleImageUpload = async (file) => {
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const uploadedMedia = await uploadMedia(file, { 
        type: 'services',
        alt: editingService?.title || 'Service image'
      });
      
      if (editingService) {
        setEditingService({
          ...editingService,
          image: uploadedMedia.url
        });
      }
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  // Handle image selection from media library
  const handleMediaSelect = (mediaItem) => {
    if (editingService && selectedMediaFor === 'service') {
      setEditingService({
        ...editingService,
        image: mediaItem.url
      });
    }
    setShowMediaLibrary(false);
    setSelectedMediaFor(null);
  };

  // Service CRUD operations
  const handleAddService = () => {
    setEditingService({
      id: Date.now().toString(),
      title: '',
      description: '',
      icon: 'Home',
      details: '',
      features: [],
      image: ''
    });
    setShowServiceModal(true);
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setShowServiceModal(true);
  };

  const handleSaveService = () => {
    if (editingService.title && editingService.description) {
      const existingIndex = services.findIndex(s => s.id === editingService.id);
      if (existingIndex >= 0) {
        const updatedServices = [...services];
        updatedServices[existingIndex] = editingService;
        setServices(updatedServices);
      } else {
        setServices([...services, editingService]);
      }
      setShowServiceModal(false);
      setEditingService(null);
      saveServices();
    }
  };

  const handleDeleteService = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(s => s.id !== id));
      saveServices();
    }
  };

  // Category CRUD operations
  const handleAddCategory = () => {
    setEditingCategory({
      id: Date.now().toString(),
      name: '',
      description: ''
    });
    setShowCategoryModal(true);
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setShowCategoryModal(true);
  };

  const handleSaveCategory = () => {
    if (editingCategory.name) {
      const existingIndex = categories.findIndex(c => c.id === editingCategory.id);
      if (existingIndex >= 0) {
        const updatedCategories = [...categories];
        updatedCategories[existingIndex] = editingCategory;
        setCategories(updatedCategories);
      } else {
        setCategories([...categories, editingCategory]);
      }
      setShowCategoryModal(false);
      setEditingCategory(null);
      saveServices();
    }
  };

  const handleDeleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(c => c.id !== id));
      saveServices();
    }
  };

  // Process Step CRUD operations
  const handleAddStep = () => {
    const maxNumber = Math.max(...processSteps.map(s => s.number), 0);
    setEditingStep({
      id: Date.now().toString(),
      number: maxNumber + 1,
      title: '',
      description: ''
    });
    setShowStepModal(true);
  };

  const handleEditStep = (step) => {
    setEditingStep(step);
    setShowStepModal(true);
  };

  const handleSaveStep = () => {
    if (editingStep.title && editingStep.description) {
      const existingIndex = processSteps.findIndex(s => s.id === editingStep.id);
      if (existingIndex >= 0) {
        const updatedSteps = [...processSteps];
        updatedSteps[existingIndex] = editingStep;
        setProcessSteps(updatedSteps);
      } else {
        setProcessSteps([...processSteps, editingStep]);
      }
      setShowStepModal(false);
      setEditingStep(null);
      saveServices();
    }
  };

  const handleDeleteStep = (id) => {
    if (window.confirm('Are you sure you want to delete this process step?')) {
      setProcessSteps(processSteps.filter(s => s.id !== id));
      saveServices();
    }
  };

  // Drag and drop handlers
  const handleServiceDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = services.findIndex(s => s.id === active.id);
      const newIndex = services.findIndex(s => s.id === over.id);
      const newServices = arrayMove(services, oldIndex, newIndex);
      setServices(newServices);
      saveServices();
    }
  };

  const handleStepDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = processSteps.findIndex(s => s.id === active.id);
      const newIndex = processSteps.findIndex(s => s.id === over.id);
      const newSteps = arrayMove(processSteps, oldIndex, newIndex);
      // Update step numbers
      newSteps.forEach((step, index) => {
        step.number = index + 1;
      });
      setProcessSteps(newSteps);
      saveServices();
    }
  };

  const iconOptions = [
    'Home', 'Building2', 'Hammer', 'Wrench', 'PaintBucket', 
    'Ruler', 'Layout', 'Grid3x3', 'Package', 'Settings'
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-heading">Services Management</h2>
          {saveStatus && (
            <div className={`px-4 py-2 rounded-lg text-sm font-medium ${
              saveStatus === 'saving' ? 'bg-yellow-100 text-yellow-700' :
              saveStatus === 'saved' ? 'bg-green-100 text-green-700' :
              'bg-red-100 text-red-700'
            }`}>
              {saveStatus === 'saving' ? 'Saving...' :
               saveStatus === 'saved' ? 'Saved successfully!' :
               'Error saving changes'}
            </div>
          )}
        </div>
        <p className="text-gray-600">
          Manage your service offerings, categories, and process steps
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {['services', 'categories', 'process'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab === 'services' ? 'Services' :
               tab === 'categories' ? 'Categories' :
               'Process Steps'}
              {tab === 'services' && ` (${services.length})`}
              {tab === 'categories' && ` (${categories.length})`}
              {tab === 'process' && ` (${processSteps.length})`}
            </button>
          ))}
        </nav>
      </div>

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Service Offerings</h3>
            <button
              onClick={handleAddService}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Icon name="Plus" size={20} />
              <span>Add Service</span>
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleServiceDragEnd}
          >
            <SortableContext
              items={services.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {services.map((service) => (
                <SortableServiceCard
                  key={service.id}
                  id={service.id}
                  service={service}
                  onEdit={handleEditService}
                  onDelete={handleDeleteService}
                />
              ))}
            </SortableContext>
          </DndContext>

          {services.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Icon name="Package" size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No services added yet</p>
              <button
                onClick={handleAddService}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                Add your first service
              </button>
            </div>
          )}
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Service Categories</h3>
            <button
              onClick={handleAddCategory}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Icon name="Plus" size={20} />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{category.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{category.description}</p>
                  </div>
                  <div className="flex items-center space-x-1 ml-2">
                    <button
                      onClick={() => handleEditCategory(category)}
                      className="p-1 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                      <Icon name="Edit2" size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category.id)}
                      className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Icon name="Trash2" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {categories.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Icon name="Folder" size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No categories added yet</p>
              <button
                onClick={handleAddCategory}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                Add your first category
              </button>
            </div>
          )}
        </div>
      )}

      {/* Process Steps Tab */}
      {activeTab === 'process' && (
        <div>
          <div className="mb-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold">Process Steps</h3>
            <button
              onClick={handleAddStep}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            >
              <Icon name="Plus" size={20} />
              <span>Add Step</span>
            </button>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleStepDragEnd}
          >
            <SortableContext
              items={processSteps.map(s => s.id)}
              strategy={verticalListSortingStrategy}
            >
              {processSteps.map((step) => (
                <SortableProcessStep
                  key={step.id}
                  id={step.id}
                  step={step}
                  onEdit={handleEditStep}
                  onDelete={handleDeleteStep}
                />
              ))}
            </SortableContext>
          </DndContext>

          {processSteps.length === 0 && (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Icon name="List" size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600">No process steps added yet</p>
              <button
                onClick={handleAddStep}
                className="mt-4 text-blue-600 hover:text-blue-700"
              >
                Add your first step
              </button>
            </div>
          )}
        </div>
      )}

      {/* Service Modal */}
      <AnimatePresence>
        {showServiceModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowServiceModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {editingService?.id && services.find(s => s.id === editingService.id) ? 'Edit Service' : 'Add New Service'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingService?.title || ''}
                      onChange={(e) => setEditingService({...editingService, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Service title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editingService?.description || ''}
                      onChange={(e) => setEditingService({...editingService, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Brief description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
                    <textarea
                      value={editingService?.details || ''}
                      onChange={(e) => setEditingService({...editingService, details: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="4"
                      placeholder="Detailed description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                    <select
                      value={editingService?.icon || 'Home'}
                      onChange={(e) => setEditingService({...editingService, icon: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Features (comma-separated)</label>
                    <input
                      type="text"
                      value={editingService?.features?.join(', ') || ''}
                      onChange={(e) => setEditingService({
                        ...editingService, 
                        features: e.target.value.split(',').map(f => f.trim()).filter(f => f)
                      })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Feature 1, Feature 2, Feature 3"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Service Image</label>
                    <div className="space-y-2">
                      {/* Current Image Preview */}
                      {editingService?.image && (
                        <div className="relative">
                          <img
                            src={editingService.image.startsWith('http') ? editingService.image : `${BACKEND_URL}${editingService.image}`}
                            alt="Service"
                            className="w-full h-40 object-cover rounded-lg border border-gray-300"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="160" viewBox="0 0 200 160"%3E%3Crect width="200" height="160" fill="%23f3f4f6"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="system-ui" font-size="14"%3ENo Image%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => setEditingService({...editingService, image: ''})}
                            className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                          >
                            <Icon name="X" size={16} />
                          </button>
                        </div>
                      )}
                      
                      {/* Upload and Select Buttons */}
                      <div className="flex space-x-2">
                        <label className="flex-1">
                          <span className="block px-4 py-2 bg-blue-600 text-white text-center rounded-lg hover:bg-blue-700 cursor-pointer">
                            <Icon name="Upload" size={16} className="inline mr-2" />
                            {uploadingImage ? 'Uploading...' : 'Upload Image'}
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleImageUpload(e.target.files[0])}
                            className="hidden"
                            disabled={uploadingImage}
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedMediaFor('service');
                            setShowMediaLibrary(true);
                          }}
                          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                          <Icon name="Image" size={16} className="inline mr-2" />
                          Select from Library
                        </button>
                      </div>
                      
                      {/* Manual URL Input */}
                      <input
                        type="text"
                        value={editingService?.image || ''}
                        onChange={(e) => setEditingService({...editingService, image: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                        placeholder="Or enter image URL directly..."
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowServiceModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveService}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Service
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Modal */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCategoryModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {editingCategory?.id && categories.find(c => c.id === editingCategory.id) ? 'Edit Category' : 'Add New Category'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={editingCategory?.name || ''}
                      onChange={(e) => setEditingCategory({...editingCategory, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Category name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editingCategory?.description || ''}
                      onChange={(e) => setEditingCategory({...editingCategory, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Category description"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowCategoryModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveCategory}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Category
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Process Step Modal */}
      <AnimatePresence>
        {showStepModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowStepModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4">
                  {editingStep?.id && processSteps.find(s => s.id === editingStep.id) ? 'Edit Process Step' : 'Add New Step'}
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Step Number</label>
                    <input
                      type="number"
                      value={editingStep?.number || 1}
                      onChange={(e) => setEditingStep({...editingStep, number: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                    <input
                      type="text"
                      value={editingStep?.title || ''}
                      onChange={(e) => setEditingStep({...editingStep, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Step title"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                      value={editingStep?.description || ''}
                      onChange={(e) => setEditingStep({...editingStep, description: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows="3"
                      placeholder="Step description"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button
                    onClick={() => setShowStepModal(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveStep}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Save Step
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Media Library Modal */}
      {showMediaLibrary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-xl font-semibold">Select Image from Library</h3>
              <button
                onClick={() => {
                  setShowMediaLibrary(false);
                  setSelectedMediaFor(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Icon name="X" size={20} />
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)]">
              <MediaLibraryEnhanced
                onSelectMedia={handleMediaSelect}
                selectionMode="single"
                fileTypes={['image']}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicesManager;