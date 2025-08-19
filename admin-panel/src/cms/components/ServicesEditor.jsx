import React, { useState, useEffect } from 'react';
import { API_BASE_URL, BACKEND_URL } from "../../config/api";
import Icon from 'components/AppIcon';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';

const ServicesEditor = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [processSteps, setProcessSteps] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingStep, setEditingStep] = useState(null);
  const [activeTab, setActiveTab] = useState('services');
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    fetchServicesData();
  }, []);

  const fetchServicesData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(API_BASE_URL + '/content/services', { headers });
      
      if (response.data && response.data.value) {
        const data = JSON.parse(response.data.value);
        setServices(data.services || []);
        setCategories(data.categories || []);
        setProcessSteps(data.processSteps || []);
      }
    } catch (error) {
      console.error('Error fetching services data:', error);
      // Initialize with default data if API fails
      setServices([
        {
          id: '1',
          title: 'Neubau',
          description: 'Moderne Neubauprojekte nach höchsten Standards',
          icon: 'Home',
          details: 'Wir planen und realisieren Neubauprojekte von der ersten Skizze bis zur Schlüsselübergabe.',
          features: ['Energieeffizient', 'Nachhaltig', 'Modern'],
          image: '/uploads/neubau.jpg'
        }
      ]);
      setCategories([
        { id: '1', name: 'Wohnbau', description: 'Private Wohnprojekte' },
        { id: '2', name: 'Gewerbebau', description: 'Büro- und Geschäftsgebäude' },
        { id: '3', name: 'Sanierung', description: 'Altbausanierung und Modernisierung' }
      ]);
      setProcessSteps([
        { id: '1', number: 1, title: 'Erstberatung', description: 'Kostenlose Erstberatung und Bedarfsanalyse' },
        { id: '2', number: 2, title: 'Konzept', description: 'Entwicklung des Architekturkonzepts' },
        { id: '3', number: 3, title: 'Planung', description: 'Detaillierte Ausführungsplanung' },
        { id: '4', number: 4, title: 'Umsetzung', description: 'Baubegleitung und Qualitätskontrolle' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const saveServicesData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = {
        services,
        categories,
        processSteps
      };
      
      await axios.post(
        API_BASE_URL + '/content',
        {
          key: 'services',
          value: JSON.stringify(data),
          language: 'de'
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      
      alert('Services configuration saved successfully!');
    } catch (error) {
      console.error('Error saving services data:', error);
      alert('Failed to save services configuration');
    } finally {
      setLoading(false);
    }
  };

  // Service Management
  const addService = () => {
    const newService = {
      id: Date.now().toString(),
      title: 'New Service',
      description: '',
      icon: 'Settings',
      details: '',
      features: [],
      image: null,
      order: services.length
    };
    setServices([...services, newService]);
    setEditingService(newService.id);
  };

  const updateService = (id, updates) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, ...updates } : service
    ));
  };

  const deleteService = (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(service => service.id !== id));
    }
  };

  const handleServiceImageUpload = async (serviceId, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      updateService(serviceId, { image: reader.result });
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // Category Management
  const addCategory = () => {
    const newCategory = {
      id: Date.now().toString(),
      name: 'New Category',
      description: '',
      icon: 'Folder'
    };
    setCategories([...categories, newCategory]);
    setEditingCategory(newCategory.id);
  };

  const updateCategory = (id, updates) => {
    setCategories(categories.map(cat => 
      cat.id === id ? { ...cat, ...updates } : cat
    ));
  };

  const deleteCategory = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
    }
  };

  // Process Steps Management
  const addProcessStep = () => {
    const newStep = {
      id: Date.now().toString(),
      number: processSteps.length + 1,
      title: 'New Step',
      description: '',
      icon: 'CheckCircle'
    };
    setProcessSteps([...processSteps, newStep]);
    setEditingStep(newStep.id);
  };

  const updateProcessStep = (id, updates) => {
    setProcessSteps(processSteps.map(step => 
      step.id === id ? { ...step, ...updates } : step
    ));
  };

  const deleteProcessStep = (id) => {
    if (window.confirm('Are you sure you want to delete this step?')) {
      setProcessSteps(processSteps.filter(step => step.id !== id));
    }
  };

  const handleServiceDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(services);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setServices(items.map((item, index) => ({ ...item, order: index })));
  };

  const handleStepDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(processSteps);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setProcessSteps(items.map((item, index) => ({ ...item, number: index + 1 })));
  };

  const availableIcons = ['Home', 'Building2', 'Palette', 'Users', 'Settings', 'Tool', 'Briefcase', 'Shield', 'Star', 'Award'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Services Editor</h2>
        <button
          onClick={saveServicesData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Icon name="Save" size={16} className="inline mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('services')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'services'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Services
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'categories'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Categories
          </button>
          <button
            onClick={() => setActiveTab('process')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'process'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Process Steps
          </button>
        </nav>
      </div>

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Services</h3>
            <button
              onClick={addService}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Icon name="Plus" size={16} className="inline mr-1" />
              Add Service
            </button>
          </div>

          <DragDropContext onDragEnd={handleServiceDragEnd}>
            <Droppable droppableId="services">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {services.map((service, index) => (
                    <Draggable key={service.id} draggableId={service.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`border rounded-lg p-4 ${
                            snapshot.isDragging ? 'shadow-lg bg-gray-50' : 'bg-white'
                          } ${editingService === service.id ? 'border-blue-500' : 'border-gray-200'}`}
                        >
                          <div className="flex items-start space-x-4">
                            <div {...provided.dragHandleProps} className="pt-2 cursor-move">
                              <Icon name="Menu" size={20} className="text-gray-400" />
                            </div>

                            {/* Service Preview/Edit */}
                            <div className="flex-1">
                              {editingService === service.id ? (
                                <div className="space-y-3">
                                  <div className="grid grid-cols-2 gap-3">
                                    <input
                                      type="text"
                                      value={service.title}
                                      onChange={(e) => updateService(service.id, { title: e.target.value })}
                                      placeholder="Service Title"
                                      className="px-3 py-2 border border-gray-300 rounded"
                                    />
                                    <select
                                      value={service.icon}
                                      onChange={(e) => updateService(service.id, { icon: e.target.value })}
                                      className="px-3 py-2 border border-gray-300 rounded"
                                    >
                                      {availableIcons.map(icon => (
                                        <option key={icon} value={icon}>{icon}</option>
                                      ))}
                                    </select>
                                  </div>
                                  
                                  <textarea
                                    value={service.description}
                                    onChange={(e) => updateService(service.id, { description: e.target.value })}
                                    placeholder="Short Description"
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                  />
                                  
                                  <textarea
                                    value={service.details}
                                    onChange={(e) => updateService(service.id, { details: e.target.value })}
                                    placeholder="Detailed Description"
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                  />
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Features (comma-separated)
                                    </label>
                                    <input
                                      type="text"
                                      value={service.features?.join(', ') || ''}
                                      onChange={(e) => updateService(service.id, { 
                                        features: e.target.value.split(',').map(f => f.trim()).filter(f => f)
                                      })}
                                      placeholder="Feature 1, Feature 2, Feature 3"
                                      className="w-full px-3 py-2 border border-gray-300 rounded"
                                    />
                                  </div>
                                  
                                  <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                      Service Image
                                    </label>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handleServiceImageUpload(service.id, e.target.files[0])}
                                      className="w-full px-3 py-2 border border-gray-300 rounded"
                                    />
                                    {service.image && (
                                      <img 
                                        src={service.image} 
                                        alt={service.title}
                                        className="mt-2 h-20 object-cover rounded"
                                      />
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="flex items-center space-x-3 mb-2">
                                    <Icon name={service.icon} size={24} className="text-blue-600" />
                                    <h4 className="font-medium text-lg">{service.title}</h4>
                                  </div>
                                  <p className="text-gray-600 mb-2">{service.description}</p>
                                  {service.features && service.features.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                      {service.features.map((feature, idx) => (
                                        <span key={idx} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                          {feature}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingService(editingService === service.id ? null : service.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Icon name={editingService === service.id ? 'Check' : 'Edit'} size={16} />
                              </button>
                              <button
                                onClick={() => deleteService(service.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Icon name="Trash2" size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}

      {/* Categories Tab */}
      {activeTab === 'categories' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Service Categories</h3>
            <button
              onClick={addCategory}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Icon name="Plus" size={16} className="inline mr-1" />
              Add Category
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map(category => (
              <div key={category.id} className="border rounded-lg p-4">
                {editingCategory === category.id ? (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={category.name}
                      onChange={(e) => updateCategory(category.id, { name: e.target.value })}
                      placeholder="Category Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    <textarea
                      value={category.description}
                      onChange={(e) => updateCategory(category.id, { description: e.target.value })}
                      placeholder="Description"
                      rows="2"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                ) : (
                  <div>
                    <h4 className="font-medium text-lg mb-1">{category.name}</h4>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                )}
                
                <div className="flex justify-end space-x-2 mt-3">
                  <button
                    onClick={() => setEditingCategory(editingCategory === category.id ? null : category.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Icon name={editingCategory === category.id ? 'Check' : 'Edit'} size={16} />
                  </button>
                  <button
                    onClick={() => deleteCategory(category.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Process Steps Tab */}
      {activeTab === 'process' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Process Steps</h3>
            <button
              onClick={addProcessStep}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Icon name="Plus" size={16} className="inline mr-1" />
              Add Step
            </button>
          </div>

          <DragDropContext onDragEnd={handleStepDragEnd}>
            <Droppable droppableId="process-steps">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {processSteps.map((step, index) => (
                    <Draggable key={step.id} draggableId={step.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`border rounded-lg p-4 ${
                            snapshot.isDragging ? 'shadow-lg bg-gray-50' : 'bg-white'
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div {...provided.dragHandleProps} className="cursor-move">
                              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                                {step.number}
                              </div>
                            </div>

                            <div className="flex-1">
                              {editingStep === step.id ? (
                                <div className="space-y-3">
                                  <input
                                    type="text"
                                    value={step.title}
                                    onChange={(e) => updateProcessStep(step.id, { title: e.target.value })}
                                    placeholder="Step Title"
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                  />
                                  <textarea
                                    value={step.description}
                                    onChange={(e) => updateProcessStep(step.id, { description: e.target.value })}
                                    placeholder="Step Description"
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded"
                                  />
                                </div>
                              ) : (
                                <div>
                                  <h4 className="font-medium text-lg mb-1">{step.title}</h4>
                                  <p className="text-gray-600">{step.description}</p>
                                </div>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingStep(editingStep === step.id ? null : step.id)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                              >
                                <Icon name={editingStep === step.id ? 'Check' : 'Edit'} size={16} />
                              </button>
                              <button
                                onClick={() => deleteProcessStep(step.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                              >
                                <Icon name="Trash2" size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      )}
    </div>
  );
};

export default ServicesEditor;
