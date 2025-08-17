import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Icon from '../../components/AppIcon';
import useCMSStore from '../store/cmsStore';
import { contentAPI } from '../../services/api';

const HomepageEditor = () => {
  const { projects, media, content, setContent, updateProject, uploadMedia, currentLanguage, loadContent } = useCMSStore();
  const [activeTab, setActiveTab] = useState('hero');
  const [heroSlides, setHeroSlides] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [editingSlide, setEditingSlide] = useState(null);
  const [uploadingSlide, setUploadingSlide] = useState(null);

  // Update hero slide
  const updateHeroSlide = (slideId, updates) => {
    setHeroSlides(prevSlides => prevSlides.map(slide => 
      slide.id === slideId ? { ...slide, ...updates } : slide
    ));
  };

  // Handle image upload for slides
  const handleImageUpload = async (slideId, file) => {
    if (!file) return;
    
    setUploadingSlide(slideId);
    try {
      const uploadedMedia = await uploadMedia(file, { 
        type: 'hero',
        alt: `Hero slide image`
      });
      
      updateHeroSlide(slideId, { image: uploadedMedia.url });
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploadingSlide(null);
    }
  };

  // Handle video upload for slides
  const handleVideoUpload = async (slideId, file) => {
    if (!file) return;
    
    setUploadingSlide(slideId);
    try {
      const uploadedMedia = await uploadMedia(file, { 
        type: 'video',
        alt: `Hero slide video`
      });
      
      updateHeroSlide(slideId, { video: uploadedMedia.url });
      alert('Video uploaded successfully!');
    } catch (error) {
      console.error('Failed to upload video:', error);
      alert('Failed to upload video. Please try again.');
    } finally {
      setUploadingSlide(null);
    }
  };

  // Load homepage content from API on mount
  useEffect(() => {
    const loadHomepageContent = async () => {
      try {
        // Fetch homepage content directly from API
        const response = await contentAPI.getByKey('homepage', currentLanguage);
        if (response && response.value) {
          let homepageData = response.value;
          
          // Parse if it's a string
          if (typeof homepageData === 'string') {
            try {
              homepageData = JSON.parse(homepageData);
            } catch (e) {
              console.error('Failed to parse homepage data:', e);
              homepageData = {};
            }
          }
          
          // Load hero slides - keep URLs as they are from the backend
          const slides = homepageData.heroSlides || [
            {
              id: '1',
              image: 'http://localhost:3001/uploads/innenarchitektur.png',
              title: 'Modern Architecture',
              subtitle: 'Innovative Design',
              description: 'Creating spaces that inspire and endure',
              order: 0
            }
          ];
          setHeroSlides(slides);

          // Load featured projects
          const featured = homepageData.featuredProjects || [];
          setFeaturedProjects(featured);
          setSelectedProjects(featured.map(p => p.id));
        }
      } catch (error) {
        console.error('Failed to load homepage content:', error);
        
        // Fallback to store content
        const langContent = content?.[currentLanguage] || content;
        const homepageContent = langContent?.homepage || {};
        
        const slides = homepageContent.heroSlides || [
          {
            id: '1',
            image: 'http://localhost:3001/uploads/innenarchitektur.png',
            title: 'Modern Architecture',
            subtitle: 'Innovative Design',
            description: 'Creating spaces that inspire and endure',
            order: 0
          }
        ];
        setHeroSlides(slides);
        
        const featured = homepageContent.featuredProjects || [];
        setFeaturedProjects(featured);
        setSelectedProjects(featured.map(p => p.id));
      }
    };
    
    loadHomepageContent();
  }, [currentLanguage]);

  // Save changes to store
  const saveHomepageConfig = async () => {
    // Process slides to ensure proper URLs
    const processedSlides = heroSlides.map(slide => {
      let imageUrl = slide.image;
      let videoUrl = slide.video;
      
      // Only process relative URLs, leave full URLs as they are
      if (imageUrl && !imageUrl.startsWith('http')) {
        // If it's a relative path starting with /images, convert to backend URL
        if (imageUrl.startsWith('/images/')) {
          imageUrl = `http://localhost:3001/uploads${imageUrl.substring(7)}`; // Remove /images prefix
        } else if (!imageUrl.startsWith('/')) {
          imageUrl = `http://localhost:3001/uploads/${imageUrl}`;
        }
      }
      
      if (videoUrl && !videoUrl.startsWith('http')) {
        if (videoUrl.startsWith('/images/')) {
          videoUrl = `http://localhost:3001/uploads${videoUrl.substring(7)}`;
        } else if (!videoUrl.startsWith('/')) {
          videoUrl = `http://localhost:3001/uploads/${videoUrl}`;
        }
      }
      
      return {
        ...slide,
        image: imageUrl,
        video: videoUrl
      };
    });

    const homepageConfig = {
      heroSlides: processedSlides,
      featuredProjects: selectedProjects.map(id => {
        const project = projects.find(p => p.id === id);
        if (!project) return null;
        
        // Ensure project image URLs are full URLs
        // Use featured_image first, then images array, then image field
        let imageUrl = project.featured_image || project.images?.[0] || project.image || '';
        
        // Process the image URL to ensure it's a full URL
        if (imageUrl && !imageUrl.startsWith('http')) {
          // Handle /assets/images/ paths - convert to /uploads/
          if (imageUrl.startsWith('/assets/images/')) {
            // Extract filename from /assets/images/ path and convert to /uploads/
            const filename = imageUrl.split('/').pop();
            imageUrl = `http://localhost:3001/uploads/${filename}`;
          } else if (!imageUrl.startsWith('/')) {
            imageUrl = `http://localhost:3001/uploads/${imageUrl}`;
          } else {
            imageUrl = `http://localhost:3001${imageUrl}`;
          }
        }
        
        return {
          id: project.id,
          title: project.title,
          type: project.category,
          location: project.location,
          image: imageUrl,
          year: project.year
        };
      }).filter(Boolean)
    };

    await setContent('homepage', homepageConfig);
    alert('Homepage configuration saved!');
    
    // Reload content to ensure sync with backend
    if (loadContent) {
      setTimeout(() => {
        loadContent();
      }, 500);
    }
  };

  // Handle hero slide reordering
  const handleSlideDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(heroSlides);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setHeroSlides(items.map((item, index) => ({ ...item, order: index })));
  };

  // Add new hero slide
  const addHeroSlide = () => {
    const newSlide = {
      id: Date.now().toString(),
      image: '',
      title: 'New Slide',
      subtitle: 'Subtitle',
      description: 'Description',
      order: heroSlides.length
    };
    setHeroSlides([...heroSlides, newSlide]);
    setEditingSlide(newSlide.id);
  };

  // Delete hero slide
  const deleteHeroSlide = (slideId) => {
    if (heroSlides.length <= 1) {
      alert('You must have at least one hero slide');
      return;
    }
    setHeroSlides(heroSlides.filter(slide => slide.id !== slideId));
  };

  // Toggle project selection for featured projects
  const toggleProjectSelection = (projectId) => {
    if (selectedProjects.includes(projectId)) {
      setSelectedProjects(selectedProjects.filter(id => id !== projectId));
    } else {
      if (selectedProjects.length >= 6) {
        alert('Maximum 6 featured projects allowed');
        return;
      }
      setSelectedProjects([...selectedProjects, projectId]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Homepage Editor</h2>
        <button
          onClick={saveHomepageConfig}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <Icon name="Save" size={16} className="inline mr-2" />
          Save Changes
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('hero')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'hero'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Hero Carousel
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'projects'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Featured Projects
          </button>
        </nav>
      </div>

      {/* Hero Carousel Tab */}
      {activeTab === 'hero' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Hero Slides</h3>
            <button
              onClick={addHeroSlide}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              <Icon name="Plus" size={16} className="inline mr-1" />
              Add Slide
            </button>
          </div>

          <DragDropContext onDragEnd={handleSlideDragEnd}>
            <Droppable droppableId="hero-slides">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                  {heroSlides.map((slide, index) => (
                    <Draggable key={slide.id} draggableId={slide.id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`border rounded-lg p-4 ${
                            snapshot.isDragging ? 'shadow-lg bg-gray-50' : 'bg-white'
                          } ${editingSlide === slide.id ? 'border-blue-500' : 'border-gray-200'}`}
                        >
                          <div className="flex items-start space-x-4">
                            <div {...provided.dragHandleProps} className="pt-2 cursor-move">
                              <Icon name="Menu" size={20} className="text-gray-400" />
                            </div>

                            {/* Slide Preview */}
                            <div className="flex-shrink-0 relative">
                              {slide.video ? (
                                // Show video preview if video exists
                                <div className="relative w-32 h-20">
                                  <video
                                    src={slide.video.startsWith('http') ? slide.video : `http://localhost:3001${slide.video.startsWith('/') ? '' : '/'}${slide.video}`}
                                    className="w-32 h-20 object-cover rounded"
                                    muted
                                    autoPlay
                                    loop
                                    playsInline
                                    onError={(e) => {
                                      // Fallback to poster image if video fails
                                      e.target.style.display = 'none';
                                      if (slide.image) {
                                        const img = document.createElement('img');
                                        img.src = slide.image.startsWith('http') ? slide.image : `http://localhost:3001${slide.image.startsWith('/') ? '' : '/'}${slide.image}`;
                                        img.className = 'w-32 h-20 object-cover rounded';
                                        e.target.parentNode.appendChild(img);
                                      }
                                    }}
                                  />
                                  {/* Video indicator overlay */}
                                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                    <div className="bg-black/50 rounded-full p-2">
                                      <Icon name="Film" size={20} className="text-white" />
                                    </div>
                                  </div>
                                </div>
                              ) : slide.image ? (
                                <img
                                  src={slide.image.startsWith('http') ? slide.image : `http://localhost:3001${slide.image.startsWith('/') ? '' : '/'}${slide.image}`}
                                  alt={slide.title}
                                  className="w-32 h-20 object-cover rounded"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="128" height="80" viewBox="0 0 128 80"%3E%3Crect width="128" height="80" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="system-ui" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                                  }}
                                />
                              ) : (
                                <div className="w-32 h-20 bg-gray-200 rounded flex items-center justify-center">
                                  <Icon name="Image" size={24} className="text-gray-400" />
                                </div>
                              )}
                            </div>

                            {/* Slide Content */}
                            <div className="flex-1">
                              {editingSlide === slide.id ? (
                                <div className="space-y-3">
                                  <input
                                    type="text"
                                    value={slide.title}
                                    onChange={(e) => updateHeroSlide(slide.id, { title: e.target.value })}
                                    placeholder="Title"
                                    className="w-full px-3 py-1 border border-gray-300 rounded"
                                  />
                                  <input
                                    type="text"
                                    value={slide.subtitle}
                                    onChange={(e) => updateHeroSlide(slide.id, { subtitle: e.target.value })}
                                    placeholder="Subtitle"
                                    className="w-full px-3 py-1 border border-gray-300 rounded"
                                  />
                                  <textarea
                                    value={slide.description}
                                    onChange={(e) => updateHeroSlide(slide.id, { description: e.target.value })}
                                    placeholder="Description"
                                    rows="2"
                                    className="w-full px-3 py-1 border border-gray-300 rounded"
                                  />
                                  
                                  {/* Image/Video Selection and Upload */}
                                  <div className="space-y-2">
                                    {/* Image Input */}
                                    <div className="flex items-center space-x-2">
                                      <label className="text-sm font-medium text-gray-700 w-16">Image:</label>
                                      <input
                                        type="text"
                                        value={slide.image || ''}
                                        onChange={(e) => updateHeroSlide(slide.id, { image: e.target.value })}
                                        placeholder="Image URL"
                                        className="flex-1 px-3 py-1 border border-gray-300 rounded"
                                      />
                                      <label className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                                        <Icon name="Upload" size={14} className="inline mr-1" />
                                        Upload
                                        <input
                                          type="file"
                                          accept="image/*"
                                          onChange={(e) => handleImageUpload(slide.id, e.target.files[0])}
                                          className="hidden"
                                          disabled={uploadingSlide === slide.id}
                                        />
                                      </label>
                                    </div>
                                    
                                    {/* Video Input */}
                                    <div className="flex items-center space-x-2">
                                      <label className="text-sm font-medium text-gray-700 w-16">Video:</label>
                                      <input
                                        type="text"
                                        value={slide.video || ''}
                                        onChange={(e) => updateHeroSlide(slide.id, { video: e.target.value })}
                                        placeholder="Video URL (optional)"
                                        className="flex-1 px-3 py-1 border border-gray-300 rounded"
                                      />
                                      <label className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 cursor-pointer">
                                        <Icon name="Film" size={14} className="inline mr-1" />
                                        Upload
                                        <input
                                          type="file"
                                          accept="video/mp4,video/webm,video/ogg,video/mov,video/avi"
                                          onChange={(e) => handleVideoUpload(slide.id, e.target.files[0])}
                                          className="hidden"
                                          disabled={uploadingSlide === slide.id}
                                        />
                                      </label>
                                    </div>
                                    
                                    {/* Or select from existing media */}
                                    <div className="flex items-center space-x-2">
                                      <label className="text-sm font-medium text-gray-700 w-16">Or:</label>
                                      <select
                                        onChange={(e) => {
                                          const selectedMedia = media.find(m => m.url === e.target.value);
                                          if (selectedMedia) {
                                            if (selectedMedia.type === 'video') {
                                              updateHeroSlide(slide.id, { video: selectedMedia.url });
                                            } else {
                                              updateHeroSlide(slide.id, { image: selectedMedia.url });
                                            }
                                          }
                                        }}
                                        className="flex-1 px-3 py-1 border border-gray-300 rounded"
                                      >
                                        <option value="">Select from Media Library</option>
                                        {media.map(item => (
                                          <option key={item.id} value={item.url}>
                                            {item.name} ({item.type || 'image'})
                                          </option>
                                        ))}
                                      </select>
                                    </div>
                                    
                                    {uploadingSlide === slide.id && (
                                      <div className="text-sm text-blue-600">
                                        <Icon name="Loader" size={14} className="inline mr-1 animate-spin" />
                                        Uploading...
                                      </div>
                                    )}
                                  </div>
                                  
                                  <button
                                    onClick={() => setEditingSlide(null)}
                                    className="w-full px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                  >
                                    <Icon name="Check" size={14} className="inline mr-1" />
                                    Done Editing
                                  </button>
                                </div>
                              ) : (
                                <div>
                                  <h4 className="font-medium">{slide.title}</h4>
                                  <p className="text-sm text-gray-600">{slide.subtitle}</p>
                                  <p className="text-sm text-gray-500 mt-1">{slide.description}</p>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-2">
                              {editingSlide !== slide.id && (
                                <button
                                  onClick={() => setEditingSlide(slide.id)}
                                  className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                >
                                  <Icon name="Edit" size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => deleteHeroSlide(slide.id)}
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

      {/* Featured Projects Tab */}
      {activeTab === 'projects' && (
        <div>
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2">Select Featured Projects</h3>
            <p className="text-sm text-gray-600">
              Choose up to 6 projects to feature on the homepage
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {projects.filter(p => p.status === 'published').map(project => {
              const isSelected = selectedProjects.includes(project.id);
              return (
                <div
                  key={project.id}
                  onClick={() => toggleProjectSelection(project.id)}
                  className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {(project.featured_image || project.images?.[0] || project.image) && (
                    <img
                      src={(() => {
                        let imgUrl = project.featured_image || project.images?.[0] || project.image || '';
                        if (imgUrl && !imgUrl.startsWith('http')) {
                          if (imgUrl.startsWith('/assets/images/')) {
                            // Extract filename from /assets/images/ path and convert to /uploads/
                            const filename = imgUrl.split('/').pop();
                            return `http://localhost:3001/uploads/${filename}`;
                          } else if (!imgUrl.startsWith('/')) {
                            return `http://localhost:3001/uploads/${imgUrl}`;
                          } else {
                            return `http://localhost:3001${imgUrl}`;
                          }
                        }
                        return imgUrl;
                      })()}
                      alt={project.title}
                      className="w-full h-32 object-cover rounded mb-2"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="128" viewBox="0 0 200 128"%3E%3Crect width="200" height="128" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%239ca3af" font-family="system-ui" font-size="12"%3ENo Image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                  )}
                  <h4 className="font-medium text-sm">{project.title}</h4>
                  <p className="text-xs text-gray-600">{project.category}</p>
                  <p className="text-xs text-gray-500">{project.location}</p>
                  {isSelected && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        <Icon name="Check" size={12} className="mr-1" />
                        Selected
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {selectedProjects.length > 0 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Selected Projects Order</h4>
              <div className="space-y-2">
                {selectedProjects.map((projectId, index) => {
                  const project = projects.find(p => p.id === projectId);
                  return project ? (
                    <div key={projectId} className="flex items-center space-x-2">
                      <span className="text-sm text-gray-500">{index + 1}.</span>
                      <span className="text-sm font-medium">{project.title}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomepageEditor;