'use client';

import { Home, Building2, Palette, Users } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ServicesSection({ dict = {} }) {
  const services = [
    {
      icon: Home,
      title: dict?.services?.items?.newConstruction?.title || "Neubau",
      description: dict?.services?.items?.newConstruction?.description || "Moderne Neubauprojekte nach höchsten Standards"
    },
    {
      icon: Building2,
      title: dict?.services?.items?.renovation?.title || "Altbausanierung",
      description: dict?.services?.items?.renovation?.description || "Behutsame Sanierung historischer Gebäude"
    },
    {
      icon: Palette,
      title: dict?.services?.items?.interior?.title || "Innenarchitektur",
      description: dict?.services?.items?.interior?.description || "Kreative Raumkonzepte für jeden Anspruch"
    },
    {
      icon: Users,
      title: dict?.services?.items?.consulting?.title || "Beratung",
      description: dict?.services?.items?.consulting?.description || "Kompetente Beratung in allen Bauphasen"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4">
          {dict?.services?.title || 'Unsere Leistungen'}
        </h2>
        <p className="text-lg text-text-secondary max-w-2xl mx-auto">
          {dict?.services?.subtitle || 'Kompetenz in allen Bereichen der Architektur'}
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {services.map((service, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="text-center group"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-accent/10 group-hover:bg-accent/20 transition-colors duration-300">
              <service.icon size={32} className="text-accent" />
            </div>
            <h3 className="text-xl font-heading font-medium text-primary mb-3">
              {service.title}
            </h3>
            <p className="text-text-secondary font-body">
              {service.description}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}