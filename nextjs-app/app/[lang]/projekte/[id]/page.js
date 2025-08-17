'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { 
  MapPin, Calendar, Square, ArrowLeft, ChevronLeft, ChevronRight, 
  X, Share2, Facebook, Twitter, Linkedin, Copy, Check, ZoomIn,
  Building2, Users, Palette, TreePine
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Breadcrumb from '@/components/ui/Breadcrumb';

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang || 'de';
  const projectId = parseInt(params.id) || 1;
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [dict, setDict] = useState({});
  const [copied, setCopied] = useState(false);

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

Die Entwurfsphilosophie konzentriert sich darauf, Räume zu schaffen, die sich an die sich wandelnden Bedürfnisse moderner Familien anpassen und gleichzeitig eine starke Verbindung zur umgebenden Stadtlandschaft aufrechterhalten.`,
      challenges: `Die primäre Herausforderung bestand darin, ein Wohnhaus zu entwerfen, das sich harmonisch in die bestehende Nachbarschaftsstruktur einfügt, ohne dabei seine moderne Identität zu verlieren.`,
      solutions: `Unsere Lösung beinhaltete die Schaffung eines gestuften Gebäudeprofils, das auf die Topographie des Grundstücks reagiert und gleichzeitig jedem Wohnbereich private Außenbereiche bietet.`,
      materials: "Stahlbetonskelett, bodentiefe Glaselemente, nachhaltig gewonnene Zedernholzverkleidung, polierte Betonböden.",
      testimonial: {
        text: "Braun & Eyer haben unsere Vision in die Realität umgesetzt. Ihre Liebe zum Detail und ihr innovativer Ansatz haben unsere Erwartungen übertroffen.",
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
      description: `Das TechFlow Industries Hauptquartier verkörpert die Zukunft des Arbeitsplatzdesigns und schafft eine Umgebung, die Innovation, Zusammenarbeit und Mitarbeiterwohlbefinden fördert.`,
      challenges: `Die Gestaltung eines Arbeitsplatzes, der sich an schnell verändernde Technologiebedürfnisse anpassen kann.`,
      solutions: `Wir entwickelten ein modulares Innensystem, das eine einfache Umkonfiguration ermöglicht.`,
      materials: "Stahl- und Glas-Vorhangfassadensystem, sichtbare Betonstruktur, recycelte Holzakzente.",
      testimonial: {
        text: "Unser neues Hauptquartier hat die Art und Weise, wie unser Team zusammenarbeitet, transformiert.",
        author: "David Chen",
        position: "Geschäftsführer, TechFlow Industries GmbH"
      }
    }
  ];

  const currentProject = projects.find(p => p.id === projectId) || projects[0];

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

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = currentProject.title;
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${url}&text=${title}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  // Get related projects
  const relatedProjects = projects.filter(p => 
    p.id !== projectId && p.category === currentProject.category
  ).slice(0, 3);

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
        {/* Hero Section with Breadcrumb */}
        <section className="bg-surface/95 backdrop-blur-sm border-b border-border relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="flex items-center justify-between mb-6">
              <Breadcrumb items={[
                { label: 'Home', href: `/${lang}` },
                { label: 'Projekte', href: `/${lang}/projekte` },
                { label: currentProject.title }
              ]} />
              <button
                onClick={() => router.push(`/${lang}/projekte`)}
                className="flex items-center space-x-2 text-text-secondary hover:text-accent transition-colors duration-200 font-body font-medium"
              >
                <ArrowLeft size={20} />
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
                  <MapPin size={16} />
                  <span>{currentProject.location}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar size={16} />
                  <span>{currentProject.year}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Square size={16} />
                  <span>{currentProject.area}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Details Section */}
        <section className="py-8 lg:py-12 relative">
          {/* Background Typography */}
          <div className="absolute inset-0 w-full pointer-events-none">
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
          </div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 lg:gap-12">
              {/* Main Content Area */}
              <div className="lg:col-span-3 space-y-8">
                {/* Image Gallery */}
                <div className="space-y-4">
                  {/* Main Image */}
                  <div className="relative h-[400px] lg:h-[600px] rounded overflow-hidden group">
                    <Image
                      src={currentProject.images[currentImageIndex]}
                      alt={`${currentProject.title} - Bild ${currentImageIndex + 1}`}
                      fill
                      className="object-cover"
                      priority
                    />
                    <button
                      onClick={handleZoomToggle}
                      className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <ZoomIn size={20} />
                    </button>
                    
                    {/* Navigation Arrows */}
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                  
                  {/* Thumbnail Gallery */}
                  <div className="grid grid-cols-4 gap-2">
                    {currentProject.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => handleImageChange(index)}
                        className={`relative h-24 rounded overflow-hidden ${
                          index === currentImageIndex ? 'ring-2 ring-accent' : ''
                        }`}
                      >
                        <Image
                          src={image}
                          alt={`Thumbnail ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Project Content */}
                <div className="space-y-8">
                  <div>
                    <h2 className="text-2xl font-heading font-medium text-primary mb-4">
                      Projektbeschreibung
                    </h2>
                    <p className="text-text-secondary font-body whitespace-pre-line">
                      {currentProject.description}
                    </p>
                  </div>

                  {currentProject.challenges && (
                    <div>
                      <h3 className="text-xl font-heading font-medium text-primary mb-3">
                        Herausforderungen
                      </h3>
                      <p className="text-text-secondary font-body">
                        {currentProject.challenges}
                      </p>
                    </div>
                  )}

                  {currentProject.solutions && (
                    <div>
                      <h3 className="text-xl font-heading font-medium text-primary mb-3">
                        Lösungen
                      </h3>
                      <p className="text-text-secondary font-body">
                        {currentProject.solutions}
                      </p>
                    </div>
                  )}

                  {currentProject.testimonial && (
                    <div className="bg-surface rounded p-6 lg:p-8 border border-border">
                      <blockquote className="space-y-4">
                        <p className="text-lg font-body text-text-primary italic">
                          "{currentProject.testimonial.text}"
                        </p>
                        <footer className="text-sm text-text-secondary">
                          <cite className="not-italic">
                            <span className="font-medium text-primary">{currentProject.testimonial.author}</span>
                            <br />
                            {currentProject.testimonial.position}
                          </cite>
                        </footer>
                      </blockquote>
                    </div>
                  )}
                </div>

                {/* Social Share */}
                <div className="flex items-center space-x-4 pt-8 border-t border-border">
                  <span className="text-text-secondary font-body">Teilen:</span>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="p-2 bg-surface rounded hover:bg-accent hover:text-white transition-colors duration-200"
                  >
                    <Facebook size={20} />
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="p-2 bg-surface rounded hover:bg-accent hover:text-white transition-colors duration-200"
                  >
                    <Twitter size={20} />
                  </button>
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="p-2 bg-surface rounded hover:bg-accent hover:text-white transition-colors duration-200"
                  >
                    <Linkedin size={20} />
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="p-2 bg-surface rounded hover:bg-accent hover:text-white transition-colors duration-200"
                  >
                    {copied ? <Check size={20} /> : <Copy size={20} />}
                  </button>
                </div>

                {/* Contact CTA */}
                <div className="bg-primary text-white rounded p-8 lg:p-12 text-center">
                  <h3 className="text-2xl font-heading font-light mb-4">
                    Haben Sie ein ähnliches Projekt im Sinn?
                  </h3>
                  <p className="mb-6 opacity-90">
                    Lassen Sie uns über Ihre Ideen sprechen und gemeinsam etwas Außergewöhnliches schaffen.
                  </p>
                  <Link
                    href={`/${lang}/kontakt`}
                    className="inline-flex items-center space-x-2 bg-white text-primary px-6 py-3 rounded hover:bg-accent hover:text-white transition-colors duration-200 font-body font-medium"
                  >
                    <span>Projekt besprechen</span>
                    <ArrowLeft className="rotate-180" size={20} />
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1 space-y-8">
                {/* Project Metadata */}
                <div className="bg-surface rounded p-6 border border-border">
                  <h3 className="text-lg font-heading font-medium text-primary mb-4">
                    Projektdetails
                  </h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-text-secondary font-body">Kunde</dt>
                      <dd className="font-medium text-primary">{currentProject.client}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-text-secondary font-body">Typ</dt>
                      <dd className="font-medium text-primary">{currentProject.type}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-text-secondary font-body">Fläche</dt>
                      <dd className="font-medium text-primary">{currentProject.area}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-text-secondary font-body">Jahr</dt>
                      <dd className="font-medium text-primary">{currentProject.year}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-text-secondary font-body">Standort</dt>
                      <dd className="font-medium text-primary">{currentProject.location}</dd>
                    </div>
                    {currentProject.materials && (
                      <div>
                        <dt className="text-sm text-text-secondary font-body">Materialien</dt>
                        <dd className="text-sm text-primary">{currentProject.materials}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Project Navigation */}
                <div className="bg-surface rounded p-6 border border-border">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-heading font-medium text-primary">
                      Navigation
                    </h3>
                    <span className="text-sm text-text-secondary">
                      {projectId} / {projects.length}
                    </span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        const prevId = projectId > 1 ? projectId - 1 : projects.length;
                        router.push(`/${lang}/projekte/${prevId}`);
                      }}
                      className="flex-1 px-4 py-2 bg-background rounded hover:bg-accent hover:text-white transition-colors duration-200"
                    >
                      <ChevronLeft size={20} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => router.push(`/${lang}/projekte`)}
                      className="flex-1 px-4 py-2 bg-background rounded hover:bg-accent hover:text-white transition-colors duration-200"
                    >
                      <Square size={20} className="mx-auto" />
                    </button>
                    <button
                      onClick={() => {
                        const nextId = projectId < projects.length ? projectId + 1 : 1;
                        router.push(`/${lang}/projekte/${nextId}`);
                      }}
                      className="flex-1 px-4 py-2 bg-background rounded hover:bg-accent hover:text-white transition-colors duration-200"
                    >
                      <ChevronRight size={20} className="mx-auto" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Projects */}
            {relatedProjects.length > 0 && (
              <div className="mt-16 lg:mt-24">
                <h2 className="text-2xl lg:text-3xl font-heading font-light text-primary mb-8">
                  Ähnliche Projekte
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                  {relatedProjects.map((project) => (
                    <Link
                      key={project.id}
                      href={`/${lang}/projekte/${project.id}`}
                      className="group"
                    >
                      <div className="bg-surface rounded overflow-hidden hover:shadow-lg transition-all duration-300">
                        <div className="relative h-48">
                          <Image
                            src={project.heroImage}
                            alt={project.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <div className="p-4">
                          <h3 className="font-heading font-medium text-primary mb-2 group-hover:text-accent transition-colors duration-200">
                            {project.title}
                          </h3>
                          <p className="text-sm text-text-secondary">
                            {project.location} • {project.year}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer dict={dict.translation} lang={lang} />

      {/* Zoom Modal */}
      {isZoomed && (
        <motion.div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleZoomToggle}
        >
          <div className="relative max-w-6xl max-h-full">
            <button
              onClick={handleZoomToggle}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors duration-200"
            >
              <X size={24} />
            </button>
            <Image
              src={currentProject.images[currentImageIndex]}
              alt={`${currentProject.title} - Detailansicht`}
              width={1200}
              height={800}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}