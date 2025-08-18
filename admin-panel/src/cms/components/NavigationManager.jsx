import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import axios from 'axios';

const NavigationManager = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('main');
  const [menuItems, setMenuItems] = useState([]);
  const [footerMenuItems, setFooterMenuItems] = useState([]);
  const [mobileMenuItems, setMobileMenuItems] = useState([]);
  const [editingItem, setEditingItem] = useState(null);
  const [expandedItems, setExpandedItems] = useState({});

  const languages = ['de', 'en', 'fr', 'it', 'es'];
  const linkTypes = ['internal', 'external', 'anchor', 'dropdown'];
  
  // Default menu structure
  const defaultMenuItems = [
    {
      id: '1',
      label: { de: 'Startseite', en: 'Home', fr: 'Accueil', it: 'Home', es: 'Inicio' },
      url: { de: '/de/homepage', en: '/en/homepage', fr: '/fr/homepage', it: '/it/homepage', es: '/es/homepage' },
      type: 'internal',
      icon: 'Home',
      visible: true,
      order: 0,
      children: []
    },
    {
      id: '2',
      label: { de: 'Projekte', en: 'Projects', fr: 'Projets', it: 'Progetti', es: 'Proyectos' },
      url: { de: '/de/projekte', en: '/en/projects', fr: '/fr/projets', it: '/it/progetti', es: '/es/proyectos' },
      type: 'internal',
      icon: 'Folder',
      visible: true,
      order: 1,
      children: []
    },
    {
      id: '3',
      label: { de: 'Leistungen', en: 'Services', fr: 'Services', it: 'Servizi', es: 'Servicios' },
      url: { de: '/de/leistungen', en: '/en/services', fr: '/fr/services', it: '/it/servizi', es: '/es/servicios' },
      type: 'dropdown',
      icon: 'Briefcase',
      visible: true,
      order: 2,
      children: [
        {
          id: '3-1',
          label: { de: 'Neubau', en: 'New Construction', fr: 'Construction neuve', it: 'Nuova costruzione', es: 'Nueva construcción' },
          url: { de: '/de/leistungen/neubau', en: '/en/services/new-construction' },
          type: 'internal',
          visible: true,
          order: 0
        },
        {
          id: '3-2',
          label: { de: 'Sanierung', en: 'Renovation', fr: 'Rénovation', it: 'Ristrutturazione', es: 'Renovación' },
          url: { de: '/de/leistungen/sanierung', en: '/en/services/renovation' },
          type: 'internal',
          visible: true,
          order: 1
        }
      ]
    },
    {
      id: '4',
      label: { de: 'Über uns', en: 'About', fr: 'À propos', it: 'Chi siamo', es: 'Nosotros' },
      url: { de: '/de/ueber-uns', en: '/en/about', fr: '/fr/a-propos', it: '/it/chi-siamo', es: '/es/nosotros' },
      type: 'internal',
      icon: 'Users',
      visible: true,
      order: 3,
      children: []
    },
    {
      id: '5',
      label: { de: 'Kontakt', en: 'Contact', fr: 'Contact', it: 'Contatto', es: 'Contacto' },
      url: { de: '/de/kontakt', en: '/en/contact', fr: '/fr/contact', it: '/it/contatto', es: '/es/contacto' },
      type: 'internal',
      icon: 'Mail',
      visible: true,
      order: 4,
      children: []
    }
  ];

  useEffect(() => {
    fetchNavigationData();
  }, []);

  const fetchNavigationData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get('http://localhost:3001/api/content/navigation', { headers });
      
      if (response.data && response.data.value) {
        const data = JSON.parse(response.data.value);
        setMenuItems(data.mainMenu || defaultMenuItems);
        setFooterMenuItems(data.footerMenu || createFooterMenu());
        setMobileMenuItems(data.mobileMenu || data.mainMenu || defaultMenuItems);
      } else {
        // Initialize with defaults
        setMenuItems(defaultMenuItems);
        setFooterMenuItems(createFooterMenu());
        setMobileMenuItems(defaultMenuItems);
      }
    } catch (error) {
      console.error('Error fetching navigation:', error);
      // Initialize with defaults on error
      setMenuItems(defaultMenuItems);
      setFooterMenuItems(createFooterMenu());
      setMobileMenuItems(defaultMenuItems);
    } finally {
      setLoading(false);
    }
  };

  const createFooterMenu = () => {
    return [
      {
        id: 'f1',
        label: { de: 'Impressum', en: 'Imprint', fr: 'Mentions légales', it: 'Impronta', es: 'Aviso legal' },
        url: { de: '/de/impressum', en: '/en/imprint' },
        type: 'internal',
        visible: true,
        order: 0
      },
      {
        id: 'f2',
        label: { de: 'Datenschutz', en: 'Privacy', fr: 'Confidentialité', it: 'Privacy', es: 'Privacidad' },
        url: { de: '/de/datenschutz', en: '/en/privacy' },
        type: 'internal',
        visible: true,
        order: 1
      }
    ];
  };

  const saveNavigationData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = {
        mainMenu: menuItems,
        footerMenu: footerMenuItems,
        mobileMenu: mobileMenuItems
      };
      
      await axios.post(
        'http://localhost:3001/api/content',
        {
          key: 'navigation',
          value: JSON.stringify(data),
          language: 'de'
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      
      alert('Navigation settings saved successfully!');
    } catch (error) {
      console.error('Error saving navigation:', error);
      alert('Failed to save navigation settings');
    } finally {
      setLoading(false);
    }
  };

  const addMenuItem = (parentId = null) => {
    const newItem = {
      id: Date.now().toString(),
      label: { de: 'Neuer Link', en: 'New Link', fr: 'Nouveau lien', it: 'Nuovo link', es: 'Nuevo enlace' },
      url: { de: '#', en: '#', fr: '#', it: '#', es: '#' },
      type: 'internal',
      visible: true,
      order: parentId ? 0 : menuItems.length,
      children: []
    };

    if (parentId) {
      // Add as child
      const updateItemChildren = (items) => {
        return items.map(item => {
          if (item.id === parentId) {
            return { ...item, children: [...(item.children || []), newItem] };
          }
          if (item.children && item.children.length > 0) {
            return { ...item, children: updateItemChildren(item.children) };
          }
          return item;
        });
      };
      
      if (activeTab === 'main') {
        setMenuItems(updateItemChildren(menuItems));
      } else if (activeTab === 'footer') {
        setFooterMenuItems(updateItemChildren(footerMenuItems));
      } else {
        setMobileMenuItems(updateItemChildren(mobileMenuItems));
      }
    } else {
      // Add to root level
      if (activeTab === 'main') {
        setMenuItems([...menuItems, newItem]);
      } else if (activeTab === 'footer') {
        setFooterMenuItems([...footerMenuItems, newItem]);
      } else {
        setMobileMenuItems([...mobileMenuItems, newItem]);
      }
    }
    
    setEditingItem(newItem.id);
  };

  const updateMenuItem = (id, field, value, lang = null) => {
    const updateItem = (items) => {
      return items.map(item => {
        if (item.id === id) {
          if (lang && (field === 'label' || field === 'url')) {
            return {
              ...item,
              [field]: { ...item[field], [lang]: value }
            };
          }
          return { ...item, [field]: value };
        }
        if (item.children && item.children.length > 0) {
          return { ...item, children: updateItem(item.children) };
        }
        return item;
      });
    };

    if (activeTab === 'main') {
      setMenuItems(updateItem(menuItems));
    } else if (activeTab === 'footer') {
      setFooterMenuItems(updateItem(footerMenuItems));
    } else {
      setMobileMenuItems(updateItem(mobileMenuItems));
    }
  };

  const deleteMenuItem = (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;

    const deleteItem = (items) => {
      return items.filter(item => {
        if (item.id === id) return false;
        if (item.children && item.children.length > 0) {
          item.children = deleteItem(item.children);
        }
        return true;
      });
    };

    if (activeTab === 'main') {
      setMenuItems(deleteItem(menuItems));
    } else if (activeTab === 'footer') {
      setFooterMenuItems(deleteItem(footerMenuItems));
    } else {
      setMobileMenuItems(deleteItem(mobileMenuItems));
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const items = activeTab === 'main' ? [...menuItems] : 
                 activeTab === 'footer' ? [...footerMenuItems] : [...mobileMenuItems];
    
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Update order values
    const orderedItems = items.map((item, index) => ({ ...item, order: index }));
    
    if (activeTab === 'main') {
      setMenuItems(orderedItems);
    } else if (activeTab === 'footer') {
      setFooterMenuItems(orderedItems);
    } else {
      setMobileMenuItems(orderedItems);
    }
  };

  const toggleExpanded = (id) => {
    setExpandedItems({ ...expandedItems, [id]: !expandedItems[id] });
  };

  const renderMenuItem = (item, index, isChild = false) => {
    const isEditing = editingItem === item.id;
    const isExpanded = expandedItems[item.id];
    const hasChildren = item.children && item.children.length > 0;

    return (
      <Draggable key={item.id} draggableId={item.id} index={index} isDragDisabled={isChild}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`mb-2 ${isChild ? 'ml-8' : ''}`}
          >
            <div className={`border rounded-lg p-4 ${
              snapshot.isDragging ? 'shadow-lg bg-gray-50' : 'bg-white'
            } ${isEditing ? 'border-blue-500' : 'border-gray-200'}`}>
              <div className="flex items-start space-x-3">
                {!isChild && (
                  <div {...provided.dragHandleProps} className="pt-1 cursor-move">
                    <Icon name="Menu" size={20} className="text-gray-400" />
                  </div>
                )}

                <div className="flex-1">
                  {isEditing ? (
                    <div className="space-y-3">
                      {/* Type Selection */}
                      <select
                        value={item.type}
                        onChange={(e) => updateMenuItem(item.id, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                      >
                        <option value="internal">Internal Link</option>
                        <option value="external">External Link</option>
                        <option value="anchor">Anchor Link</option>
                        <option value="dropdown">Dropdown Menu</option>
                      </select>

                      {/* Multilingual Labels */}
                      <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Labels</label>
                        {languages.map(lang => (
                          <div key={lang} className="flex items-center space-x-2">
                            <span className="w-8 text-xs font-medium">{lang.toUpperCase()}</span>
                            <input
                              type="text"
                              value={item.label[lang] || ''}
                              onChange={(e) => updateMenuItem(item.id, 'label', e.target.value, lang)}
                              placeholder={`Label (${lang})`}
                              className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        ))}
                      </div>

                      {/* URLs (if not dropdown) */}
                      {item.type !== 'dropdown' && (
                        <div className="space-y-2">
                          <label className="block text-sm font-medium text-gray-700">URLs</label>
                          {languages.map(lang => (
                            <div key={lang} className="flex items-center space-x-2">
                              <span className="w-8 text-xs font-medium">{lang.toUpperCase()}</span>
                              <input
                                type="text"
                                value={item.url[lang] || ''}
                                onChange={(e) => updateMenuItem(item.id, 'url', e.target.value, lang)}
                                placeholder={`URL (${lang})`}
                                className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
                              />
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Icon Selection */}
                      {!isChild && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
                          <select
                            value={item.icon || 'Link'}
                            onChange={(e) => updateMenuItem(item.id, 'icon', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded"
                          >
                            <option value="Home">Home</option>
                            <option value="Folder">Folder</option>
                            <option value="Briefcase">Briefcase</option>
                            <option value="Users">Users</option>
                            <option value="Mail">Mail</option>
                            <option value="Info">Info</option>
                            <option value="Link">Link</option>
                            <option value="ExternalLink">External Link</option>
                          </select>
                        </div>
                      )}

                      {/* Visibility Toggle */}
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={item.visible}
                          onChange={(e) => updateMenuItem(item.id, 'visible', e.target.checked)}
                          className="mr-2"
                        />
                        Visible in menu
                      </label>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        {item.icon && <Icon name={item.icon} size={16} className="text-gray-600" />}
                        <span className="font-medium">{item.label.de}</span>
                        {item.type === 'external' && <Icon name="ExternalLink" size={14} className="text-gray-400" />}
                        {item.type === 'dropdown' && <Icon name="ChevronDown" size={14} className="text-gray-400" />}
                        {!item.visible && (
                          <span className="text-xs bg-gray-200 text-gray-600 px-2 py-1 rounded">Hidden</span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{item.url?.de || 'Dropdown menu'}</p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1">
                  {item.type === 'dropdown' && (
                    <button
                      onClick={() => toggleExpanded(item.id)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <Icon name={isExpanded ? 'ChevronUp' : 'ChevronDown'} size={16} />
                    </button>
                  )}
                  
                  {item.type === 'dropdown' && (
                    <button
                      onClick={() => addMenuItem(item.id)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded"
                      title="Add submenu item"
                    >
                      <Icon name="Plus" size={16} />
                    </button>
                  )}
                  
                  <button
                    onClick={() => setEditingItem(isEditing ? null : item.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <Icon name={isEditing ? 'Check' : 'Edit'} size={16} />
                  </button>
                  
                  <button
                    onClick={() => deleteMenuItem(item.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                </div>
              </div>

              {/* Children */}
              {hasChildren && isExpanded && (
                <div className="mt-4 pl-8 border-l-2 border-gray-200">
                  {item.children.map((child, childIndex) => 
                    renderMenuItem(child, childIndex, true)
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </Draggable>
    );
  };

  const currentItems = activeTab === 'main' ? menuItems :
                       activeTab === 'footer' ? footerMenuItems : mobileMenuItems;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Navigation Manager</h2>
        <button
          onClick={saveNavigationData}
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
            onClick={() => setActiveTab('main')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'main'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Main Menu
          </button>
          <button
            onClick={() => setActiveTab('footer')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'footer'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Footer Menu
          </button>
          <button
            onClick={() => setActiveTab('mobile')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'mobile'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Mobile Menu
          </button>
        </nav>
      </div>

      {/* Menu Items */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">
            {activeTab === 'main' ? 'Main Navigation' :
             activeTab === 'footer' ? 'Footer Links' : 'Mobile Navigation'}
          </h3>
          <button
            onClick={() => addMenuItem()}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Icon name="Plus" size={16} className="inline mr-1" />
            Add Item
          </button>
        </div>

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId={`menu-${activeTab}`}>
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {currentItems.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No menu items yet. Click "Add Item" to create one.
                  </div>
                ) : (
                  currentItems.map((item, index) => renderMenuItem(item, index))
                )}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
    </div>
  );
};

export default NavigationManager;