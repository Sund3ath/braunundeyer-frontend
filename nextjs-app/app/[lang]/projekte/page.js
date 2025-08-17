'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Search, X, ChevronDown, Grid3X3, List, MapPin, Square, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function ProjectsPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang || 'de';
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
      router.push(`/${lang}/admin`);
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

  // Braun & Eyer Projektdaten
  const projects = [
    {
      id: 1,
      name: "Moderne Stadtvilla Saarbrücken",
      location: "Saarbrücken-St. Johann",
      year: 2023,
      category: "Neubau",
      image: "/images/flyer-structure.jpg",
      description: "Zeitgenössische Villa mit klaren Linien, nachhaltigen Materialien und panoramischem Stadtblick.",
      area: "420 m²",
      status: "Fertiggestellt"
    },
    {
      id: 2,
      name: "Bürogebäude Maximilianstraße",
      location: "Saarbrücken-Mitte",
      year: 2023,
      category: "Neubau",
      image: "/images/flyer.jpg",
      description: "Modernes 8-stöckiges Bürogebäude mit innovativem Arbeitsplatzdesign und LEED-Zertifizierung.",
      area: "3.200 m²",
      status: "Fertiggestellt"
    },
    {
      id: 3,
      name: "Penthouse Innenarchitektur",
      location: "Saarbrücken-St. Arnual",
      year: 2022,
      category: "Innenarchitektur",
      image: "/images/howtolook.jpg",
      description: "Hochwertige Innenarchitektur mit maßgefertigten Möbeln und exklusiven Oberflächen.",
      area: "280 m²",
      status: "Fertiggestellt"
    },
    {
      id: 4,
      name: "Denkmalgeschütztes Stadthaus",
      location: "Saarbrücken-Altstadt",
      year: 2022,
      category: "Altbausanierung",
      image: "/images/flyer-structure-ref.jpg",
      description: "Behutsame Sanierung eines historischen Stadthauses aus dem 19. Jahrhundert mit modernen Annehmlichkeiten.",
      area: "650 m²",
      status: "Fertiggestellt"
    },
    {
      id: 5,
      name: "Nachhaltiges Einfamilienhaus",
      location: "Saarbrücken-Dudweiler",
      year: 2023,
      category: "Neubau",
      image: "/images/ferienvilla.png",
      description: "Umweltfreundliches Wohnhaus mit Photovoltaik, Regenwassernutzung und natürlichen Materialien.",
      area: "240 m²",
      status: "In Bearbeitung"
    },
    {
      id: 6,
      name: "Gewerbezentrum Sendling",
      location: "Saarbrücken-Burbach",
      year: 2022,
      category: "Neubau",
      image: "/images/alt_neu_ungestaltung.png",
      description: "Moderner Gewerbebau mit Außenbereichen und nachhaltigen Designelementen.",
      area: "1.800 m²",
      status: "Fertiggestellt"
    },
    {
      id: 7,
      name: "Minimalistische Wohnung",
      location: "Saarbrücken-Malstatt",
      year: 2023,
      category: "Innenarchitektur",
      image: "/images/innenarchitektur.png",
      description: "Klare, minimalistische Innenarchitektur mit optimaler Raumnutzung und natürlichem Licht.",
      area: "95 m²",
      status: "Fertiggestellt"
    },
    {
      id: 8,
      name: "Loft-Umbau Industriegebäude",
      location: "Saarbrücken-Halberg",
      year: 2022,
      category: "Altbausanierung",
      image: "/images/sarnierung_alt_neu.png",
      description: "Umwandlung einer alten Fabrikhalle in moderne Wohnlofts unter Erhaltung des Industriecharakters.",
      area: "1.100 m²",
      status: "Fertiggestellt"
    },
    {
      id: 9,
      name: "Zeitgemäße Büroräume",
      location: "Saarbrücken-St. Arnual",
      year: 2023,
      category: "Innenarchitektur",
      image: "/images/howtolook.jpg",
      description: "Flexible Bürogestaltung zur Förderung von Zusammenarbeit und Mitarbeiterwohlbefinden.",
      area: "850 m²",
      status: "In Bearbeitung"
    },
    {
      id: 10,
      name: "Landhaus im Münchner Umland",
      location: "Starnberg",
      year: 2023,
      category: "Neubau",
      image: "/images/ferienvilla.png",
      description: "Luxuriöses Landhaus, das sich harmonisch in die natürliche Umgebung einfügt.",
      area: "380 m²",
      status: "In Bearbeitung"
    },
    {
      id: 11,
      name: "Restaurant Innengestaltung",
      location: "Saarbrücken-Güntersbürg",
      year: 2022,
      category: "Innenarchitektur",
      image: "/images/innenarchitektur.png",
      description: "Warme, einladende Restaurantgestaltung mit bayerischen Kultureinflüssen.",
      area: "320 m²",
      status: "Fertiggestellt"
    },
    {
      id: 12,
      name: "Schulgebäude Modernisierung",
      location: "Saarbrücken-Eschberg",
      year: 2022,
      category: "Altbausanierung",
      image: "/images/alt_neu_ungestaltung.png",
      description: "Modernisierung von Bildungseinrichtungen unter Bewahrung historischer Architekturelemente.",
      area: "2.100 m²",
      status: "Fertiggestellt"
    }
  ];

  const categories = [
    { name: 'Alle', count: projects.length },
    { name: 'Neubau', count: projects.filter(p => p.category === 'Neubau').length },
    { name: 'Altbausanierung', count: projects.filter(p => p.category === 'Altbausanierung').length },
    { name: 'Innenarchitektur', count: projects.filter(p => p.category === 'Innenarchitektur').length }
  ];

  // Filter and sort projects
  const filteredAndSortedProjects = useMemo(() => {
    let filtered = projects.filter(project => {
      const matchesCategory = selectedCategory === 'Alle' || project.category === selectedCategory;
      const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           project.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    // Sort projects
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'Neueste':
          return b.year - a.year || b.id - a.id;
        case 'Älteste':
          return a.year - b.year || a.id - b.id;
        case 'A-Z':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return filtered;
  }, [selectedCategory, searchQuery, sortBy]);

  const displayedProjects = filteredAndSortedProjects.slice(0, visibleProjects);

  const handleProjectClick = (projectId) => {
    router.push(`/${lang}/projekte/${projectId}`);
  };

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleProjects(prev => prev + 6);
      setIsLoading(false);
    }, 500);
  };

  const handleClearFilters = () => {
    setSelectedCategory('Alle');
    setSearchQuery('');
    setSortBy('Neueste');
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
          background-color: rgb(192, 192, 192);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9999;
          transform: translate(-50%, -50%);
          mix-blend-mode: difference;
        }
        .cursor-ring {
          position: fixed;
          width: 32px;
          height: 32px;
          border: 2px solid rgba(192, 192, 192, 0.5);
          border-radius: 50%;
          pointer-events: none;
          z-index: 9998;
          transform: translate(-50%, -50%);
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
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
      
      {/* Main Content */}
      <main className="pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="bg-surface/95 backdrop-blur-sm border-b border-border relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <Breadcrumb items={[
              { label: 'Home', href: `/${lang}` },
              { label: 'Projekte' }
            ]} />
            <div className="mt-6">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-light text-primary mb-4">
                Projektgalerie
              </h1>
              <p className="text-lg text-text-secondary font-body max-w-2xl">
                Entdecken Sie unser umfassendes Portfolio architektonischer Projekte von Neubau über Altbausanierung bis hin zur Innenarchitektur.
              </p>
            </div>
          </div>
        </section>

        {/* Filters and Controls */}
        <section className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-16 lg:top-20 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Search Bar */}
            <div className="mb-4 lg:mb-6">
              <div className="relative max-w-md">
                <Search 
                  size={20} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary" 
                />
                <input
                  type="text"
                  placeholder="Projekte suchen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-border rounded bg-surface focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-200 font-body"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    <X size={16} />
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
                {(selectedCategory !== 'Alle' || searchQuery) && (
                  <button
                    onClick={handleClearFilters}
                    className="text-text-secondary hover:text-accent transition-colors duration-200 font-body text-sm"
                  >
                    Alle löschen
                  </button>
                )}

                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-surface border border-border rounded px-4 py-2 pr-8 text-sm font-body text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-200"
                  >
                    <option value="Neueste">Neueste</option>
                    <option value="Älteste">Älteste</option>
                    <option value="A-Z">A-Z</option>
                  </select>
                  <ChevronDown 
                    size={16} 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-secondary pointer-events-none" 
                  />
                </div>

                {/* View Toggle */}
                <div className="flex items-center bg-surface border border-border rounded p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded transition-colors duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-accent text-white' 
                        : 'text-text-secondary hover:text-accent'
                    }`}
                  >
                    <Grid3X3 size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-accent text-white' 
                        : 'text-text-secondary hover:text-accent'
                    }`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-8 lg:py-12 relative">
          {/* Background Typography for Projects Grid */}
          <div className="absolute inset-0 w-full pointer-events-none">
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
            <motion.div
              className="absolute text-9xl opacity-[0.10] text-gray-400 font-thin select-none whitespace-nowrap"
              style={{ right: "-8%", top: "70%" }}
              animate={{
                x: [0, -25, 15, 0],
                y: [0, 20, -12, 0],
                rotate: [0, -0.4, 0.5, 0],
              }}
              transition={{
                duration: 28,
                repeat: Infinity,
                delay: 4,
                ease: "linear"
              }}
            >
              portfolio
            </motion.div>
            <motion.div
              className="absolute text-8xl opacity-[0.08] text-gray-400 font-thin select-none whitespace-nowrap"
              style={{ left: "85%", top: "20%" }}
              animate={{
                x: [0, -20, 10, 0],
                y: [0, 15, -8, 0],
                rotate: [0, 0.5, -0.3, 0],
              }}
              transition={{
                duration: 30,
                repeat: Infinity,
                delay: 6,
                ease: "linear"
              }}
            >
              werke
            </motion.div>
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Results Count */}
            <div className="mb-6 lg:mb-8">
              <p className="text-text-secondary font-body">
                Zeige {displayedProjects.length} von {filteredAndSortedProjects.length} Projekten
              </p>
            </div>

            {/* Projects Display */}
            {filteredAndSortedProjects.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 mx-auto mb-4 bg-surface rounded-full flex items-center justify-center">
                  <Search size={32} className="text-text-secondary" />
                </div>
                <h3 className="text-xl font-heading font-light text-primary mb-2">
                  Keine Projekte gefunden
                </h3>
                <p className="text-text-secondary font-body mb-6">
                  Versuchen Sie, Ihre Suchkriterien oder Filter anzupassen
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-accent text-white px-6 py-3 rounded hover:scale-105 hover:shadow-lg transition-all duration-200 font-body font-medium"
                >
                  Filter löschen
                </button>
              </div>
            ) : (
              <>
                {/* Grid View */}
                {viewMode === 'grid' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8">
                    {displayedProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        onClick={() => handleProjectClick(project.id)}
                        className="group cursor-pointer bg-surface rounded overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                      >
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <Image
                            src={project.image}
                            alt={project.name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4 lg:p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              project.category === 'Neubau' ? 'bg-blue-100 text-blue-800' :
                              project.category === 'Altbausanierung' ? 'bg-orange-100 text-orange-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
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
                              <MapPin size={12} />
                              <span>{project.location}</span>
                            </div>
                            <span>{project.area}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* List View */}
                {viewMode === 'list' && (
                  <div className="space-y-6">
                    {displayedProjects.map((project, index) => (
                      <motion.div
                        key={project.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        onClick={() => handleProjectClick(project.id)}
                        className="group cursor-pointer bg-surface rounded overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-1/3 aspect-[4/3] md:aspect-auto overflow-hidden relative">
                            <Image
                              src={project.image}
                              alt={project.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="md:w-2/3 p-6 lg:p-8">
                            <div className="flex items-center justify-between mb-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                project.category === 'Neubau' ? 'bg-blue-100 text-blue-800' :
                                project.category === 'Altbausanierung' ? 'bg-orange-100 text-orange-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
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
                                  <MapPin size={16} />
                                  <span>{project.location}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <Square size={16} />
                                  <span>{project.area}</span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-1 text-accent">
                                <span>Details anzeigen</span>
                                <ArrowRight size={16} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}

                {/* Load More Button */}
                {visibleProjects < filteredAndSortedProjects.length && (
                  <div className="text-center mt-12">
                    <button
                      onClick={handleLoadMore}
                      disabled={isLoading}
                      className="bg-accent text-white px-8 py-3 rounded hover:scale-105 hover:shadow-lg transition-all duration-200 font-body font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <div className="flex items-center space-x-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Lädt...</span>
                        </div>
                      ) : (
                        'Weitere Projekte laden'
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </section>
      </main>

      <Footer dict={dict.translation} lang={lang} onCopyrightClick={handleCopyrightClick} />
    </div>
  );
}