import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Icon from 'components/AppIcon';
import axios from 'axios';

const TeamManager = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    position_en: '',
    position_fr: '',
    position_it: '',
    position_es: '',
    bio: '',
    bio_en: '',
    bio_fr: '',
    bio_it: '',
    bio_es: '',
    email: '',
    phone: '',
    linkedin: '',
    order_index: 0,
    is_active: true
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [activeTab, setActiveTab] = useState('de');

  const languages = [
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'it', name: 'Italiano', flag: '🇮🇹' },
    { code: 'es', name: 'Español', flag: '🇪🇸' }
  ];

  useEffect(() => {
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:3001/api/team?include_translations=true',
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const formDataToSend = new FormData();
      
      // Add all form fields
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Add image if selected
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      }
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      };
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      
      if (editingMember) {
        await axios.put(
          `http://localhost:3001/api/team/${editingMember.id}`,
          formDataToSend,
          config
        );
      } else {
        await axios.post(
          'http://localhost:3001/api/team',
          formDataToSend,
          config
        );
      }
      
      fetchTeamMembers();
      resetForm();
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this team member?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:3001/api/team/${id}`,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      fetchTeamMembers();
    } catch (error) {
      console.error('Error deleting team member:', error);
    }
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setFormData({
      name: member.name || '',
      position: member.translations?.position?.de || member.position || '',
      position_en: member.translations?.position?.en || '',
      position_fr: member.translations?.position?.fr || '',
      position_it: member.translations?.position?.it || '',
      position_es: member.translations?.position?.es || '',
      bio: member.translations?.bio?.de || member.bio || '',
      bio_en: member.translations?.bio?.en || '',
      bio_fr: member.translations?.bio?.fr || '',
      bio_it: member.translations?.bio?.it || '',
      bio_es: member.translations?.bio?.es || '',
      email: member.email || '',
      phone: member.phone || '',
      linkedin: member.linkedin || '',
      order_index: member.order_index || 0,
      is_active: member.is_active !== undefined ? member.is_active : true
    });
    setImagePreview(member.image ? `http://localhost:3001${member.image}` : null);
    setShowForm(true);
  };

  const resetForm = () => {
    setEditingMember(null);
    setFormData({
      name: '',
      position: '',
      position_en: '',
      position_fr: '',
      position_it: '',
      position_es: '',
      bio: '',
      bio_en: '',
      bio_fr: '',
      bio_it: '',
      bio_es: '',
      email: '',
      phone: '',
      linkedin: '',
      order_index: 0,
      is_active: true
    });
    setImageFile(null);
    setImagePreview(null);
    setShowForm(false);
    setActiveTab('de');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };


  const getFieldForLanguage = (field, lang) => {
    if (lang === 'de') return formData[field];
    return formData[`${field}_${lang}`];
  };

  const setFieldForLanguage = (field, value, lang) => {
    if (lang === 'de') {
      setFormData(prev => ({ ...prev, [field]: value }));
    } else {
      setFormData(prev => ({ ...prev, [`${field}_${lang}`]: value }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-900">Team Members</h2>
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
        >
          <Icon name="Plus" size={20} />
          <span>Add Team Member</span>
        </button>
      </div>

      {/* Team Members List */}
      <div className="grid gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              {/* Image */}
              <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                {member.image ? (
                  <img
                    src={`http://localhost:3001${member.image}`}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Icon name="User" size={24} className="text-gray-400" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{member.name}</h3>
                <p className="text-sm text-gray-600">{member.position}</p>
                <p className="text-xs text-gray-500">{member.email}</p>
              </div>

              {/* Status */}
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  member.is_active 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {member.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(member)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <Icon name="Edit" size={16} />
                </button>
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <form onSubmit={handleSubmit}>
                {/* Header */}
                <div className="px-6 py-4 border-b flex items-center justify-between">
                  <h3 className="text-xl font-semibold">
                    {editingMember ? 'Edit Team Member' : 'Add Team Member'}
                  </h3>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <Icon name="X" size={20} />
                  </button>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Profile Image
                      </label>
                      <div className="flex items-center space-x-4">
                        {imagePreview && (
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-16 h-16 rounded-full object-cover"
                          />
                        )}
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="flex-1"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={formData.linkedin}
                        onChange={(e) => setFormData(prev => ({ ...prev, linkedin: e.target.value }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Status
                      </label>
                      <select
                        value={formData.is_active}
                        onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>

                  {/* Language Tabs */}
                  <div>
                    <div className="flex space-x-1 border-b">
                      {languages.map(lang => (
                        <button
                          key={lang.code}
                          type="button"
                          onClick={() => setActiveTab(lang.code)}
                          className={`px-4 py-2 font-medium transition-colors ${
                            activeTab === lang.code
                              ? 'border-b-2 border-blue-600 text-blue-600'
                              : 'text-gray-600 hover:text-gray-900'
                          }`}
                        >
                          <span className="mr-2">{lang.flag}</span>
                          {lang.name}
                        </button>
                      ))}
                    </div>

                    {/* Language-specific fields */}
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Position ({languages.find(l => l.code === activeTab)?.name}) *
                        </label>
                        <input
                          type="text"
                          value={getFieldForLanguage('position', activeTab)}
                          onChange={(e) => setFieldForLanguage('position', e.target.value, activeTab)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          required={activeTab === 'de'}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio ({languages.find(l => l.code === activeTab)?.name})
                        </label>
                        <textarea
                          value={getFieldForLanguage('bio', activeTab)}
                          onChange={(e) => setFieldForLanguage('bio', e.target.value, activeTab)}
                          rows={4}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    {editingMember ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamManager;