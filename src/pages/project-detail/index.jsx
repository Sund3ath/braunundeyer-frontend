import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Header from 'components/ui/Header';
import Breadcrumb from 'components/ui/Breadcrumb';
import ProjectNavigation from 'components/ui/ProjectNavigation';
import Icon from 'components/AppIcon';
import Image from 'components/AppImage';
import CursorTrail from 'components/ui/CursorTrail';
import Footer from 'components/Footer';
import ProjectGallery from './components/ProjectGallery';
import ProjectMetadata from './components/ProjectMetadata';
import ProjectContent from './components/ProjectContent';
import RelatedProjects from './components/RelatedProjects';
import SocialShare from './components/SocialShare';
import ContactCTA from './components/ContactCTA';
import SEO from 'components/SEO';
import { generateProjectSchema, generateBreadcrumbSchema, combineSchemas } from 'utils/structuredData';

const ProjectDetail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const projectId = parseInt(searchParams.get('id')) || 1;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

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
      title: "Moderne Stadtvilla Saarbrücken",
      location: "Saarbrücken-St. Johann",
      year: 2023,
      area: "420 m²",
      type: "Neubau",
      client: "Familie Müller",
      category: "neubau",
      heroImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&h=800&fit=crop"
      ],
      description: `Diese moderne Stadtvilla repräsentiert ein neues Paradigma im zeitgenössischen Wohnen und verbindet nahtlos modernes Design mit nachhaltiger Architektur. Das Projekt stellt traditionelle Wohnkonzepte in Frage, indem es eine familienorientierte Umgebung schafft, die sowohl individuelle Privatsphäre als auch gemeinschaftliche Interaktion priorisiert.

Die Entwurfsphilosophie konzentriert sich darauf, Räume zu schaffen, die sich an die sich wandelnden Bedürfnisse moderner Familien anpassen und gleichzeitig eine starke Verbindung zur umgebenden Stadtlandschaft aufrechterhalten. Jeder Raum ist sorgfältig positioniert, um natürliches Licht und Querlüftung zu maximieren, wodurch der Energieverbrauch reduziert und die Wohnqualität verbessert wird.`,
      challenges: `Die primäre Herausforderung bestand darin, ein Wohnhaus zu entwerfen, das sich harmonisch in die bestehende Nachbarschaftsstruktur einfügt, ohne dabei seine moderne Identität zu verlieren. Die strengen Münchner Bauvorschriften und die Nähe zu denkmalgeschützten Gebäuden erforderten innovative Lösungen für die Maximierung des Wohnraums bei gleichzeitiger Wahrung der ästhetischen Ansprüche.

Zusätzlich musste das Projekt mit der bestehenden Infrastruktur des Viertels integriert werden, während es seine eigene unverwechselbare Identität etablierte. Die Balance zwischen moderner Architektursprache und kontextueller Sensibilität erwies sich als komplexe Entwurfsherausforderung.`,
      solutions: `Unsere Lösung beinhaltete die Schaffung eines gestuften Gebäudeprofils, das auf die Topographie des Grundstücks reagiert und gleichzeitig jedem Wohnbereich private Außenbereiche bietet. Das Fassadensystem verwendet eine Kombination aus Glas, Stahl und lokal bezogenem Holz, um visuelles Interesse und Umweltleistung zu schaffen.

Wir implementierten ein zentrales Atrium-Design, das als Herzstück des Hauses dient und natürliches Licht in alle Bereiche bringt. Smart-Home-Technologien wurden durchgehend integriert, um die Energieeffizienz zu optimieren und den Bewohnern moderne Annehmlichkeiten zu bieten.`,
      materials: "Stahlbetonskelett, bodentiefe Glaselemente, nachhaltig gewonnene Zedernholzverkleidung, polierte Betonböden und integrierte Smart-Home-Systeme in allen Bereichen.",
      testimonial: {
        text: "Braun & Eyer haben unsere Vision in die Realität umgesetzt. Ihre Liebe zum Detail und ihr innovativer Ansatz für modernes Wohnen haben unsere Erwartungen übertroffen.",
        author: "Familie Müller",
        position: "Bauherren"
      }
    },
    {
      id: 2,
      title: "Bürogebäude Maximilianstraße",
      location: "Saarbrücken-Mitte",
      year: 2023,
      area: "3.200 m²",
      type: "Neubau",
      client: "TechFlow Industries GmbH",
      category: "neubau",
      heroImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop",
      images: [
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop",
        "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200&h=800&fit=crop"
      ],
      description: `Das TechFlow Industries Hauptquartier verkörpert die Zukunft des Arbeitsplatzdesigns und schafft eine Umgebung, die Innovation, Zusammenarbeit und Mitarbeiterwohlbefinden fördert. Dieses Projekt definiert das traditionelle Bürogebäude neu, indem es flexible Arbeitsräume mit modernster Technologie und nachhaltigen Designprinzipien integriert.`,
      challenges: `Die Gestaltung eines Arbeitsplatzes, der sich an schnell verändernde Technologiebedürfnisse anpassen kann, während er eine zeitlose architektonische Präsenz beibehält. Die Herausforderung beinhaltete die Schaffung von Räumen, die sowohl fokussierte Einzelarbeit als auch dynamische Teamzusammenarbeit unterstützen.`,
      solutions: `Wir entwickelten ein modulares Innensystem, das eine einfache Umkonfiguration ermöglicht, während das Unternehmen wächst und sich entwickelt. Das Gebäude verfügt über ein zentrales Atrium, das sowohl als Verkehrsknotenpunkt als auch als Raum für unternehmensweite Versammlungen dient.`,
      materials: "Stahl- und Glas-Vorhangfassadensystem, sichtbare Betonstruktur, recycelte Holzakzente und integrierte LED-Beleuchtungssysteme.",
      testimonial: {
        text: "Unser neues Hauptquartier hat die Art und Weise, wie unser Team zusammenarbeitet, transformiert. Der Raum inspiriert Kreativität und Produktivität auf eine Weise, die wir uns nie vorgestellt hatten.",
        author: "David Chen",
        position: "Geschäftsführer, TechFlow Industries GmbH"
      }
    }
  ];

  const currentProject = projects.find(p => p.id === projectId) || projects[0];
  
  const breadcrumbs = [
    { name: 'Home', url: 'https://braunundeyer.de' },
    { name: 'Projekte', url: 'https://braunundeyer.de/projekte' },
    { name: currentProject.title, url: `https://braunundeyer.de/projekte/${currentProject.id}` }
  ];

  const projectSchemaData = {
    id: currentProject.id,
    title: currentProject.title,
    description: currentProject.description,
    images: currentProject.images.map(img => ({ url: img })),
    dateCreated: `${currentProject.year}-01-01`,
    dateModified: new Date().toISOString(),
    category: currentProject.type,
    tags: [currentProject.type, currentProject.category, currentProject.location],
    location: {
      city: currentProject.location
    }
  };

  const projectDetailSchema = combineSchemas(
    generateProjectSchema(projectSchemaData),
    generateBreadcrumbSchema(breadcrumbs)
  );

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [projectId]);

  // Custom cursor tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [cursorX, cursorY]);

  const handleImageChange = (index) => {
    setCurrentImageIndex(index);
  };

  const handleZoomToggle = () => {
    setIsZoomed(!isZoomed);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex(prev => 
      prev === 0 ? currentProject.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex(prev => 
      prev === currentProject.images.length - 1 ? 0 : prev + 1
    );
  };

  // Background typography words for Project Detail page - removed as we'll place them per section

  return (
    <div className="min-h-screen custom-cursor relative overflow-hidden bg-background">
      <SEO 
        title={`${currentProject.title} | Braun & Eyer Architekturbüro`}
        description={currentProject.description.substring(0, 160)}
        keywords={`${currentProject.title}, ${currentProject.type}, ${currentProject.category}, ${currentProject.location}, Architekturbüro Saarbrücken`}
        image={currentProject.heroImage}
        type="article"
        structuredData={projectDetailSchema}
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
        {/* Hero Section with Breadcrumb */}
        <section className="bg-surface/95 backdrop-blur-sm border-b border-border relative z-base">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="flex items-center justify-between mb-6">
              <Breadcrumb />
              <button
                onClick={() => navigate('/project-gallery')}
                className="flex items-center space-x-2 text-text-secondary hover:text-accent transition-colors duration-200 font-body font-medium"
              >
                <Icon name="ArrowLeft" size={20} />
                <span className="hidden sm:inline">Zurück zur Galerie</span>
              </button>
            </div>
            {/* Project Title */}
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-light text-primary">
                {currentProject.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-text-secondary font-body">
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={16} />
                  <span>{currentProject.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Calendar" size={16} />
                  <span>{currentProject.year}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Square" size={16} />
                  <span>{currentProject.area}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Details Section */}
        <section className="py-8 lg:py-12 relative" style={{ zIndex: 5 }}>
        {/* Background Typography for Project Detail */}
        <div className="absolute inset-0 w-full pointer-events-none" style={{ zIndex: 1 }}>
          <motion.div
            className="absolute text-[10rem] opacity-[0.05] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ right: "-8%", top: "45%" }}
            animate={{
              x: [0, -20, 12, 0],
              y: [0, 10, -8, 0],
              rotate: [0, -0.2, 0.3, 0],
            }}
            transition={{
              duration: 32,
              repeat: Infinity,
              ease: "linear"
            }}
          >
            DETAIL
          </motion.div>
          <motion.div
            className="absolute text-7xl opacity-[0.07] text-gray-400 font-thin select-none whitespace-nowrap"
            style={{ left: "5%", top: "75%" }}
            animate={{
              x: [0, 15, -10, 0],
              y: [0, -12, 8, 0],
              rotate: [0, 0.3, -0.2, 0],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              delay: 3,
              ease: "linear"
            }}
          >
            konzept
          </motion.div>
        </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative" style={{ zIndex: 2 }}>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Main Content Area */}
              <div className="lg:col-span-3 space-y-8">

                {/* Image Gallery */}
                <ProjectGallery
                images={currentProject.images}
                currentIndex={currentImageIndex}
                onImageChange={handleImageChange}
                onPrevImage={handlePrevImage}
                onNextImage={handleNextImage}
                onZoomToggle={handleZoomToggle}
                isZoomed={isZoomed}
                projectTitle={currentProject.title}
              />

                {/* Project Content */}
                <ProjectContent project={currentProject} />

                {/* Social Share */}
                <SocialShare project={currentProject} />

                {/* Contact CTA */}
                <ContactCTA />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-8">
                {/* Project Metadata */}
                <ProjectMetadata project={currentProject} />

                {/* Project Navigation */}
                <ProjectNavigation
                  currentProjectId={projectId}
                  totalProjects={projects.length}
                  showBackToGallery={false}
                />
              </div>
            </div>

            {/* Related Projects */}
            <div className="mt-16 lg:mt-24">
              <RelatedProjects
                currentProjectId={projectId}
                currentCategory={currentProject.category}
                projects={projects}
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50">
        <div className="flex items-center justify-between max-w-sm mx-auto">
          <button
            onClick={() => {
              const prevId = projectId > 1 ? projectId - 1 : projects.length;
              navigate(`/de/projekte/${prevId}`);
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded text-text-secondary hover:text-accent hover:bg-surface transition-colors duration-200"
          >
            <Icon name="ChevronLeft" size={20} />
            <span className="text-sm font-medium">Vorheriges</span>
          </button>
          
          <div className="text-text-secondary text-sm font-caption">
            {projectId} / {projects.length}
          </div>
          
          <button
            onClick={() => {
              const nextId = projectId < projects.length ? projectId + 1 : 1;
              navigate(`/de/projekte/${nextId}`);
            }}
            className="flex items-center space-x-2 px-4 py-2 rounded text-text-secondary hover:text-accent hover:bg-surface transition-colors duration-200"
          >
            <span className="text-sm font-medium">Nächstes</span>
            <Icon name="ChevronRight" size={20} />
          </button>
        </div>
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div className="fixed inset-0 bg-black/90 z-100 flex items-center justify-center p-4">
          <div className="relative max-w-6xl max-h-full">
            <button
              onClick={handleZoomToggle}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors duration-200"
            >
              <Icon name="X" size={24} />
            </button>
            <Image
              src={currentProject.images[currentImageIndex]}
              alt={`${currentProject.title} - Detailansicht`}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;