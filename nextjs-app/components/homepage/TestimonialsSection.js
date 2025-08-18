'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import LazyImage from '@/components/ui/LazyImage';

export default function TestimonialsSection({ dict = {} }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      client: dict?.testimonials?.items?.[0]?.client || "Familie Schmidt",
      company: dict?.testimonials?.items?.[0]?.company || "Privatkunde",
      quote: dict?.testimonials?.items?.[0]?.quote || "Braun & Eyer hat unseren Traum vom Eigenheim perfekt umgesetzt. Die Beratung war erstklassig und die Umsetzung präzise.",
      project: dict?.testimonials?.items?.[0]?.project || "Einfamilienhaus Neubau",
      image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
      rating: 5
    },
    {
      id: 2,
      client: dict?.testimonials?.items?.[1]?.client || "Herr Dr. Müller",
      company: dict?.testimonials?.items?.[1]?.company || "Müller Immobilien GmbH",
      quote: dict?.testimonials?.items?.[1]?.quote || "Die Sanierung unseres denkmalgeschützten Gebäudes wurde mit höchster Kompetenz durchgeführt.",
      project: dict?.testimonials?.items?.[1]?.project || "Altbausanierung",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
      rating: 5
    },
    {
      id: 3,
      client: dict?.testimonials?.items?.[2]?.client || "Frau Weber",
      company: dict?.testimonials?.items?.[2]?.company || "Weber Consulting",
      quote: dict?.testimonials?.items?.[2]?.quote || "Die Innenarchitektur unseres Büros ist funktional und ästhetisch perfekt gelungen.",
      project: dict?.testimonials?.items?.[2]?.project || "Bürogestaltung",
      image: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800&q=80",
      rating: 5
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
          {dict?.testimonials?.title || 'Was unsere Kunden sagen'}
        </h2>
        <p className="text-lg text-text-secondary">
          {dict?.testimonials?.subtitle || 'Erfolgreiche Projekte und zufriedene Kunden'}
        </p>
      </motion.div>

      <div className="relative max-w-4xl mx-auto">
        <div className="bg-background rounded-lg shadow-lg overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              transition={{ duration: 0.5 }}
              className="grid md:grid-cols-2 gap-8 p-8 lg:p-12"
            >
              {/* Image */}
              <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
                <LazyImage
                  src={testimonials[currentIndex].image}
                  alt={testimonials[currentIndex].project}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="flex flex-col justify-center">
                <div className="flex mb-4">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-500 fill-current" />
                  ))}
                </div>
                
                <blockquote className="text-lg lg:text-xl text-text-secondary font-body italic mb-6">
                  "{testimonials[currentIndex].quote}"
                </blockquote>
                
                <div>
                  <p className="font-heading font-medium text-primary">
                    {testimonials[currentIndex].client}
                  </p>
                  <p className="text-text-secondary font-body text-sm">
                    {testimonials[currentIndex].company}
                  </p>
                  <p className="text-accent font-body text-sm mt-1">
                    {testimonials[currentIndex].project}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center mt-8 space-x-4">
          <button
            onClick={handlePrevious}
            className="p-2 rounded-full bg-surface hover:bg-accent/10 transition-colors duration-200"
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} className="text-accent" />
          </button>
          
          <div className="flex space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-200 ${
                  index === currentIndex 
                    ? 'bg-accent w-8' 
                    : 'bg-border hover:bg-accent/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <button
            onClick={handleNext}
            className="p-2 rounded-full bg-surface hover:bg-accent/10 transition-colors duration-200"
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} className="text-accent" />
          </button>
        </div>
      </div>
    </div>
  );
}