'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Phone } from 'lucide-react';

export default function CTASection({ dict = {}, lang = 'de' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-accent/10 to-accent/5"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
          {dict?.cta?.title || 'Lassen Sie uns Ihr Projekt verwirklichen'}
        </h2>
        <p className="text-lg text-text-secondary font-body mb-8">
          {dict?.cta?.subtitle || 'Gemeinsam schaffen wir Räume, die begeistern'}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href={`/${lang}/kontakt`}
            className="inline-flex items-center justify-center space-x-2 bg-accent text-white px-8 py-4 rounded transition-all duration-200 hover:scale-105 hover:shadow-lg font-body font-medium"
          >
            <span>{dict?.cta?.contactButton || 'Kontakt aufnehmen'}</span>
            <ArrowRight size={20} />
          </Link>
          
          <a
            href="tel:+496841123456"
            className="inline-flex items-center justify-center space-x-2 border border-border text-text-primary px-8 py-4 rounded transition-all duration-200 hover:bg-surface font-body font-medium"
          >
            <Phone size={20} />
            <span>{dict?.cta?.callButton || 'Direkt anrufen'}</span>
          </a>
        </div>

        <div className="mt-8 text-sm text-text-secondary">
          <p>{dict?.cta?.availability || 'Mo-Fr: 9:00 - 18:00 Uhr'}</p>
        </div>
      </div>
    </motion.div>
  );
}