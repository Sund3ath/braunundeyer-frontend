import React, { useState } from 'react';
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

// Section Templates
const sectionTemplates = {
  hero: {
    name: 'Hero Section',
    icon: 'Layout',
    fields: ['title', 'subtitle', 'backgroundImage', 'ctaText', 'ctaLink']
  },
  textImage: {
    name: 'Text & Image',
    icon: 'Columns',
    fields: ['title', 'text', 'image', 'imagePosition']
  },
  gallery: {
    name: 'Image Gallery',
    icon: 'Grid',
    fields: ['title', 'description', 'images']
  },
  features: {
    name: 'Features Grid',
    icon: 'Grid3x3',
    fields: ['title', 'features']
  },
  testimonial: {
    name: 'Testimonial',
    icon: 'MessageSquare',
    fields: ['quote', 'author', 'role', 'image']
  },
  cta: {
    name: 'Call to Action',
    icon: 'Megaphone',
    fields: ['title', 'text', 'buttonText', 'buttonLink']
  },
  faq: {
    name: 'FAQ',
    icon: 'HelpCircle',
    fields: ['title', 'questions']
  },
  contact: {
    name: 'Contact Form',
    icon: 'Mail',
    fields: ['title', 'description', 'formFields']
  }
};

// Sortable Section Item
const SortableSection = ({ section, onEdit, onDelete, index }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };
  
  const template = sectionTemplates[section.type];
  
  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      className="bg-white border border-gray-200 rounded-lg overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div
            {...attributes}
            {...listeners}
            className="cursor-move text-gray-400 hover:text-gray-600"
          >
            <Icon name="GripVertical" size={20} />
          </div>
          <Icon name={template?.icon || 'Box'} size={20} className="text-gray-600" />
          <div>
            <h4 className="font-medium text-sm">{template?.name || section.type}</h4>
            <p className="text-xs text-gray-500">Section {index + 1}</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onEdit(section)}
            className="p-1 hover:bg-gray-200 rounded"
            title="Edit"
          >
            <Icon name="Edit2" size={16} />
          </button>
          <button
            onClick={() => onDelete(section.id)}
            className="p-1 hover:bg-red-100 rounded text-red-600"
            title="Delete"
          >
            <Icon name="Trash2" size={16} />
          </button>
        </div>
      </div>
      
      {/* Section Preview */}
      <div className="p-4">
        <div className="text-sm text-gray-600">
          {section.content?.title && (
            <p><strong>Title:</strong> {section.content.title}</p>
          )}
          {section.content?.subtitle && (
            <p><strong>Subtitle:</strong> {section.content.subtitle}</p>
          )}
          {section.visibility && (
            <p className="mt-2">
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                section.visibility === 'visible' 
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {section.visibility}
              </span>
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Section Editor Modal
const SectionEditorModal = ({ section, isOpen, onClose, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    type: 'textImage',
    content: {},
    visibility: 'visible',
    settings: {}
  });
  
  React.useEffect(() => {
    if (section) {
      setFormData(section);
    } else {
      setFormData({
        type: 'textImage',
        content: {},
        visibility: 'visible',
        settings: {}
      });
    }
  }, [section]);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };
  
  const template = sectionTemplates[formData.type];
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-[9995]"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl max-h-[80vh] overflow-y-auto bg-white rounded-xl shadow-2xl z-[9996]"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-heading font-light text-primary">
                  {section ? 'Edit Section' : 'Add Section'}
                </h2>
                <button
                  onClick={onClose}
                  className="p-1 hover:bg-gray-100 rounded-lg"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section Type */}
                {!section && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Section Type
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(sectionTemplates).map(([key, template]) => (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setFormData({ ...formData, type: key })}
                          className={`p-3 border rounded-lg text-center transition-all ${
                            formData.type === key
                              ? 'border-blue-500 bg-blue-50'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <Icon name={template.icon} size={24} className="mx-auto mb-1" />
                          <p className="text-xs">{template.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Dynamic Fields based on Section Type */}
                <div className="space-y-4">
                  {template?.fields.includes('title') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                      </label>
                      <input
                        type="text"
                        value={formData.content.title || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          content: { ...formData.content, title: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  
                  {template?.fields.includes('subtitle') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subtitle
                      </label>
                      <input
                        type="text"
                        value={formData.content.subtitle || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          content: { ...formData.content, subtitle: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  )}
                  
                  {template?.fields.includes('text') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Text Content
                      </label>
                      <textarea
                        value={formData.content.text || ''}
                        onChange={(e) => setFormData({
                          ...formData,
                          content: { ...formData.content, text: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                      />
                    </div>
                  )}
                  
                  {template?.fields.includes('imagePosition') && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Image Position
                      </label>
                      <select
                        value={formData.content.imagePosition || 'right'}
                        onChange={(e) => setFormData({
                          ...formData,
                          content: { ...formData.content, imagePosition: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="left">Left</option>
                        <option value="right">Right</option>
                      </select>
                    </div>
                  )}
                </div>
                
                {/* Visibility */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visibility
                  </label>
                  <select
                    value={formData.visibility}
                    onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="visible">Visible</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
                
                {/* Settings */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Section Settings
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.settings.fullWidth || false}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, fullWidth: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm">Full Width</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.settings.darkBackground || false}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, darkBackground: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm">Dark Background</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.settings.animate || false}
                        onChange={(e) => setFormData({
                          ...formData,
                          settings: { ...formData.settings, animate: e.target.checked }
                        })}
                        className="mr-2"
                      />
                      <span className="text-sm">Enable Animations</span>
                    </label>
                  </div>
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
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// Main EditableSection Component
const EditableSection = ({ pageId, children }) => {
  const { t } = useTranslation();
  const { isEditMode, markAsChanged } = useEditMode();
  const { sections, addSection, updateSection, deleteSection, reorderSections } = useCMSStore();
  
  const [showEditor, setShowEditor] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  
  const pageSections = sections[pageId] || [];
  const visibleSections = pageSections.filter(s => s.visibility === 'visible');
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );
  
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      const oldIndex = pageSections.findIndex(s => s.id === active.id);
      const newIndex = pageSections.findIndex(s => s.id === over.id);
      
      reorderSections(pageId, arrayMove(pageSections, oldIndex, newIndex));
      markAsChanged();
    }
  };
  
  const handleEdit = (section) => {
    setEditingSection(section);
    setShowEditor(true);
  };
  
  const handleDelete = (sectionId) => {
    if (window.confirm('Are you sure you want to delete this section?')) {
      deleteSection(pageId, sectionId);
      markAsChanged();
    }
  };
  
  const handleSave = (formData) => {
    if (editingSection) {
      updateSection(pageId, editingSection.id, formData);
    } else {
      addSection(pageId, formData);
    }
    markAsChanged();
    setEditingSection(null);
  };
  
  // Render sections in view mode
  if (!isEditMode) {
    return (
      <>
        {visibleSections.map(section => (
          <RenderSection key={section.id} section={section} />
        ))}
        {children}
      </>
    );
  }
  
  // Render sections in edit mode
  return (
    <div className="relative">
      {/* Add Section Button (Top) */}
      <div className="text-center py-4">
        <button
          onClick={() => {
            setEditingSection(null);
            setShowEditor(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 inline-flex items-center space-x-2"
        >
          <Icon name="Plus" size={20} />
          <span>{t('cms.addSection')}</span>
        </button>
      </div>
      
      {/* Sections List */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pageSections.map(s => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-4 mb-8">
            {pageSections.map((section, index) => (
              <SortableSection
                key={section.id}
                section={section}
                index={index}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      
      {/* Original Content */}
      <div className="border-t-2 border-gray-300 pt-8">
        <p className="text-sm text-gray-500 mb-4">Original Content (Below)</p>
        {children}
      </div>
      
      {/* Section Editor Modal */}
      <SectionEditorModal
        section={editingSection}
        isOpen={showEditor}
        onClose={() => {
          setShowEditor(false);
          setEditingSection(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
};

// Component to render sections based on type
const RenderSection = ({ section }) => {
  const { content, settings, type } = section;
  
  // Apply section settings
  const sectionClasses = `
    ${settings?.fullWidth ? 'w-full' : 'max-w-7xl mx-auto'}
    ${settings?.darkBackground ? 'bg-gray-900 text-white' : ''}
    ${settings?.animate ? 'animate-fade-in' : ''}
    py-16 lg:py-24 px-4 sm:px-6 lg:px-8
  `;
  
  switch (type) {
    case 'hero':
      return (
        <section className={sectionClasses}>
          <h1 className="text-4xl lg:text-6xl font-heading font-light mb-6">
            {content.title}
          </h1>
          <p className="text-xl lg:text-2xl mb-8">{content.subtitle}</p>
        </section>
      );
      
    case 'textImage':
      return (
        <section className={sectionClasses}>
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
            content.imagePosition === 'left' ? 'lg:flex-row-reverse' : ''
          }`}>
            <div>
              <h2 className="text-3xl lg:text-4xl font-heading font-light mb-6">
                {content.title}
              </h2>
              <p className="text-lg">{content.text}</p>
            </div>
            <div>
              {/* Image would go here */}
            </div>
          </div>
        </section>
      );
      
    case 'cta':
      return (
        <section className={`${sectionClasses} text-center`}>
          <h2 className="text-3xl lg:text-4xl font-heading font-light mb-6">
            {content.title}
          </h2>
          <p className="text-xl mb-8">{content.text}</p>
          <button className="px-8 py-4 bg-accent text-white rounded-lg hover:bg-accent/90">
            {content.buttonText}
          </button>
        </section>
      );
      
    default:
      return null;
  }
};

export default EditableSection;
