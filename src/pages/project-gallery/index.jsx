import React, { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import CursorTrail from 'components/ui/CursorTrail';
import SEO from 'components/SEO';
import { generateBreadcrumbSchema } from 'utils/structuredData';

const ProjectGallery = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('Alle');
  const [sortBy, setSortBy] = useState('Neueste');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [visibleProjects, setVisibleProjects] = useState(12);

  // Custom cursor motion values
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Braun & Eyer Projektdaten
  const projects = [
    {
      id: 1,
      name: "Moderne Stadtvilla Saarbrücken",
      location: "Saarbrücken-St. Johann",
      year: 2023,
      category: "Neubau",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&h=600&fit=crop",
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
      image: "https://images.pexels.com/photos/325229/pexels-photo-325229.jpeg?w=800&h=600&fit=crop",
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
      image: "https://images.pixabay.com/photo/2016/11/18/17/46/house-1836070_1280.jpg?w=800&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&h=600&fit=crop",
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
      image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg?w=800&h=600&fit=crop",
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
      image: "https://images.pixabay.com/photo/2016/11/29/03/53/architecture-1867187_1280.jpg?w=800&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop",
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
      image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?w=800&h=600&fit=crop",
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
      image: "https://images.pixabay.com/photo/2017/03/28/12/10/chairs-2181947_1280.jpg?w=800&h=600&fit=crop",
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
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&h=600&fit=crop",
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
      image: "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg?w=800&h=600&fit=crop",
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
      image: "https://images.pixabay.com/photo/2016/06/24/10/47/house-1477041_1280.jpg?w=800&h=600&fit=crop",
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
    navigate(`/project-detail?id=${projectId}`);
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

  const breadcrumbs = [
    { name: 'Home', url: 'https://braunundeyer.de' },
    { name: 'Projekte', url: 'https://braunundeyer.de/projekte' }
  ];

  const gallerySchema = generateBreadcrumbSchema(breadcrumbs);

  return (
    <div className="min-h-screen bg-background custom-cursor">
      <SEO 
        title="Projekte | Braun & Eyer Architekturbüro - Portfolio & Referenzen"
        description="Entdecken Sie unsere Architekturprojekte: Moderne Neubauten, stilvolle Sanierungen und nachhaltige Bauprojekte. Lassen Sie sich von unseren Referenzen inspirieren."
        keywords="Architektur Portfolio, Bauprojekte Saarbrücken, Referenzen Architekt, Neubau Beispiele, Sanierung Projekte, Braun Eyer Projekte"
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
        <section className="bg-surface border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <Breadcrumb />
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
        <section className="bg-background border-b border-border sticky top-16 lg:top-20 z-50">
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
                  placeholder="Projekte suchen..."
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
                        ? 'bg-accent text-white' :'bg-surface text-text-secondary hover:bg-accent/10 hover:text-accent border border-border'
                    }`}
                  >
                    <span>{category.name}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      selectedCategory === category.name
                        ? 'bg-white/20 text-white' :'bg-text-secondary/10 text-text-secondary'
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
                    className="appearance-none bg-surface border border-border rounded-minimal px-4 py-2 pr-8 text-sm font-body text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-colors duration-200"
                  >
                    <option value="Neueste">Neueste</option>
                    <option value="Älteste">Älteste</option>
                    <option value="A-Z">A-Z</option>
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
                      viewMode === 'grid' ?'bg-accent text-white' :'text-text-secondary hover:text-accent'
                    }`}
                  >
                    <Icon name="Grid3X3" size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded transition-colors duration-200 ${
                      viewMode === 'list' ?'bg-accent text-white' :'text-text-secondary hover:text-accent'
                    }`}
                  >
                    <Icon name="List" size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
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
                <Icon name="Search" size={32} className="text-text-secondary" />
              </div>
              <h3 className="text-xl font-heading font-light text-primary mb-2">
                Keine Projekte gefunden
              </h3>
              <p className="text-text-secondary font-body mb-6">
                Versuchen Sie, Ihre Suchkriterien oder Filter anzupassen
              </p>
              <button
                onClick={handleClearFilters}
                className="bg-accent text-white px-6 py-3 rounded-minimal hover:scale-102 hover:shadow-lg transition-all duration-200 font-body font-medium"
              >
                Filter löschen
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
                      className="group cursor-pointer bg-surface rounded-minimal overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:scale-102"
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
                      className="group cursor-pointer bg-surface rounded-minimal overflow-hidden border border-border hover:shadow-lg transition-all duration-300 hover:scale-[1.01]"
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
                                <Icon name="MapPin" size={16} />
                                <span>{project.location}</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <Icon name="Square" size={16} />
                                <span>{project.area}</span>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 text-accent">
                              <span>Details anzeigen</span>
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
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white mt-16">
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
                Außergewöhnliche Architekturlösungen, die Innovation mit Funktionalität verbinden.
              </p>
            </div>
            
            <div>
              <h4 className="font-heading font-medium text-lg mb-4">Schnellzugriff</h4>
              <ul className="space-y-2">
                <li>
                  <Link to="/homepage" className="text-white/80 hover:text-accent transition-colors duration-200 font-body">
                    Startseite
                  </Link>
                </li>
                <li>
                  <Link to="/about-us" className="text-white/80 hover:text-accent transition-colors duration-200 font-body">
                    Über uns
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="text-white/80 hover:text-accent transition-colors duration-200 font-body">
                    Leistungen
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="text-white/80 hover:text-accent transition-colors duration-200 font-body">
                    Kontakt
                  </Link>
                </li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-medium text-lg mb-4">Leistungen</h4>
              <ul className="space-y-2 text-white/80 font-body">
                <li>Neubau</li>
                <li>Altbausanierung</li>
                <li>Innenarchitektur</li>
                <li>Energieberatung</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-heading font-medium text-lg mb-4">Kontakt</h4>
              <div className="space-y-2 text-white/80 font-body">
                <p>Maximilianstraße 35</p>
                <p>66111 Saarbrücken</p>
                <p>+49 (89) 123-4567</p>
                <p>info@braun-eyer.de</p>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/20 mt-8 pt-8 text-center">
            <p className="text-white/60 font-body">
              © {new Date().getFullYear()} Braun & Eyer Architekturbüro Ingenieure. Alle Rechte vorbehalten.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProjectGallery;