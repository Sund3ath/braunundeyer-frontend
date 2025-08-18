'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Search, X, ChevronDown, Grid3X3, List, MapPin, Square, ArrowRight, AlertCircle } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function ProjectGalleryClient({ initialProjects = [], lang = 'de', apiError = null }) {
  const router = useRouter();
  // Ensure projects is always an array
  const [projects, setProjects] = useState(Array.isArray(initialProjects) ? initialProjects : []);
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [sortBy, setSortBy] = useState('Neueste');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState(12);
  const [dict, setDict] = useState({});
  const [clickCount, setClickCount] = useState(0);
  const clickTimeoutRef = useRef(null);

  // Handle triple-click on footer copyright
  const handleCopyrightClick = () => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    
    const newClickCount = clickCount + 1;
    setClickCount(newClickCount);
    
    if (newClickCount === 3) {
      // Redirect to CMS subdomain
      window.location.href = process.env.NEXT_PUBLIC_CMS_URL || 'https://cms.braunundeyer.de';
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

  // Load translations
  useEffect(() => {
    Promise.all([
      import(`@/lib/locales/${lang}/translation.json`),
      import(`@/lib/locales/${lang}/projects.json`)
    ]).then(([translationModule, projectsModule]) => {
      setDict({
        translation: translationModule.default,
        projects: projectsModule.default
      });
    });
  }, [lang]);

  // Extract unique categories from projects
  const categories = useMemo(() => {
    if (!Array.isArray(projects) || projects.length === 0) {
      return ['Alle'];
    }
    const cats = ['Alle', ...new Set(projects.map(p => p.category).filter(Boolean))];
    return cats;
  }, [projects]);

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    if (!Array.isArray(projects)) {
      return [];
    }
    let filtered = projects.filter(project => {
      const matchesCategory = selectedCategory === 'Alle' || project.category === selectedCategory;
      const matchesSearch = 
        (project.name?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (project.title?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (project.location?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
        (project.description?.toLowerCase().includes(searchQuery.toLowerCase()) || false);
      return matchesCategory && matchesSearch;
    });

    // Sort projects
    switch (sortBy) {
      case 'Neueste':
        filtered.sort((a, b) => (b.year || 0) - (a.year || 0));
        break;
      case 'Älteste':
        filtered.sort((a, b) => (a.year || 0) - (b.year || 0));
        break;
      case 'Name':
        filtered.sort((a, b) => {
          const nameA = a.name || a.title || '';
          const nameB = b.name || b.title || '';
          return nameA.localeCompare(nameB);
        });
        break;
      case 'Größe':
        filtered.sort((a, b) => {
          const aSize = parseInt(a.area) || 0;
          const bSize = parseInt(b.area) || 0;
          return bSize - aSize;
        });
        break;
      default:
        break;
    }

    return filtered;
  }, [projects, selectedCategory, searchQuery, sortBy]);

  // Custom cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  const handleLoadMore = () => {
    setVisibleProjects(prev => prev + 6);
  };

  const breadcrumbItems = [
    { href: `/${lang}/homepage`, label: dict?.translation?.nav?.home || 'Startseite' },
    { label: dict?.projects?.title || 'Projekte' }
  ];

  return (
    <div className="min-h-screen custom-cursor relative overflow-hidden bg-background">
      <style jsx global>{`
        .custom-cursor {
          cursor: none;
        }
        .custom-cursor * {
          cursor: none !important;
        }
        .cursor-dot {
          position: fixed;
          width: 8px;
          height: 8px;
          background-color: #059669;
          border-radius: 50%;
          pointer-events: none;
          z-index: 10000;
          transform: translate(-50%, -50%);
        }
        .cursor-ring {
          position: fixed;
          width: 30px;
          height: 30px;
          border: 2px solid #059669;
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          opacity: 0.5;
        }
      `}</style>

      <Header dict={dict.translation} lang={lang} />

      {/* Custom Cursor */}
      <motion.div
        className="cursor-dot"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />
      <motion.div
        className="cursor-ring"
        style={{ x: cursorXSpring, y: cursorYSpring }}
      />
      
      {/* Hero Section with Breadcrumb */}
      <section className="pt-20 lg:pt-24 bg-surface/95 backdrop-blur-sm border-b border-border relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <Breadcrumb items={breadcrumbItems} />
          <div className="mt-6">
            <h1 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-light text-primary mb-4">
              {dict?.projects?.title || 'Unsere Projekte'}
            </h1>
            <p className="text-lg lg:text-xl text-text-secondary font-body max-w-3xl">
              {dict?.projects?.subtitle || 'Entdecken Sie unsere realisierten Projekte aus den Bereichen Neubau, Altbausanierung und Innenarchitektur'}
            </p>
          </div>

          {/* API Error Message */}
          {apiError && (
            <motion.div 
              className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-3"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <AlertCircle className="text-yellow-600 mt-0.5" size={20} />
              <div>
                <p className="text-yellow-800 font-medium">CMS-Verbindung nicht verfügbar</p>
                <p className="text-yellow-700 text-sm mt-1">Zeige Demo-Projekte. Die Live-Daten werden geladen, sobald die Verbindung wiederhergestellt ist.</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-6 lg:py-8 border-b border-border bg-background/95 backdrop-blur-sm sticky top-[64px] lg:top-[80px] z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" size={20} />
                <input
                  type="text"
                  placeholder={dict?.projects?.search || "Projekt suchen..."}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200 font-body text-primary placeholder-text-secondary"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-primary transition-colors duration-200"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>

              {/* Filter Controls */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="appearance-none bg-surface border border-border rounded-lg px-4 py-2.5 pr-10 font-body text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
                </div>

                {/* Sort By */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-surface border border-border rounded-lg px-4 py-2.5 pr-10 font-body text-primary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all duration-200"
                  >
                    <option value="Neueste">Neueste</option>
                    <option value="Älteste">Älteste</option>
                    <option value="Name">Name</option>
                    <option value="Größe">Größe</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" size={18} />
                </div>

                {/* View Mode Toggle */}
                <div className="flex items-center bg-surface border border-border rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-accent text-white' 
                        : 'text-text-secondary hover:text-primary'
                    }`}
                    aria-label="Grid view"
                  >
                    <Grid3X3 size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-accent text-white' 
                        : 'text-text-secondary hover:text-primary'
                    }`}
                    aria-label="List view"
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Results Count */}
            <div className="mt-4 text-sm text-text-secondary font-body">
              {filteredAndSortedProjects.length} {dict?.projects?.projectsFound || 'Projekte gefunden'}
            </div>
          </div>
        </section>

      {/* Projects Grid/List */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
              </div>
            ) : filteredAndSortedProjects.length === 0 ? (
              <div className="text-center py-12">
                <Square className="mx-auto text-text-secondary mb-4" size={48} />
                <p className="text-lg text-text-secondary font-body">
                  {dict?.projects?.noProjects || 'Keine Projekte gefunden'}
                </p>
              </div>
            ) : (
              <>
                <div className={viewMode === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8' 
                  : 'space-y-6'
                }>
                  {filteredAndSortedProjects.slice(0, visibleProjects).map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      {viewMode === 'grid' ? (
                        <Link 
                          href={`/${lang}/projekte/${project.id}`}
                          className="group block bg-surface rounded-lg overflow-hidden shadow-subtle hover:shadow-pronounced transition-all duration-300"
                        >
                          <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                            <Image
                              src={project.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}${project.image}` : '/placeholder.jpg'}
                              alt={project.name || project.title || 'Project image'}
                              width={800}
                              height={600}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          </div>
                          <div className="p-6">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-xs font-body font-medium text-accent uppercase tracking-wider">
                                {project.category}
                              </span>
                              <span className="text-xs font-body text-text-secondary">
                                {project.year}
                              </span>
                            </div>
                            <h3 className="text-lg font-heading font-medium text-primary mb-2 group-hover:text-accent transition-colors duration-200">
                              {project.name || project.title}
                            </h3>
                            <div className="flex items-center text-sm text-text-secondary font-body mb-3">
                              <MapPin size={14} className="mr-1" />
                              {project.location}
                            </div>
                            <p className="text-sm text-text-secondary font-body line-clamp-2 mb-3">
                              {project.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4 text-xs font-body text-text-secondary">
                                <span>{project.area}</span>
                                <span className="inline-flex items-center px-2 py-1 rounded-full bg-accent/10 text-accent">
                                  {project.status}
                                </span>
                              </div>
                              <ArrowRight size={16} className="text-accent group-hover:translate-x-1 transition-transform duration-200" />
                            </div>
                          </div>
                        </Link>
                      ) : (
                        <Link 
                          href={`/${lang}/projekte/${project.id}`}
                          className="group flex flex-col lg:flex-row bg-surface rounded-lg overflow-hidden shadow-subtle hover:shadow-pronounced transition-all duration-300"
                        >
                          <div className="lg:w-1/3 aspect-[4/3] lg:aspect-auto overflow-hidden bg-gray-100">
                            <Image
                              src={project.image ? `${process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}${project.image}` : '/placeholder.jpg'}
                              alt={project.name || project.title || 'Project image'}
                              width={400}
                              height={300}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          </div>
                          <div className="flex-1 p-6 lg:p-8">
                            <div className="flex items-center justify-between mb-3">
                              <span className="text-sm font-body font-medium text-accent uppercase tracking-wider">
                                {project.category}
                              </span>
                              <span className="text-sm font-body text-text-secondary">
                                {project.year}
                              </span>
                            </div>
                            <h3 className="text-xl lg:text-2xl font-heading font-medium text-primary mb-2 group-hover:text-accent transition-colors duration-200">
                              {project.name || project.title}
                            </h3>
                            <div className="flex items-center text-sm text-text-secondary font-body mb-4">
                              <MapPin size={16} className="mr-2" />
                              {project.location}
                            </div>
                            <p className="text-text-secondary font-body mb-4">
                              {project.description}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-6 text-sm font-body text-text-secondary">
                                <span>Fläche: {project.area}</span>
                                <span className="inline-flex items-center px-3 py-1 rounded-full bg-accent/10 text-accent">
                                  {project.status}
                                </span>
                              </div>
                              <span className="text-accent font-body font-medium flex items-center group-hover:gap-2 transition-all duration-200">
                                Details ansehen
                                <ArrowRight size={18} className="ml-1" />
                              </span>
                            </div>
                          </div>
                        </Link>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Load More Button */}
                {visibleProjects < filteredAndSortedProjects.length && (
                  <div className="text-center mt-12">
                    <button
                      onClick={handleLoadMore}
                      className="inline-flex items-center space-x-2 bg-accent text-white px-8 py-3 rounded-lg hover:bg-accent/90 transition-colors duration-200 font-body font-medium"
                    >
                      <span>{dict?.projects?.loadMore || 'Mehr Projekte laden'}</span>
                      <ChevronDown size={20} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>

      <Footer dict={dict.translation} lang={lang} onCopyrightClick={handleCopyrightClick} />
    </div>
  );
}