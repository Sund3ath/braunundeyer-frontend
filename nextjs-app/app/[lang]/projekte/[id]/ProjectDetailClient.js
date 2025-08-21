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

export default function ProjectDetailClient({ project, relatedProjects = [], dict = {} }) {
  const params = useParams();
  const router = useRouter();
  const lang = params.lang || 'de';
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Custom cursor motion values
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const springConfig = { damping: 25, stiffness: 700 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // If no project found, show error
  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading text-primary mb-4">
            {dict?.projects?.notFound || 'Projekt nicht gefunden'}
          </h1>
          <Link
            href={`/${lang}/projekte`}
            className="text-accent hover:underline"
          >
            {dict?.projects?.backToProjects || 'Zurück zu den Projekten'}
          </Link>
        </div>
      </div>
    );
  }

  // Prepare images array
  const projectImages = project.images?.length > 0 ? project.images : 
    (project.image ? [project.image] : []);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  };

  const handleShare = (platform) => {
    const url = window.location.href;
    const title = project.name || project.title;
    
    switch(platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
    }
  };

  // Lightbox functions
  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    document.body.style.overflow = 'unset';
  };

  const nextLightboxImage = () => {
    setLightboxIndex((prev) => (prev + 1) % projectImages.length);
  };

  const prevLightboxImage = () => {
    setLightboxIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
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

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextLightboxImage();
      } else if (e.key === 'ArrowLeft') {
        prevLightboxImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen]);

  const breadcrumbItems = [
    { href: `/${lang}/homepage`, label: dict?.translation?.nav?.home || 'Startseite' },
    { href: `/${lang}/projekte`, label: dict?.projects?.title || 'Projekte' },
    { label: project.name || project.title || 'Projekt' }
  ];

  // Get category icon
  const getCategoryIcon = (category) => {
    switch(category?.toLowerCase()) {
      case 'neubau':
        return <Building2 size={20} />;
      case 'altbausanierung':
        return <Users size={20} />;
      case 'innenarchitektur':
        return <Palette size={20} />;
      case 'außenanlagen':
        return <TreePine size={20} />;
      default:
        return <Building2 size={20} />;
    }
  };

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

      {/* Main Content */}
      <main className="pt-20 lg:pt-24">
        {/* Breadcrumb Section */}
        <section className="bg-surface/95 backdrop-blur-sm border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </section>

        {/* Hero Section with Image Gallery */}
        <section className="relative">
          <div className="relative h-[400px] lg:h-[600px] overflow-hidden">
            {projectImages.length > 0 ? (
              <>
                <Image
                  src={projectImages[currentImageIndex]}
                  alt={`${project.name || project.title} - Image ${currentImageIndex + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 66vw"
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {/* Image Controls */}
                {projectImages.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-colors duration-200"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-colors duration-200"
                    >
                      <ChevronRight size={24} />
                    </button>
                    
                    {/* Image Indicators */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-2">
                      {projectImages.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full transition-all duration-200 ${
                            index === currentImageIndex
                              ? 'w-8 bg-white'
                              : 'bg-white/50 hover:bg-white/70'
                          }`}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Zoom Button */}
                <button
                  onClick={() => setIsZoomed(true)}
                  className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-3 rounded-full transition-colors duration-200"
                >
                  <ZoomIn size={20} />
                </button>
              </>
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800" />
            )}
            
            {/* Project Title Overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
              <div className="max-w-7xl mx-auto">
                <motion.h1 
                  className="text-3xl lg:text-5xl font-heading font-light text-white mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  {project.name || project.title}
                </motion.h1>
                <motion.div 
                  className="flex flex-wrap gap-4 text-white/90"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <div className="flex items-center space-x-2">
                    <MapPin size={18} />
                    <span>{project.location}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar size={18} />
                    <span>{project.year}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Square size={18} />
                    <span>{project.area}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getCategoryIcon(project.category)}
                    <span>{project.category}</span>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Project Details */}
        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-2xl lg:text-3xl font-heading font-light text-primary mb-6">
                    {dict?.projects?.projectDescription || 'Projektbeschreibung'}
                  </h2>
                  <div className="prose prose-lg max-w-none text-text-secondary font-body">
                    <p>{project.description || project.fullDescription}</p>
                    {project.details && (
                      <div className="mt-6">
                        {project.details.split('\n').map((paragraph, index) => (
                          <p key={index}>{paragraph}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>

                {/* Image Thumbnails */}
                {projectImages.length > 1 && (
                  <motion.div
                    className="mt-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <h3 className="text-xl font-heading font-medium text-primary mb-6">
                      {dict?.projects?.moreImages || 'Weitere Bilder'}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {projectImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => openLightbox(index)}
                          className="relative aspect-[4/3] overflow-hidden rounded-lg hover:ring-2 hover:ring-accent transition-all duration-200 group"
                        >
                          <Image
                            src={image}
                            alt={`${project.name} - Thumbnail ${index + 1}`}
                            fill
                            sizes="(max-width: 768px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                            <ZoomIn className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" size={24} />
                          </div>
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <motion.div
                  className="bg-surface rounded-lg p-6 lg:p-8 sticky top-24"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h3 className="text-xl font-heading font-medium text-primary mb-6">
                    {dict?.projects?.projectDetails || 'Projektdetails'}
                  </h3>
                  <dl className="space-y-4">
                    {project.client && (
                      <>
                        <dt className="text-sm font-body text-text-secondary">
                          {dict?.projects?.client || 'Auftraggeber'}
                        </dt>
                        <dd className="font-body font-medium text-primary mb-4">
                          {project.client}
                        </dd>
                      </>
                    )}
                    <dt className="text-sm font-body text-text-secondary">
                      {dict?.projects?.projectType || 'Projekttyp'}
                    </dt>
                    <dd className="font-body font-medium text-primary mb-4">
                      {project.category}
                    </dd>
                    <dt className="text-sm font-body text-text-secondary">
                      {dict?.projects?.location || 'Standort'}
                    </dt>
                    <dd className="font-body font-medium text-primary mb-4">
                      {project.location}
                    </dd>
                    <dt className="text-sm font-body text-text-secondary">
                      {dict?.projects?.year || 'Jahr'}
                    </dt>
                    <dd className="font-body font-medium text-primary mb-4">
                      {project.year}
                    </dd>
                    <dt className="text-sm font-body text-text-secondary">
                      {dict?.projects?.area || 'Fläche'}
                    </dt>
                    <dd className="font-body font-medium text-primary mb-4">
                      {project.area}
                    </dd>
                    {project.status && (
                      <>
                        <dt className="text-sm font-body text-text-secondary">
                          {dict?.projects?.status || 'Status'}
                        </dt>
                        <dd className="font-body font-medium text-primary">
                          {project.status}
                        </dd>
                      </>
                    )}
                  </dl>

                  {/* Share Buttons */}
                  <div className="mt-8 pt-8 border-t border-border">
                    <h4 className="text-sm font-body text-text-secondary mb-4">
                      {dict?.projects?.share || 'Projekt teilen'}
                    </h4>
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleShare('facebook')}
                        className="p-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-full transition-colors duration-200"
                      >
                        <Facebook size={18} />
                      </button>
                      <button
                        onClick={() => handleShare('twitter')}
                        className="p-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-full transition-colors duration-200"
                      >
                        <Twitter size={18} />
                      </button>
                      <button
                        onClick={() => handleShare('linkedin')}
                        className="p-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-full transition-colors duration-200"
                      >
                        <Linkedin size={18} />
                      </button>
                      <button
                        onClick={() => handleShare('copy')}
                        className="p-2 bg-accent/10 hover:bg-accent/20 text-accent rounded-full transition-colors duration-200"
                      >
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section className="py-12 lg:py-16 bg-surface/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl lg:text-3xl font-heading font-light text-primary mb-8">
                {dict?.projects?.relatedProjects || 'Ähnliche Projekte'}
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedProjects.slice(0, 3).map((relatedProject, index) => (
                  <motion.div
                    key={relatedProject.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link
                      href={`/${lang}/projekte/${relatedProject.id}`}
                      className="group block bg-background rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300"
                    >
                      <div className="aspect-[4/3] overflow-hidden relative">
                        {relatedProject.image ? (
                          <Image
                            src={relatedProject.image}
                            alt={relatedProject.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800" />
                        )}
                      </div>
                      <div className="p-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs text-accent font-body font-medium">
                            {relatedProject.category}
                          </span>
                          <span className="text-xs text-text-secondary font-body">
                            {relatedProject.year}
                          </span>
                        </div>
                        <h3 className="font-heading font-medium text-primary group-hover:text-accent transition-colors duration-200">
                          {relatedProject.name}
                        </h3>
                        <p className="text-sm text-text-secondary font-body mt-2">
                          {relatedProject.location}
                        </p>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Navigation */}
        <section className="py-8 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href={`/${lang}/projekte`}
              className="inline-flex items-center space-x-2 text-accent hover:text-primary transition-colors duration-200 font-body font-medium"
            >
              <ArrowLeft size={20} />
              <span>{dict?.projects?.backToProjects || 'Zurück zu allen Projekten'}</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Zoomed Image Modal */}
      {isZoomed && projectImages.length > 0 && (
        <motion.div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsZoomed(false)}
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors duration-200"
          >
            <X size={32} />
          </button>
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full">
            <Image
              src={projectImages[currentImageIndex]}
              alt={`${project.name} - Zoomed`}
              fill
              sizes="100vw"
              className="object-contain"
            />
          </div>
        </motion.div>
      )}

      {/* Lightbox Modal for Gallery */}
      {lightboxOpen && projectImages.length > 0 && (
        <motion.div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors duration-200 z-50"
          >
            <X size={32} />
          </button>

          {/* Image Counter */}
          <div className="absolute top-4 left-4 text-white/70 font-body">
            {lightboxIndex + 1} / {projectImages.length}
          </div>

          {/* Previous Button */}
          {projectImages.length > 1 && (
            <button
              onClick={prevLightboxImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
            >
              <ChevronLeft size={28} />
            </button>
          )}

          {/* Next Button */}
          {projectImages.length > 1 && (
            <button
              onClick={nextLightboxImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
            >
              <ChevronRight size={28} />
            </button>
          )}

          {/* Main Image */}
          <div 
            className="relative max-w-7xl max-h-[85vh] w-full h-full mx-16"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={projectImages[lightboxIndex]}
              alt={`${project.name} - Image ${lightboxIndex + 1}`}
              fill
              sizes="100vw"
              className="object-contain"
              priority
            />
          </div>

          {/* Thumbnail Strip */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 max-w-full overflow-x-auto px-4">
            {projectImages.map((image, index) => (
              <button
                key={index}
                onClick={() => setLightboxIndex(index)}
                className={`relative w-16 h-16 flex-shrink-0 overflow-hidden rounded transition-all duration-200 ${
                  index === lightboxIndex 
                    ? 'ring-2 ring-white opacity-100' 
                    : 'opacity-50 hover:opacity-75'
                }`}
              >
                <Image
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <Footer dict={dict.translation} lang={lang} />
    </div>
  );
}