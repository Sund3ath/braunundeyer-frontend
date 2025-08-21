'use client';

import React, { Suspense, lazy } from 'react';
import dynamic from 'next/dynamic';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import LazySection from '@/components/ui/LazySection';
import LazyImage from '@/components/ui/LazyImage';
import { useScrollOptimization } from '@/hooks/useScrollOptimization';

// Dynamically import heavy components
const WaterEffect = dynamic(() => import('@/components/ui/WaterEffect'), {
  ssr: false,
  loading: () => <div className="h-screen bg-background" />
});

// CursorTrail is now added globally in app/layout.js

// Lazy load sections that are not immediately visible
const TestimonialsSection = lazy(() => import('@/components/homepage/TestimonialsSection'));
const ServicesSection = lazy(() => import('@/components/homepage/ServicesSection'));
const CTASection = lazy(() => import('@/components/homepage/CTASection'));

export default function HomepageOptimized({ 
  heroSlides = [], 
  featuredProjects = [], 
  dict = {} 
}) {
  const params = useParams();
  const lang = params.lang || 'de';
  const { scrollY, scrollDirection, isScrolling } = useScrollOptimization();

  // Process image URLs
  const processImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    return `${backendUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  };

  // Process hero slides
  const processedHeroSlides = heroSlides.map(slide => ({
    ...slide,
    image: processImageUrl(slide.image),
    video: slide.video ? processImageUrl(slide.video) : null
  }));

  return (
    <div className="min-h-screen relative overflow-hidden bg-background">
      <Header dict={dict?.translation || dict} lang={lang} />
      

      {/* Hero Section - Always load immediately as it's above the fold */}
      <section className="relative h-screen overflow-hidden bg-background pt-20 lg:pt-24">
        {processedHeroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === 0 ? 'opacity-100' : 'opacity-0'
            }`}
          >
            {slide.video && index === 0 ? (
              <video
                src={slide.video}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                poster={slide.image}
              />
            ) : (
              <LazyImage
                src={slide.image}
                alt={slide.title}
                fill
                priority={index === 0} // Only prioritize first slide
                quality={90}
                sizes="100vw"
              />
            )}
            <div className="absolute inset-0 bg-black/50" />
          </div>
        ))}

        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <h1 className="text-4xl lg:text-6xl font-heading font-light text-white mb-6">
              {processedHeroSlides[0]?.title || dict?.hero?.title}
            </h1>
            <p className="text-xl lg:text-2xl text-white/90 mb-8">
              {processedHeroSlides[0]?.subtitle || dict?.hero?.subtitle}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Projects Section - Lazy load with animation */}
      <LazySection 
        className="py-16 lg:py-24 bg-surface/50"
        threshold={0.2}
        animateIn={true}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-12 text-center">
            {dict?.projects?.title || 'Unsere Projekte'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.slice(0, 6).map((project, index) => (
              <LazySection
                key={project.id}
                threshold={0.3}
                animateIn={true}
                className="group cursor-pointer"
              >
                <div className="relative h-64 overflow-hidden rounded-lg">
                  <LazyImage
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-heading font-medium mb-1">
                      {project.title}
                    </h3>
                    <p className="text-sm opacity-90">{project.location}</p>
                  </div>
                </div>
              </LazySection>
            ))}
          </div>
        </div>
      </LazySection>

      {/* Services Section - Lazy load */}
      <LazySection
        className="py-16 lg:py-24"
        threshold={0.1}
        fallback={
          <div className="py-16 lg:py-24 bg-gray-100 animate-pulse">
            <div className="h-96" />
          </div>
        }
      >
        <Suspense fallback={<div className="h-96 bg-gray-100 animate-pulse" />}>
          <ServicesSection dict={dict} />
        </Suspense>
      </LazySection>

      {/* Testimonials Section - Lazy load */}
      <LazySection
        className="py-16 lg:py-24 bg-surface/50"
        threshold={0.1}
        fallback={
          <div className="py-16 lg:py-24 bg-gray-100 animate-pulse">
            <div className="h-64" />
          </div>
        }
      >
        <Suspense fallback={<div className="h-64 bg-gray-100 animate-pulse" />}>
          <TestimonialsSection dict={dict} />
        </Suspense>
      </LazySection>

      {/* CTA Section - Lazy load */}
      <LazySection
        className="py-16 lg:py-24"
        threshold={0.1}
      >
        <Suspense fallback={null}>
          <CTASection dict={dict} lang={lang} />
        </Suspense>
      </LazySection>

      <Footer dict={dict?.translation || dict} lang={lang} />
    </div>
  );
}