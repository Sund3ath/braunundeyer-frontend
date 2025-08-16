import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import CursorTrail from 'components/ui/CursorTrail';
import SEO from 'components/SEO';
import { generateBreadcrumbSchema } from 'utils/structuredData';
import { projectsAPI } from '../../services/api';
import useCMSStore from '../../cms/store/cmsStore';

const ProjectGalleryWithCMS = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation(['projects', 'translation']);
  const currentLang = location.pathname.split('/')[1] || i18n.language || 'de';
  
  // CMS Store
  const { projects: cmsProjects, initializeStore, initialized, isLoading: cmsLoading } = useCMSStore();
  
  const [selectedCategory, setSelectedCategory] = useState(t('projects:filters.all'));
  const [sortBy, setSortBy] = useState(t('projects:sort.newest'));
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState(12);
  const [projects, setProjects] = useState([]);
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef(null);

  // Initialize CMS store
  useEffect(() => {
    if (!initialized) {
      initializeStore();
    }
  }, [initialized, initializeStore]);

  // Fetch projects from API or use CMS projects
  useEffect(() => {
    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        // Try to fetch from API first
        const response = await projectsAPI.getAll({ 
          language: currentLang,
          status: 'published' 
        });
        
        if (response.projects && response.projects.length > 0) {
          // Transform API projects to match component structure
          const transformedProjects = response.projects.map(project => ({
            id: project.id,
            name: project[`name_${currentLang}`] || project.name,
            location: project[`location_${currentLang}`] || project.location,
            year: project.year || new Date(project.created_at).getFullYear(),
            category: project[`category_${currentLang}`] || project.category,
            image: project.featured_image || project.images?.[0] || '/assets/images/placeholder.jpg',
            description: project[`description_${currentLang}`] || project.description,
            area: project.area,
            status: project.status
          }));
          setProjects(transformedProjects);
        } else if (cmsProjects && cmsProjects.length > 0) {
          // Use CMS projects as fallback
          const transformedProjects = cmsProjects.map(project => ({
            id: project.id,
            name: project[`name_${currentLang}`] || project.name,
            location: project[`location_${currentLang}`] || project.location,
            year: project.year,
            category: project[`category_${currentLang}`] || project.category,
            image: project.featured_image || project.images?.[0] || '/assets/images/placeholder.jpg',
            description: project[`description_${currentLang}`] || project.description,
            area: project.area,
            status: project.status
          }));
          setProjects(transformedProjects);
        } else {
          // Use demo data if no projects available
          setProjects(getDemoProjects());
        }
      } catch (error) {
        console.error('Failed to fetch projects:', error);
        // Fallback to demo data
        setProjects(getDemoProjects());
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, [currentLang, cmsProjects]);

  // Demo projects with multilingual support
  const getDemoProjects = () => {
    const demoProjects = [
      {
        id: 1,
        name_de: "Moderne Stadtvilla Saarbrücken",
        name_en: "Modern City Villa Saarbrücken",
        location_de: "Saarbrücken-St. Johann",
        location_en: "Saarbrücken-St. Johann",
        year: 2023,
        category_de: "Neubau",
        category_en: "New Construction",
        image: "/assets/images/flyer-structure.jpg",
        description_de: "Zeitgenössische Villa mit klaren Linien, nachhaltigen Materialien und panoramischem Stadtblick.",
        description_en: "Contemporary villa with clean lines, sustainable materials and panoramic city views.",
        area: "420 m²",
        status: "completed"
      },
      {
        id: 2,
        name_de: "Bürogebäude Maximilianstraße",
        name_en: "Office Building Maximilianstrasse",
        location_de: "Saarbrücken-Mitte",
        location_en: "Saarbrücken-Center",
        year: 2023,
        category_de: "Neubau",
        category_en: "New Construction",
        image: "/assets/images/flyer.jpg",
        description_de: "Modernes 8-stöckiges Bürogebäude mit innovativem Arbeitsplatzdesign und LEED-Zertifizierung.",
        description_en: "Modern 8-story office building with innovative workplace design and LEED certification.",
        area: "3,200 m²",
        status: "completed"
      },
      {
        id: 3,
        name_de: "Penthouse Innenarchitektur",
        name_en: "Penthouse Interior Design",
        location_de: "Saarbrücken-St. Arnual",
        location_en: "Saarbrücken-St. Arnual",
        year: 2022,
        category_de: "Innenarchitektur",
        category_en: "Interior Design",
        image: "/assets/images/howtolook.jpg",
        description_de: "Hochwertige Innenarchitektur mit maßgefertigten Möbeln und exklusiven Oberflächen.",
        description_en: "High-end interior design with custom furniture and exclusive finishes.",
        area: "280 m²",
        status: "completed"
      },
      {
        id: 4,
        name_de: "Denkmalgeschütztes Stadthaus",
        name_en: "Heritage Protected Townhouse",
        location_de: "Saarbrücken-Altstadt",
        location_en: "Saarbrücken-Old Town",
        year: 2022,
        category_de: "Altbausanierung",
        category_en: "Building Renovation",
        image: "/assets/images/flyer-structure-ref.jpg",
        description_de: "Behutsame Sanierung eines historischen Stadthauses aus dem 19. Jahrhundert mit modernen Annehmlichkeiten.",
        description_en: "Careful renovation of a 19th century historic townhouse with modern amenities.",
        area: "650 m²",
        status: "completed"
      }
    ];

    return demoProjects.map(project => ({
      id: project.id,
      name: project[`name_${currentLang}`] || project.name_de,
      location: project[`location_${currentLang}`] || project.location_de,
      year: project.year,
      category: project[`category_${currentLang}`] || project.category_de,
      image: project.image,
      description: project[`description_${currentLang}`] || project.description_de,
      area: project.area,
      status: project.status
    }));
  };

  // Handle triple-click on footer copyright
  const handleCopyrightClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    if (newClickCount === 3) {
      navigate(`/${currentLang}/admin`);
      setClickCount(0);
      return;
    }
    
    clickTimeoutRef.current = setTimeout(() => {
      setClickCount(0);
    }, 500);
  };

  // Custom cursor motion values
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Get translated categories
  const categories = [
    { name: t('projects:filters.all'), count: projects.length },
    { name: t('projects:filters.newBuilding'), count: projects.filter(p => 
      p.category === 'Neubau' || p.category === 'New Construction'
    ).length },
    { name: t('projects:filters.renovation'), count: projects.filter(p => 
      p.category === 'Altbausanierung' || p.category === 'Building Renovation'
    ).length },
    { name: t('projects:filters.interior'), count: projects.filter(p => 
      p.category === 'Innenarchitektur' || p.category === 'Interior Design'
    ).length }
  ];

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesCategory = selectedCategory === t('projects:filters.all') || 
        project.category === selectedCategory ||
        (selectedCategory === t('projects:filters.newBuilding') && 
          (project.category === 'Neubau' || project.category === 'New Construction')) ||
        (selectedCategory === t('projects:filters.renovation') && 
          (project.category === 'Altbausanierung' || project.category === 'Building Renovation')) ||
        (selectedCategory === t('projects:filters.interior') && 
          (project.category === 'Innenarchitektur' || project.category === 'Interior Design'));
      
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case t('projects:sort.newest'):
          return b.year - a.year || b.id - a.id;
        case t('projects:sort.oldest'):
          return a.year - b.year || a.id - b.id;
        case t('projects:sort.alphabetical'):
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, searchQuery, sortBy, projects, t]);

  const displayedProjects = filteredAndSortedProjects.slice(0, visibleProjects);

  const handleProjectClick = (projectId) => {
    navigate(`/${currentLang}/projekte/${projectId}`);
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleProjects(prev => prev + 6);
      setIsLoading(false);
    }, 500);
  };

  const handleClearFilters = () => {
    setSelectedCategory(t('projects:filters.all'));
    setSearchQuery('');
    setSortBy(t('projects:sort.newest'));
  };

  // Custom cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  const breadcrumbs = [
    { name: 'Home', url: `https://braunundeyer.de/${currentLang}` },
    { name: t('projects:title'), url: `https://braunundeyer.de/${currentLang}/projekte` }
  ];

  const gallerySchema = generateBreadcrumbSchema(breadcrumbs);

  // Get category badge color
  const getCategoryColor = (category) => {
    if (category === 'Neubau' || category === 'New Construction') {
      return 'bg-blue-100 text-blue-800';
    } else if (category === 'Altbausanierung' || category === 'Building Renovation') {
      return 'bg-orange-100 text-orange-800';
    } else {
      return 'bg-purple-100 text-purple-800';
    }
  };

  // Get status text
  const getStatusText = (status) => {
    switch(status) {
      case 'completed':
        return t('projects:projectCard.status.completed');
      case 'inProgress':
        return t('projects:projectCard.status.inProgress');
      case 'planned':
        return t('projects:projectCard.status.planned');
      default:
        return t('projects:projectCard.status.completed');
    }
  };

  return (
    <div className="min-h-screen custom-cursor relative overflow-hidden bg-background">
      <SEO 
        title={`${t('projects:title')} | Braun & Eyer ${t('translation:hero.title')}`}
        description={t('projects:subtitle')}
        keywords={`${t('projects:categories.newBuilding')}, ${t('projects:categories.renovation')}, ${t('projects:categories.interior')}`}
        structuredData={gallerySchema}
      />
      <Header />
      <CursorTrail />

      {/* Custom Cursor */}
      <motion.div
        className="cursor-dot"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />
      <motion.div
        className="cursor-ring"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />
      
      {/* Main Content */}
      <main className="pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="bg-surface/95 backdrop-blur-sm border-b border-border relative z-base">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <Breadcrumb />
            <div className="mt-6">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-light text-primary mb-4">
                {t('projects:title')}
              </h1>
              <p className="text-lg text-text-secondary font-body max-w-2xl">
                {t('projects:subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Filters and Controls */}
        <section className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-16 lg:top-20 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Search Bar */}
            <div className="mb-4 lg:mb-6">
              <div className="relative max-w-md">
                <Icon 
                  name="Search" 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
                />
                <input
                  type="text"
                  placeholder={t('projects:search.placeholder')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded-minimal bg-surface focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-200 font-body"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    <Icon name="X" size={16} />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
              {/* Category Filters */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-2 lg:pb-0">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-full whitespace-nowrap transition-colors duration-200 font-body font-medium text-sm ${
                      selectedCategory === category.name
                        ? 'bg-accent text-white' 
                        : 'bg-surface text-text-secondary hover:bg-accent/10 hover:text-accent border border-border'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      selectedCategory === category.name
                        ? 'bg-white/20 text-white' 
                        : 'bg-text-secondary/10 text-text-secondary'
                    }`}>
                      {category.count}
                    </span>
                  </button>
                ))}
              </div>

              {/* Controls */}
              <div className="flex items-center space-x-4">
                {/* Clear Filters */}
                {(selectedCategory !== t('projects:filters.all') || searchQuery) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-text-secondary hover:text-accent transition-colors duration-200 font-body text-sm"
                  >
                    {t('projects:filters.clearAll')}
                  </button>
                )}

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-surface border border-border rounded-minimal px-4 py-2 pr-8 text-sm font-body text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-200"
                  >
                    <option value={t('projects:sort.newest')}>{t('projects:sort.newest')}</option>
                    <option value={t('projects:sort.oldest')}>{t('projects:sort.oldest')}</option>
                    <option value={t('projects:sort.alphabetical')}>{t('projects:sort.alphabetical')}</option>
                  </select>
                  <Icon 
                    name="ChevronDown" 
                    size={16} 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" 
                  />
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-surface border border-border rounded-minimal p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-accent text-white' 
                        : 'text-text-secondary hover:text-accent'
                    }`}
                    title={t('projects:viewMode.grid')}
                  >
                    <Icon name="Grid3X3" size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-accent text-white' 
                        : 'text-text-secondary hover:text-accent'
                    }`}
                    title={t('projects:viewMode.list')}
                  >
                    <Icon name="List" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-8 lg:py-12 relative" style={{ zIndex: 5 }}>
          {/* Background Typography */}
          <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 1 }}>
            <motion.div
              className="absolute text-[16rem] opacity-[0.06] text-gray-400 font-thin select-none whitespace-nowrap"
              style={{ left: "-12%", top: "40%" }}
              animate={{
                x: [0, 30, -20, 0],
                y: [0, -15, 10, 0],
                rotate: [0, 0.3, -0.2, 0],
              }}
              transition={{
                duration: 35,
                repeat: Infinity,
                ease: "linear"
              }}
            >
              PROJEKTE
            </motion.div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 section-content relative" style={{ zIndex: 2 }}>
            {/* Results Count */}
            <div className="mb-6 lg:mb-8">
              <p className="text-text-secondary font-body">
                {t('projects:pagination.showing', { 
                  current: displayedProjects.length, 
                  total: filteredAndSortedProjects.length 
                })}
              </p>
            </div>

            {/* Projects Display */}
            {(isLoading || cmsLoading) && projects.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 border-4 border-surface border-t-accent rounded-full animate-spin"></div>
                <p className="text-text-secondary font-body">{t('projects:pagination.loading')}</p>
              </div>
            ) : filteredAndSortedProjects.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
                  <Icon name="Search" size={32} className="text-text-secondary" />
                </div>
                <h3 className="text-xl font-heading font-light text-primary mb-2">
                  {t('projects:search.noResults')}
                </h3>
                <p className="text-text-secondary font-body mb-6">
                  {t('projects:search.noResultsDescription')}
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-accent text-white px-6 py-3 rounded-minimal hover:scale-102 hover:shadow-lg transition-all duration-200 font-body font-medium"
                >
                  {t('projects:search.clearFilters')}
                </button>
              </div>
            ) : (
              <>
                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                    {displayedProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => handleProjectClick(project.id)}
                        className="group cursor-pointer card-elevated rounded-minimal overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-102"
                      >
                        <div className="aspect-[4/3] overflow-hidden">
                          <Image
                            src={project.image}
                            alt={project.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4 lg:p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(project.category)}`}>
                              {project.category}
                            </span>
                            <span className="text-xs text-text-secondary font-body">
                              {project.year}
                            </span>
                          </div>
                          <h3 className="font-heading font-medium text-primary mb-2 group-hover:text-accent transition-colors duration-200">
                            {project.name}
                          </h3>
                          <p className="text-text-secondary text-sm font-body mb-3 line-clamp-2">
                            {project.description}
                          </p>
                          <div className="flex items-center justify-between text-xs text-text-secondary font-body">
                            <div className="flex items-center space-x-1">
                              <Icon name="MapPin" size={12} />
                              <span>{project.location}</span>
                            </div>
                            <span>{project.area}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-6">
                    {displayedProjects.map((project) => (
                      <div
                        key={project.id}
                        onClick={() => handleProjectClick(project.id)}
                        className="group cursor-pointer card-elevated rounded-minimal overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 aspect-[4/3] md:aspect-auto overflow-hidden">
                            <Image
                              src={project.image}
                              alt={project.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="md:w-2/3 p-6 lg:p-8">
                            <div className="flex items-center justify-between mb-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getCategoryColor(project.category)}`}>
                                {project.category}
                              </span>
                              <span className="text-sm text-text-secondary font-body">
                                {project.year}
                              </span>
                            </div>
                            <h3 className="text-xl lg:text-2xl font-heading font-medium text-primary mb-3 group-hover:text-accent transition-colors duration-200">
                              {project.name}
                            </h3>
                            <p className="text-text-secondary font-body mb-4 line-clamp-3">
                              {project.description}
                            </p>
                            <div className="flex items-center justify-between text-sm text-text-secondary font-body">
                              <div className="flex items-center space-x-4">
                                <div className="flex items-center space-x-1">
                                  <Icon name="MapPin" size={16} />
                                  <span>{project.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Icon name="Square" size={16} />
                                  <span>{project.area}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 text-accent">
                                <span>{t('projects:projectCard.viewDetails')}</span>
                                <Icon name="ArrowRight" size={16} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Load More Button */}
                {visibleProjects < filteredAndSortedProjects.length && (
                  <div className="text-center mt-12">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="bg-accent text-white px-8 py-3 rounded-minimal hover:scale-102 hover:shadow-lg transition-all duration-200 font-body font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>{t('projects:pagination.loading')}</span>
                        </div>
                      ) : (
                        t('projects:pagination.loadMore')
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white mt-16 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-accent rounded-minimal flex items-center justify-center">
                  <Icon name="Triangle" size={20} color="white" />
                </div>
                <div className="font-heading font-semibold text-xl">
                  Braun & Eyer
                </div>
              </div>
              <p className="text-white/80 font-body mb-4">
                {t('translation:footer.description', { defaultValue: 'Außergewöhnliche Architekturlösungen, die Innovation mit Funktionalität verbinden.' })}
              </p>
            </div>
            
            <div>
              <h4 className="font-heading font-medium text-lg mb-4">{t('translation:footer.company')}</h4>
              <ul className="space-y-2">
                <li>
                  <Link to={`/${currentLang}/homepage`} className="text-white/80 hover:text-accent transition-colors duration-200 font-body">
                    {t('translation:nav.home')}
                  </Link>
                </li>
                <li>
                  <Link to={`/${currentLang}/uber-uns`} className="text-white/80 hover:text-accent transition-colors duration-200 font-body">
                    {t('translation:nav.about')}
                  </Link>
                </li>
                <li>
                  <Link to={`/${currentLang}/leistungen`} className="text-white/80 hover:text-accent transition-colors duration-200 font-body">
                    {t('translation:nav.services')}
                  </Link>
                </li>
                <li>
                  <Link to={`/${currentLang}/kontakt`} className="text-white/80 hover:text-accent transition-colors duration-200 font-body">
                    {t('translation:nav.contact')}
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-medium text-lg mb-4">{t('translation:footer.services')}</h4>
              <ul className="space-y-2 text-white/80 font-body">
                <li>{t('projects:categories.newBuilding')}</li>
                <li>{t('projects:categories.renovation')}</li>
                <li>{t('projects:categories.interior')}</li>
                <li>{t('translation:services.consulting')}</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-medium text-lg mb-4">{t('translation:contact.title')}</h4>
              <div className="space-y-2 text-white/80 font-body">
                <p>Maximilianstraße 35</p>
                <p>66111 Saarbrücken</p>
                <p>+49 (89) 123-4567</p>
                <p>info@braun-eyer.de</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p 
              className="text-white/60 font-body cursor-pointer select-none transition-colors duration-200 hover:text-white/80"
              onClick={handleCopyrightClick}
              style={{ userSelect: 'none' }}
            >
              © {new Date().getFullYear()} {t('translation:footer.rights', { defaultValue: 'Braun & Eyer Architekturbüro Ingenieure. Alle Rechte vorbehalten.' })}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjectGalleryWithCMS;