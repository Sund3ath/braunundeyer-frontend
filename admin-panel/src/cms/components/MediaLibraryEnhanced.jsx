import React, { useState, useEffect, useCallback } from 'react';
import Icon from 'components/AppIcon';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const MediaLibraryEnhanced = () => {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [view, setView] = useState('grid'); // grid, list
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingFile, setEditingFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState({});
  
  const [mediaFiles, setMediaFiles] = useState([]);
  const [categories, setCategories] = useState([
    { id: 'all', name: 'All Files', count: 0 },
    { id: 'images', name: 'Images', count: 0 },
    { id: 'videos', name: 'Videos', count: 0 },
    { id: 'documents', name: 'Documents', count: 0 },
    { id: 'projects', name: 'Project Images', count: 0 },
    { id: 'team', name: 'Team Photos', count: 0 },
    { id: 'hero', name: 'Hero Images', count: 0 },
    { id: 'gallery', name: 'Gallery', count: 0 }
  ]);

  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');

  useEffect(() => {
    fetchMediaFiles();
  }, []);

  const fetchMediaFiles = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get('http://localhost:3001/api/media', { headers });
      
      if (response.data) {
        const files = response.data.map(file => ({
          ...file,
          category: file.category || detectCategory(file),
          tags: file.tags || [],
          altText: file.altText || {}
        }));
        setMediaFiles(files);
        updateCategoryCounts(files);
      }
    } catch (error) {
      console.error('Error fetching media files:', error);
    } finally {
      setLoading(false);
    }
  };

  const detectCategory = (file) => {
    const type = file.mimetype || file.type || '';
    if (type.startsWith('image/')) return 'images';
    if (type.startsWith('video/')) return 'videos';
    if (type.includes('pdf') || type.includes('document')) return 'documents';
    return 'images';
  };

  const updateCategoryCounts = (files) => {
    const counts = {
      all: files.length,
      images: 0,
      videos: 0,
      documents: 0,
      projects: 0,
      team: 0,
      hero: 0,
      gallery: 0
    };

    files.forEach(file => {
      if (file.category && counts[file.category] !== undefined) {
        counts[file.category]++;
      }
    });

    setCategories(prev => prev.map(cat => ({
      ...cat,
      count: counts[cat.id] || 0
    })));
  };

  const onDrop = useCallback(async (acceptedFiles) => {
    setShowUploadModal(false);
    setUploading(true);

    const formData = new FormData();
    const uploadPromises = [];

    acceptedFiles.forEach((file, index) => {
      formData.append('files', file);
      
      // Initialize progress for each file
      setUploadProgress(prev => ({
        ...prev,
        [file.name]: 0
      }));

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: Math.min((prev[file.name] || 0) + 10, 90)
        }));
      }, 200);

      uploadPromises.push(progressInterval);
    });

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        'http://localhost:3001/api/media/upload/bulk',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token ? { Authorization: `Bearer ${token}` } : {})
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            acceptedFiles.forEach(file => {
              setUploadProgress(prev => ({
                ...prev,
                [file.name]: percentCompleted
              }));
            });
          }
        }
      );

      // Clear progress intervals
      uploadPromises.forEach(interval => clearInterval(interval));
      
      // Set all to 100% on success
      acceptedFiles.forEach(file => {
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: 100
        }));
      });

      // Refresh media files
      await fetchMediaFiles();
      
      // Clear progress after delay
      setTimeout(() => {
        setUploadProgress({});
      }, 2000);

      alert(`Successfully uploaded ${acceptedFiles.length} file(s)`);
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Failed to upload files');
      uploadPromises.forEach(interval => clearInterval(interval));
      setUploadProgress({});
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
      'video/*': ['.mp4', '.webm', '.mov'],
      'application/pdf': ['.pdf']
    },
    multiple: true
  });

  const handleFileSelect = (file) => {
    if (selectedFiles.find(f => f.id === file.id)) {
      setSelectedFiles(prev => prev.filter(f => f.id !== file.id));
    } else {
      setSelectedFiles(prev => [...prev, file]);
    }
  };

  const handleSelectAll = () => {
    const filteredFiles = getFilteredFiles();
    if (selectedFiles.length === filteredFiles.length) {
      setSelectedFiles([]);
    } else {
      setSelectedFiles(filteredFiles);
    }
  };

  const handleDeleteSelected = async () => {
    if (!window.confirm(`Delete ${selectedFiles.length} selected file(s)?`)) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      await Promise.all(selectedFiles.map(file =>
        axios.delete(`http://localhost:3001/api/media/${file.id}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {}
        })
      ));

      await fetchMediaFiles();
      setSelectedFiles([]);
      alert('Files deleted successfully');
    } catch (error) {
      console.error('Error deleting files:', error);
      alert('Failed to delete files');
    } finally {
      setLoading(false);
    }
  };

  const handleEditFile = (file) => {
    setEditingFile(file);
    setShowEditModal(true);
  };

  const handleSaveFileEdit = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.put(
        `http://localhost:3001/api/media/${editingFile.id}`,
        {
          filename: editingFile.filename,
          altText: editingFile.altText,
          category: editingFile.category,
          tags: editingFile.tags
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      await fetchMediaFiles();
      setShowEditModal(false);
      setEditingFile(null);
      alert('File updated successfully');
    } catch (error) {
      console.error('Error updating file:', error);
      alert('Failed to update file');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (fileId, newCategory) => {
    try {
      const token = localStorage.getItem('token');
      
      await axios.put(
        `http://localhost:3001/api/media/${fileId}`,
        { category: newCategory },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );

      setMediaFiles(prev => prev.map(file =>
        file.id === fileId ? { ...file, category: newCategory } : file
      ));
      updateCategoryCounts(mediaFiles);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const getFilteredFiles = () => {
    let filtered = mediaFiles;

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(file => file.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(file =>
        file.filename?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.originalname?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        file.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Sort files
    filtered.sort((a, b) => {
      let aVal, bVal;
      
      switch (sortBy) {
        case 'name':
          aVal = a.filename || a.originalname || '';
          bVal = b.filename || b.originalname || '';
          break;
        case 'size':
          aVal = a.size || 0;
          bVal = b.size || 0;
          break;
        case 'date':
        default:
          aVal = new Date(a.uploadedAt || a.createdAt || 0);
          bVal = new Date(b.uploadedAt || b.createdAt || 0);
          break;
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (file) => {
    const type = file.mimetype || file.type || '';
    if (type.startsWith('image/')) return 'Image';
    if (type.startsWith('video/')) return 'Video';
    if (type.includes('pdf')) return 'FileText';
    return 'File';
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  const filteredFiles = getFilteredFiles();
  const languages = ['de', 'en', 'fr', 'it', 'es'];

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Media Library</h2>
        <div className="flex items-center space-x-2">
          {selectedFiles.length > 0 && (
            <>
              <span className="text-sm text-gray-600">
                {selectedFiles.length} selected
              </span>
              <button
                onClick={handleDeleteSelected}
                className="px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                <Icon name="Trash2" size={16} className="inline mr-1" />
                Delete Selected
              </button>
            </>
          )}
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Icon name="Upload" size={16} className="inline mr-2" />
            Upload Files
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-64"
            />
          </div>
          
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="size">Sort by Size</option>
          </select>

          <button
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
            className="p-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            <Icon name={sortOrder === 'asc' ? 'ArrowUp' : 'ArrowDown'} size={16} />
          </button>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleSelectAll}
            className="px-3 py-2 border border-gray-300 rounded hover:bg-gray-50"
          >
            <Icon name="CheckSquare" size={16} className="inline mr-1" />
            {selectedFiles.length === filteredFiles.length ? 'Deselect All' : 'Select All'}
          </button>
          
          <div className="flex border border-gray-300 rounded">
            <button
              onClick={() => setView('grid')}
              className={`p-2 ${view === 'grid' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
            >
              <Icon name="Grid" size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 ${view === 'list' ? 'bg-blue-600 text-white' : 'hover:bg-gray-50'}`}
            >
              <Icon name="List" size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Categories Sidebar */}
        <div className="w-48 mr-6">
          <h3 className="font-medium mb-3">Categories</h3>
          <div className="space-y-1">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full text-left px-3 py-2 rounded flex justify-between items-center ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-gray-100'
                }`}
              >
                <span>{category.name}</span>
                <span className={`text-xs ${
                  selectedCategory === category.id ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {category.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Files Grid/List */}
        <div className="flex-1">
          {loading ? (
            <div className="text-center py-12">
              <Icon name="Loader" size={32} className="animate-spin mx-auto mb-4 text-gray-400" />
              <p className="text-gray-500">Loading media files...</p>
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <Icon name="Image" size={48} className="mx-auto mb-4 text-gray-300" />
              <p className="text-gray-500">No files found</p>
            </div>
          ) : view === 'grid' ? (
            <div className="grid grid-cols-4 gap-4">
              {filteredFiles.map(file => (
                <div
                  key={file.id}
                  className={`border rounded-lg overflow-hidden hover:shadow-lg transition-shadow ${
                    selectedFiles.find(f => f.id === file.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <div className="relative aspect-square bg-gray-100">
                    {file.mimetype?.startsWith('image/') ? (
                      <img
                        src={`http://localhost:3001${file.path || file.url}`}
                        alt={file.altText?.de || file.filename}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Icon name={getFileIcon(file)} size={48} className="text-gray-400" />
                      </div>
                    )}
                    
                    <div className="absolute top-2 left-2">
                      <input
                        type="checkbox"
                        checked={!!selectedFiles.find(f => f.id === file.id)}
                        onChange={() => handleFileSelect(file)}
                        className="w-4 h-4"
                      />
                    </div>

                    <div className="absolute top-2 right-2 flex space-x-1">
                      <button
                        onClick={() => handleEditFile(file)}
                        className="p-1 bg-white rounded shadow hover:bg-gray-100"
                      >
                        <Icon name="Edit" size={14} />
                      </button>
                      <button
                        onClick={() => copyToClipboard(`http://localhost:3001${file.path || file.url}`)}
                        className="p-1 bg-white rounded shadow hover:bg-gray-100"
                      >
                        <Icon name="Copy" size={14} />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-2">
                    <p className="text-sm font-medium truncate">
                      {file.originalname || file.filename}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatFileSize(file.size)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map(file => (
                <div
                  key={file.id}
                  className={`border rounded-lg p-3 flex items-center hover:bg-gray-50 ${
                    selectedFiles.find(f => f.id === file.id) ? 'ring-2 ring-blue-500' : ''
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={!!selectedFiles.find(f => f.id === file.id)}
                    onChange={() => handleFileSelect(file)}
                    className="mr-3"
                  />
                  
                  <div className="w-12 h-12 mr-3 bg-gray-100 rounded flex items-center justify-center">
                    {file.mimetype?.startsWith('image/') ? (
                      <img
                        src={`http://localhost:3001${file.path || file.url}`}
                        alt={file.altText?.de || file.filename}
                        className="w-full h-full object-cover rounded"
                      />
                    ) : (
                      <Icon name={getFileIcon(file)} size={24} className="text-gray-400" />
                    )}
                  </div>

                  <div className="flex-1">
                    <p className="font-medium">{file.originalname || file.filename}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • {new Date(file.uploadedAt || file.createdAt).toLocaleDateString()}
                    </p>
                  </div>

                  <select
                    value={file.category}
                    onChange={(e) => handleCategoryChange(file.id, e.target.value)}
                    className="px-2 py-1 border border-gray-300 rounded text-sm mr-3"
                  >
                    {categories.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEditFile(file)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                    >
                      <Icon name="Edit" size={16} />
                    </button>
                    <button
                      onClick={() => copyToClipboard(`http://localhost:3001${file.path || file.url}`)}
                      className="p-2 text-gray-600 hover:bg-gray-100 rounded"
                    >
                      <Icon name="Copy" size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Upload Progress */}
      {Object.keys(uploadProgress).length > 0 && (
        <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80">
          <h4 className="font-medium mb-2">Uploading Files</h4>
          <div className="space-y-2">
            {Object.entries(uploadProgress).map(([filename, progress]) => (
              <div key={filename}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="truncate">{filename}</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Upload Files</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icon name="X" size={24} />
              </button>
            </div>

            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <input {...getInputProps()} />
              <Icon name="Upload" size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-lg mb-2">
                {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
              </p>
              <p className="text-sm text-gray-500 mb-4">or click to browse</p>
              <p className="text-xs text-gray-400">
                Supported formats: Images (PNG, JPG, GIF, WebP), Videos (MP4, WebM), Documents (PDF)
              </p>
            </div>

            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingFile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit File Details</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingFile(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icon name="X" size={24} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Preview */}
              {editingFile.mimetype?.startsWith('image/') && (
                <div className="mb-4">
                  <img
                    src={`http://localhost:3001${editingFile.path || editingFile.url}`}
                    alt={editingFile.filename}
                    className="max-h-64 mx-auto rounded"
                  />
                </div>
              )}

              {/* Filename */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filename</label>
                <input
                  type="text"
                  value={editingFile.filename || ''}
                  onChange={(e) => setEditingFile({...editingFile, filename: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              {/* Alt Text */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Alt Text (SEO)</label>
                <div className="space-y-2">
                  {languages.map(lang => (
                    <div key={lang} className="flex items-center space-x-2">
                      <span className="w-12 text-sm font-medium">{lang.toUpperCase()}</span>
                      <input
                        type="text"
                        value={editingFile.altText?.[lang] || ''}
                        onChange={(e) => setEditingFile({
                          ...editingFile,
                          altText: {
                            ...editingFile.altText,
                            [lang]: e.target.value
                          }
                        })}
                        placeholder={`Alt text in ${lang}`}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={editingFile.category || 'images'}
                  onChange={(e) => setEditingFile({...editingFile, category: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={(editingFile.tags || []).join(', ')}
                  onChange={(e) => setEditingFile({
                    ...editingFile,
                    tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)
                  })}
                  placeholder="architecture, modern, building"
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>

              {/* File Info */}
              <div className="bg-gray-50 rounded p-3 text-sm">
                <p><strong>Size:</strong> {formatFileSize(editingFile.size)}</p>
                <p><strong>Type:</strong> {editingFile.mimetype}</p>
                <p><strong>Uploaded:</strong> {new Date(editingFile.uploadedAt || editingFile.createdAt).toLocaleString()}</p>
                <p><strong>URL:</strong> 
                  <code className="ml-2 bg-gray-200 px-2 py-1 rounded text-xs">
                    http://localhost:3001{editingFile.path || editingFile.url}
                  </code>
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingFile(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveFileEdit}
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaLibraryEnhanced;