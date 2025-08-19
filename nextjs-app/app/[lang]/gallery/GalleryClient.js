'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronRight, RefreshCw, Grid3X3, Maximize2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const GalleryClient = ({ lang, dict }) => {
  // Layout patterns for collage
  const layoutItems = useMemo(() => [
    { id: 0, gridArea: '1 / 1 / 3 / 3', size: 'large' },
    { id: 1, gridArea: '1 / 3 / 2 / 5', size: 'wide' },
    { id: 2, gridArea: '2 / 3 / 4 / 4', size: 'tall' },
    { id: 3, gridArea: '2 / 4 / 3 / 5', size: 'medium' },
    { id: 4, gridArea: '3 / 1 / 4 / 3', size: 'wide' },
    { id: 5, gridArea: '3 / 4 / 5 / 5', size: 'tall' },
    { id: 6, gridArea: '4 / 1 / 6 / 2', size: 'tall' },
    { id: 7, gridArea: '4 / 2 / 5 / 4', size: 'wide' },
    { id: 8, gridArea: '5 / 2 / 6 / 3', size: 'medium' },
    { id: 9, gridArea: '5 / 3 / 7 / 5', size: 'large' },
    { id: 10, gridArea: '6 / 1 / 7 / 2', size: 'medium' },
    { id: 11, gridArea: '7 / 1 / 8 / 3', size: 'wide' },
    { id: 12, gridArea: '7 / 3 / 8 / 4', size: 'medium' },
    { id: 13, gridArea: '7 / 4 / 8 / 5', size: 'medium' },
    { id: 14, gridArea: '1 / 5 / 3 / 6', size: 'tall' },
    { id: 15, gridArea: '3 / 5 / 5 / 6', size: 'tall' }
  ], []);

  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [projects, setProjects] = useState([]);
  const [flippedCards, setFlippedCards] = useState(new Set());
  const [autoFlipEnabled, setAutoFlipEnabled] = useState(true);

  // Translations
  const translations = {
    de: {
      title: 'Galerie',
      subtitle: 'Eine inspirierende Sammlung unserer Projekte',
      refreshPhotos: 'Fotos aktualisieren',
      clickToFlip: 'Klicken zum Umdrehen',
      flipped: 'Umgedreht',
      autoFlip: 'Auto-Flip',
      viewFullscreen: 'Vollbild ansehen',
      close: 'Schließen',
      projectDetails: 'Projektdetails',
      breadcrumb: {
        home: 'Startseite',
        gallery: 'Galerie'
      }
    },
    en: {
      title: 'Gallery',
      subtitle: 'An inspiring collection of our projects',
      refreshPhotos: 'Refresh Photos',
      clickToFlip: 'Click to flip',
      flipped: 'Flipped',
      autoFlip: 'Auto-Flip',
      viewFullscreen: 'View Fullscreen',
      close: 'Close',
      projectDetails: 'Project Details',
      breadcrumb: {
        home: 'Home',
        gallery: 'Gallery'
      }
    },
    fr: {
      title: 'Galerie',
      subtitle: 'Une collection inspirante de nos projets',
      refreshPhotos: 'Actualiser les photos',
      clickToFlip: 'Cliquez pour retourner',
      flipped: 'Retourné',
      autoFlip: 'Rotation automatique',
      viewFullscreen: 'Plein écran',
      close: 'Fermer',
      projectDetails: 'Détails du projet',
      breadcrumb: {
        home: 'Accueil',
        gallery: 'Galerie'
      }
    },
    it: {
      title: 'Galleria',
      subtitle: 'Una collezione ispiratrice dei nostri progetti',
      refreshPhotos: 'Aggiorna foto',
      clickToFlip: 'Clicca per girare',
      flipped: 'Girato',
      autoFlip: 'Rotazione automatica',
      viewFullscreen: 'Schermo intero',
      close: 'Chiudi',
      projectDetails: 'Dettagli del progetto',
      breadcrumb: {
        home: 'Home',
        gallery: 'Galleria'
      }
    },
    es: {
      title: 'Galería',
      subtitle: 'Una colección inspiradora de nuestros proyectos',
      refreshPhotos: 'Actualizar fotos',
      clickToFlip: 'Haz clic para voltear',
      flipped: 'Volteado',
      autoFlip: 'Volteo automático',
      viewFullscreen: 'Pantalla completa',
      close: 'Cerrar',
      projectDetails: 'Detalles del proyecto',
      breadcrumb: {
        home: 'Inicio',
        gallery: 'Galería'
      }
    }
  };

  const t = translations[lang] || translations.de;

  // Fetch projects and their images
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
        const response = await fetch(`${backendUrl}/api/projects?status=published`);
        const data = await response.json();
        
        if (data.projects) {
          setProjects(data.projects);
          
          // Create photo array from project images
          const allPhotos = [];
          data.projects.forEach(project => {
            // Use the main image if available
            if (project.image) {
              const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
              allPhotos.push({
                url: `${backendUrl}${project.image}`,
                projectId: project.id,
                projectTitle: project.title,
                projectLocation: project.location
              });
            }
            // Also add gallery images if available
            if (project.gallery && Array.isArray(project.gallery)) {
              project.gallery.forEach(image => {
                const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
                allPhotos.push({
                  url: `${backendUrl}${image}`,
                  projectId: project.id,
                  projectTitle: project.title,
                  projectLocation: project.location
                });
              });
            }
          });

          // If we have fewer photos than layout items, duplicate them (but only if we have at least one photo)
          if (allPhotos.length > 0) {
            while (allPhotos.length < layoutItems.length * 2) {
              const photosToAdd = allPhotos.slice(0, Math.min(allPhotos.length, layoutItems.length - allPhotos.length));
              if (photosToAdd.length === 0) break; // Prevent infinite loop
              allPhotos.push(...photosToAdd);
            }
          }

          // Map photos to layout items
          if (allPhotos.length > 0) {
            const mappedPhotos = layoutItems.map((item, index) => {
              const photoIndex = index % allPhotos.length;
              const backPhotoIndex = (index + Math.floor(allPhotos.length / 2)) % allPhotos.length;
              
              return {
                ...item,
                frontImage: allPhotos[photoIndex] || null,
                backImage: allPhotos[backPhotoIndex] || null,
                isFlipped: false
              };
            });

            setPhotos(mappedPhotos);
          } else {
            // If no photos available, use placeholders
            const placeholderPhotos = layoutItems.map((item, index) => ({
              ...item,
              frontImage: {
                url: `https://picsum.photos/600/400?random=${index}`,
                projectTitle: 'Projekt ' + (index + 1),
                projectLocation: 'Saarbrücken'
              },
              backImage: {
                url: `https://picsum.photos/600/400?random=${index + 20}`,
                projectTitle: 'Projekt ' + (index + 21),
                projectLocation: 'Saarbrücken'
              },
              isFlipped: false
            }));
            setPhotos(placeholderPhotos);
          }
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        // Use placeholder images if API fails
        const placeholderPhotos = layoutItems.map((item, index) => ({
          ...item,
          frontImage: {
            url: `https://picsum.photos/600/400?random=${index}`,
            projectTitle: 'Projekt ' + (index + 1),
            projectLocation: 'Saarbrücken'
          },
          backImage: {
            url: `https://picsum.photos/600/400?random=${index + 20}`,
            projectTitle: 'Projekt ' + (index + 21),
            projectLocation: 'Saarbrücken'
          },
          isFlipped: false
        }));
        setPhotos(placeholderPhotos);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [layoutItems]);

  // Auto-flip animation
  useEffect(() => {
    if (!autoFlipEnabled || photos.length === 0) return;

    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * photos.length);
      setFlippedCards(prev => {
        const newSet = new Set(prev);
        if (newSet.has(randomIndex)) {
          newSet.delete(randomIndex);
        } else {
          newSet.add(randomIndex);
        }
        return newSet;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, [autoFlipEnabled, photos.length]);

  const handlePhotoClick = useCallback((photoId) => {
    setFlippedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(photoId)) {
        newSet.delete(photoId);
      } else {
        newSet.add(photoId);
      }
      return newSet;
    });
  }, []);

  const shuffleGallery = useCallback(() => {
    setPhotos(prev => {
      const shuffled = [...prev];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const tempFront = shuffled[i].frontImage;
        const tempBack = shuffled[i].backImage;
        shuffled[i].frontImage = shuffled[j].frontImage;
        shuffled[i].backImage = shuffled[j].backImage;
        shuffled[j].frontImage = tempFront;
        shuffled[j].backImage = tempBack;
      }
      return shuffled;
    });
    setFlippedCards(new Set());
  }, []);

  const openLightbox = useCallback((photo) => {
    setSelectedPhoto(photo);
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedPhoto(null);
  }, []);

  return (
    <>
      <Header dict={dict} lang={lang} />
      
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section with Breadcrumb */}
        <section className="pt-20 lg:pt-24 bg-surface/95 backdrop-blur-sm border-b border-border relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            {/* Breadcrumb */}
            <nav className="flex items-center space-x-2 text-sm mb-6">
              <Link href={`/${lang}/homepage`} className="text-text-secondary hover:text-primary transition-colors">
                {t.breadcrumb.home}
              </Link>
              <ChevronRight className="w-4 h-4 text-text-secondary" />
              <span className="text-primary">{t.breadcrumb.gallery}</span>
            </nav>
            
            {/* Title and Subtitle */}
            <div>
              <h1 className="text-3xl lg:text-4xl xl:text-5xl font-heading font-light text-primary mb-4">
                {t.title}
              </h1>
              <p className="text-xl lg:text-2xl text-text-secondary font-body leading-relaxed">
                {t.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section className="pt-12 pb-20">
          <div className="container mx-auto px-4">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {/* Controls */}
                <div className="flex justify-center items-center space-x-4 mb-12">
                  <button
                    onClick={shuffleGallery}
                    className="group flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-full hover:bg-primary-dark transition-all duration-300 transform hover:scale-105"
                  >
                    <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                    <span>{t.refreshPhotos}</span>
                  </button>
                  
                  <button
                    onClick={() => setAutoFlipEnabled(!autoFlipEnabled)}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-full transition-all duration-300 ${
                      autoFlipEnabled 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Grid3X3 className="w-5 h-5" />
                    <span>{t.autoFlip}</span>
                  </button>
                </div>

                {/* Collage Grid */}
                <div 
                  className="grid gap-4 mx-auto"
                  style={{
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gridTemplateRows: 'repeat(7, 120px)',
                    maxWidth: '1200px'
                  }}
                >
                  {photos.map((photo) => {
                    const isFlipped = flippedCards.has(photo.id);
                    const currentImage = isFlipped ? photo.backImage : photo.frontImage;
                    
                    if (!currentImage) return null;

                    return (
                      <motion.div
                        key={photo.id}
                        className="relative cursor-pointer group"
                        style={{ 
                          gridArea: photo.gridArea,
                          perspective: '1000px'
                        }}
                        onClick={() => handlePhotoClick(photo.id)}
                        whileHover={{ scale: 1.02 }}
                        transition={{ duration: 0.3 }}
                      >
                        <motion.div 
                          className="relative w-full h-full"
                          animate={{ rotateY: isFlipped ? 180 : 0 }}
                          transition={{ duration: 0.7 }}
                          style={{ transformStyle: 'preserve-3d' }}
                        >
                          {/* Front Side */}
                          <div 
                            className="absolute inset-0 w-full h-full rounded-lg overflow-hidden shadow-lg"
                            style={{ backfaceVisibility: 'hidden' }}
                          >
                            {photo.frontImage && (
                              <div className="relative w-full h-full">
                                <img
                                  src={photo.frontImage.url}
                                  alt={photo.frontImage.projectTitle || 'Gallery image'}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                  <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-white text-sm font-medium">
                                      {photo.frontImage.projectTitle}
                                    </p>
                                    <p className="text-white/80 text-xs">
                                      {photo.frontImage.projectLocation}
                                    </p>
                                  </div>
                                  <div className="absolute top-4 right-4">
                                    <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-medium text-gray-800">
                                      {t.clickToFlip}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Back Side */}
                          <div 
                            className="absolute inset-0 w-full h-full rounded-lg overflow-hidden shadow-lg"
                            style={{ 
                              backfaceVisibility: 'hidden',
                              transform: 'rotateY(180deg)'
                            }}
                          >
                            {photo.backImage && (
                              <div className="relative w-full h-full">
                                <img
                                  src={photo.backImage.url}
                                  alt={photo.backImage.projectTitle || 'Gallery image'}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent">
                                  <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-white text-sm font-medium">
                                      {photo.backImage.projectTitle}
                                    </p>
                                    <p className="text-white/80 text-xs">
                                      {photo.backImage.projectLocation}
                                    </p>
                                  </div>
                                  <div className="absolute top-4 right-4">
                                    <div className="bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                                      {t.flipped}
                                    </div>
                                  </div>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openLightbox(photo.backImage);
                                    }}
                                    className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm p-2 rounded-full hover:bg-white transition-colors"
                                  >
                                    <Maximize2 className="w-4 h-4 text-gray-800" />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>

        {/* Lightbox */}
        <AnimatePresence>
          {selectedPhoto && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.projectTitle || 'Gallery image'}
                  className="max-w-full max-h-full object-contain"
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8">
                  <h3 className="text-white text-2xl font-light mb-2">
                    {selectedPhoto.projectTitle}
                  </h3>
                  <p className="text-white/80">
                    {selectedPhoto.projectLocation}
                  </p>
                  {selectedPhoto.projectId && (
                    <Link
                      href={`/${lang}/projekte/${selectedPhoto.projectId}`}
                      className="inline-block mt-4 px-6 py-2 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      {t.projectDetails}
                    </Link>
                  )}
                </div>

                <button
                  onClick={closeLightbox}
                  className="absolute top-4 right-4 bg-white/10 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/20 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </>
  );
};

export default GalleryClient;