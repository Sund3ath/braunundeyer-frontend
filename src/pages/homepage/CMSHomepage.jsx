import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

// CMS Components
import EditableText from '../../cms/components/EditableText';
import EditableImage from '../../cms/components/EditableImage';
import ProjectManager from '../../cms/components/ProjectManager';
import MultiLanguageSEO from 'components/MultiLanguageSEO';

// Regular Components
import Header from 'components/ui/Header';
import CursorTrail from 'components/ui/CursorTrail';
import Icon from 'components/AppIcon';
import { useEditMode } from '../../cms/contexts/EditModeContext';
import useCMSStore from '../../cms/store/cmsStore';

const CMSHomepage = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isEditMode } = useEditMode();
  const { projects, currentLanguage } = useCMSStore();
  
  // Get published projects only
  const publishedProjects = projects.filter(p => p.status === 'published').slice(0, 3);
  
  return (
    <div className="min-h-screen bg-background">
      <MultiLanguageSEO
        titleKey="hero.title"
        descriptionKey="hero.subtitle"
        structuredData={{
          '@type': 'Organization',
          name: 'Braun & Eyer Architekturbüro',
          url: 'https://braunundeyer.de'
        }}
      />
      
      <Header />
      <CursorTrail />
      
      <main className="pt-20 lg:pt-24">
        {/* Hero Section */}
        <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <EditableImage
              contentKey="hero_background"
              defaultSrc="/assets/images/hero-bg.jpg"
              alt="Hero Background"
              className="w-full h-full object-cover"
              containerClassName="w-full h-full"
            />
            <div className="absolute inset-0 bg-black/40" />
          </div>
          
          {/* Content */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <EditableText
                contentKey="hero_title"
                defaultValue={t('hero.title')}
                tag="h1"
                className="text-4xl lg:text-6xl font-heading font-light mb-6"
              />
              
              <EditableText
                contentKey="hero_subtitle"
                defaultValue={t('hero.subtitle')}
                tag="p"
                className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto"
              />
              
              <button
                onClick={() => navigate(`/${currentLanguage}/${t('nav.projects').toLowerCase()}`)}
                className="px-8 py-4 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 font-medium"
              >
                {t('hero.cta')}
              </button>
            </motion.div>
          </div>
        </section>
        
        {/* About Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <EditableText
                  contentKey="about_title"
                  defaultValue="Über 30 Jahre Erfahrung"
                  tag="h2"
                  className="text-3xl lg:text-4xl font-heading font-light text-primary mb-6"
                />
                
                <EditableText
                  contentKey="about_text"
                  defaultValue="Braun & Eyer Architekturbüro steht für innovative und nachhaltige Architektur. Seit unserer Gründung haben wir zahlreiche Projekte erfolgreich umgesetzt und dabei stets höchste Qualitätsstandards erfüllt."
                  tag="div"
                  className="text-lg text-text-secondary mb-6"
                  multiline
                  richText
                />
                
                <button
                  onClick={() => navigate(`/${currentLanguage}/${t('nav.about').toLowerCase()}`)}
                  className="text-accent hover:text-primary transition-colors duration-200 font-medium flex items-center space-x-2"
                >
                  <span>Mehr erfahren</span>
                  <Icon name="ArrowRight" size={20} />
                </button>
              </div>
              
              <div>
                <EditableImage
                  contentKey="about_image"
                  defaultSrc="/assets/images/about-preview.jpg"
                  alt="About Us"
                  className="w-full h-[400px] object-cover rounded-lg shadow-lg"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Projects Section */}
        <section className="py-16 lg:py-24 bg-surface">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <EditableText
                contentKey="projects_title"
                defaultValue={t('projects.title')}
                tag="h2"
                className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4"
              />
              
              <EditableText
                contentKey="projects_subtitle"
                defaultValue="Entdecken Sie unsere aktuellen Projekte"
                tag="p"
                className="text-lg text-text-secondary"
              />
            </div>
            
            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedProjects.map((project) => (
                <motion.div
                  key={project.id}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => navigate(`/${currentLanguage}/${t('nav.projects').toLowerCase()}/${project.id}`)}
                  whileHover={{ y: -5 }}
                >
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={project.image || '/assets/images/no_image.png'}
                      alt={project.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs text-accent font-medium">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-heading font-medium text-primary mt-2 mb-2">
                      {project.name}
                    </h3>
                    <p className="text-text-secondary text-sm line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Add Projects Button for Edit Mode */}
            {isEditMode && publishedProjects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 mb-4">No projects to display</p>
                <button
                  onClick={() => navigate(`/${currentLanguage}/admin/projects`)}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Manage Projects
                </button>
              </div>
            )}
            
            <div className="text-center mt-12">
              <button
                onClick={() => navigate(`/${currentLanguage}/${t('nav.projects').toLowerCase()}`)}
                className="px-8 py-3 bg-accent text-white rounded-lg hover:bg-accent/90 transition-all duration-200 font-medium"
              >
                {t('projects.viewAll')}
              </button>
            </div>
          </div>
        </section>
        
        {/* Services Section */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <EditableText
                contentKey="services_title"
                defaultValue={t('services.title')}
                tag="h2"
                className="text-3xl lg:text-4xl font-heading font-light text-primary mb-4"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {['planning', 'consulting', 'projectManagement', 'renovation'].map((service) => (
                <div key={service} className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                    <Icon 
                      name={
                        service === 'planning' ? 'FileText' :
                        service === 'consulting' ? 'Users' :
                        service === 'projectManagement' ? 'Briefcase' :
                        'Home'
                      } 
                      size={32} 
                      className="text-accent" 
                    />
                  </div>
                  <EditableText
                    contentKey={`service_${service}_title`}
                    defaultValue={t(`services.${service}`)}
                    tag="h3"
                    className="text-xl font-heading font-medium text-primary mb-2"
                  />
                  <EditableText
                    contentKey={`service_${service}_description`}
                    defaultValue="Professional service with attention to detail"
                    tag="p"
                    className="text-text-secondary"
                    multiline
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 lg:py-24 bg-primary text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <EditableText
              contentKey="cta_title"
              defaultValue="Bereit für Ihr nächstes Projekt?"
              tag="h2"
              className="text-3xl lg:text-4xl font-heading font-light mb-6"
            />
            
            <EditableText
              contentKey="cta_text"
              defaultValue="Kontaktieren Sie uns noch heute und lassen Sie uns gemeinsam Ihre Vision verwirklichen."
              tag="p"
              className="text-xl mb-8"
            />
            
            <button
              onClick={() => navigate(`/${currentLanguage}/${t('nav.contact').toLowerCase()}`)}
              className="px-8 py-4 bg-white text-primary rounded-lg hover:bg-gray-100 transition-all duration-200 font-medium"
            >
              {t('nav.contact')}
            </button>
          </div>
        </section>
      </main>
      
      {/* Project Manager (only visible in edit mode) */}
      {isEditMode && <ProjectManager />}
    </div>
  );
};

export default CMSHomepage;