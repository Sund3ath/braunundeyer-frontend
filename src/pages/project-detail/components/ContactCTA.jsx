import React from 'react';
import { Link } from 'react-router-dom';
import Icon from 'components/AppIcon';

const ContactCTA = () => {
  return (
    <div className="bg-gradient-to-r from-primary to-accent rounded-lg p-8 lg:p-12 text-white">
      <div className="max-w-3xl">
        <div className="flex items-start space-x-4 mb-6">
          <div className="flex-shrink-0 w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <Icon name="MessageSquare" size={24} className="text-white" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl lg:text-2xl font-heading font-light">
              Interested in a Similar Project?
            </h3>
            <p className="text-white/90 font-body leading-relaxed">
              Let's discuss how we can bring your architectural vision to life. Our team specializes in creating innovative, sustainable designs that exceed expectations.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/contact"
            className="inline-flex items-center justify-center space-x-2 bg-white text-primary px-6 py-3 rounded font-body font-medium transition-all duration-200 hover:bg-white/90 hover:scale-102"
          >
            <Icon name="Mail" size={20} />
            <span>Start Your Project</span>
          </Link>
          
          <Link
            to="/services"
            className="inline-flex items-center justify-center space-x-2 border-2 border-white/30 text-white px-6 py-3 rounded font-body font-medium transition-all duration-200 hover:bg-white/10 hover:border-white/50"
          >
            <Icon name="Settings" size={20} />
            <span>View Our Services</span>
          </Link>
        </div>
        
        <div className="mt-6 pt-6 border-t border-white/20">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm text-white/80 font-body">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Icon name="Phone" size={16} />
                <span>(555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-2">
                <Icon name="Mail" size={16} />
                <span>hello@archstudio.com</span>
              </div>
            </div>
            <div className="text-white/60">
              Free consultation available
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactCTA;