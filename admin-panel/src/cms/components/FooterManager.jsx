import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import axios from 'axios';

const FooterManager = () => {
  const [loading, setLoading] = useState(false);
  const [footerData, setFooterData] = useState({
    companyInfo: {},
    quickLinks: [],
    socialLinks: [],
    newsletter: {},
    copyright: {},
    additionalInfo: {}
  });

  const languages = ['de', 'en', 'fr', 'it', 'es'];
  const socialPlatforms = [
    { id: 'facebook', name: 'Facebook', icon: 'Facebook' },
    { id: 'instagram', name: 'Instagram', icon: 'Instagram' },
    { id: 'twitter', name: 'Twitter', icon: 'Twitter' },
    { id: 'linkedin', name: 'LinkedIn', icon: 'Linkedin' },
    { id: 'youtube', name: 'YouTube', icon: 'Youtube' },
    { id: 'pinterest', name: 'Pinterest', icon: 'CircleIcon' },
    { id: 'xing', name: 'Xing', icon: 'CircleIcon' }
  ];

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get('http://localhost:3001/api/content/footer', { headers });
      
      if (response.data && response.data.value) {
        const data = JSON.parse(response.data.value);
        setFooterData(data);
      } else {
        setFooterData(getDefaultFooterData());
      }
    } catch (error) {
      console.error('Error fetching footer data:', error);
      setFooterData(getDefaultFooterData());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultFooterData = () => {
    return {
      companyInfo: {
        name: {
          de: 'Braun & Eyer Architekturbüro',
          en: 'Braun & Eyer Architecture Office',
          fr: 'Bureau d\'architecture Braun & Eyer',
          it: 'Studio di architettura Braun & Eyer',
          es: 'Oficina de arquitectura Braun & Eyer'
        },
        description: {
          de: 'Moderne Architektur und nachhaltiges Design seit 1995',
          en: 'Modern architecture and sustainable design since 1995',
          fr: 'Architecture moderne et design durable depuis 1995',
          it: 'Architettura moderna e design sostenibile dal 1995',
          es: 'Arquitectura moderna y diseño sostenible desde 1995'
        },
        logo: '/logo-footer.png',
        showLogo: true
      },
      quickLinks: [
        {
          id: '1',
          title: {
            de: 'Unternehmen',
            en: 'Company',
            fr: 'Entreprise',
            it: 'Azienda',
            es: 'Empresa'
          },
          links: [
            {
              label: { de: 'Über uns', en: 'About Us', fr: 'À propos', it: 'Chi siamo', es: 'Nosotros' },
              url: { de: '/de/uber-uns', en: '/en/about' },
              internal: true
            },
            {
              label: { de: 'Team', en: 'Team', fr: 'Équipe', it: 'Team', es: 'Equipo' },
              url: { de: '/de/team', en: '/en/team' },
              internal: true
            },
            {
              label: { de: 'Karriere', en: 'Careers', fr: 'Carrières', it: 'Carriere', es: 'Carreras' },
              url: { de: '/de/karriere', en: '/en/careers' },
              internal: true
            }
          ]
        },
        {
          id: '2',
          title: {
            de: 'Leistungen',
            en: 'Services',
            fr: 'Services',
            it: 'Servizi',
            es: 'Servicios'
          },
          links: [
            {
              label: { de: 'Neubau', en: 'New Construction', fr: 'Construction neuve', it: 'Nuova costruzione', es: 'Nueva construcción' },
              url: { de: '/de/leistungen/neubau', en: '/en/services/new-construction' },
              internal: true
            },
            {
              label: { de: 'Sanierung', en: 'Renovation', fr: 'Rénovation', it: 'Ristrutturazione', es: 'Renovación' },
              url: { de: '/de/leistungen/sanierung', en: '/en/services/renovation' },
              internal: true
            },
            {
              label: { de: 'Beratung', en: 'Consulting', fr: 'Conseil', it: 'Consulenza', es: 'Consultoría' },
              url: { de: '/de/leistungen/beratung', en: '/en/services/consulting' },
              internal: true
            }
          ]
        }
      ],
      socialLinks: [
        { platform: 'facebook', url: 'https://facebook.com/braunundeyer', active: true },
        { platform: 'instagram', url: 'https://instagram.com/braunundeyer', active: true },
        { platform: 'linkedin', url: 'https://linkedin.com/company/braunundeyer', active: true },
        { platform: 'twitter', url: '', active: false },
        { platform: 'youtube', url: '', active: false }
      ],
      newsletter: {
        enabled: true,
        title: {
          de: 'Newsletter',
          en: 'Newsletter',
          fr: 'Newsletter',
          it: 'Newsletter',
          es: 'Boletín'
        },
        description: {
          de: 'Bleiben Sie über unsere neuesten Projekte informiert',
          en: 'Stay informed about our latest projects',
          fr: 'Restez informé de nos derniers projets',
          it: 'Rimani informato sui nostri ultimi progetti',
          es: 'Manténgase informado sobre nuestros últimos proyectos'
        },
        placeholder: {
          de: 'Ihre E-Mail-Adresse',
          en: 'Your email address',
          fr: 'Votre adresse e-mail',
          it: 'Il tuo indirizzo email',
          es: 'Su dirección de correo'
        },
        buttonText: {
          de: 'Anmelden',
          en: 'Subscribe',
          fr: 'S\'abonner',
          it: 'Iscriviti',
          es: 'Suscribirse'
        }
      },
      copyright: {
        text: {
          de: '© 2024 Braun & Eyer Architekturbüro. Alle Rechte vorbehalten.',
          en: '© 2024 Braun & Eyer Architecture Office. All rights reserved.',
          fr: '© 2024 Bureau d\'architecture Braun & Eyer. Tous droits réservés.',
          it: '© 2024 Studio di architettura Braun & Eyer. Tutti i diritti riservati.',
          es: '© 2024 Oficina de arquitectura Braun & Eyer. Todos los derechos reservados.'
        },
        showYear: true,
        autoUpdateYear: true
      },
      additionalInfo: {
        showPartners: false,
        partners: [],
        showCertifications: false,
        certifications: [],
        showPaymentMethods: false,
        paymentMethods: []
      }
    };
  };

  const saveFooterData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.post(
        'http://localhost:3001/api/content',
        {
          key: 'footer',
          value: JSON.stringify(footerData),
          language: 'de'
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      
      alert('Footer settings saved successfully!');
    } catch (error) {
      console.error('Error saving footer data:', error);
      alert('Failed to save footer settings');
    } finally {
      setLoading(false);
    }
  };

  const updateCompanyInfo = (field, value, lang = null) => {
    setFooterData(prev => ({
      ...prev,
      companyInfo: {
        ...prev.companyInfo,
        [field]: lang ? {
          ...prev.companyInfo[field],
          [lang]: value
        } : value
      }
    }));
  };

  const addQuickLinkSection = () => {
    const newSection = {
      id: Date.now().toString(),
      title: {
        de: 'Neue Kategorie',
        en: 'New Category',
        fr: 'Nouvelle catégorie',
        it: 'Nuova categoria',
        es: 'Nueva categoría'
      },
      links: []
    };
    
    setFooterData(prev => ({
      ...prev,
      quickLinks: [...prev.quickLinks, newSection]
    }));
  };

  const updateQuickLinkSection = (sectionId, field, value, lang = null) => {
    setFooterData(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.map(section => 
        section.id === sectionId
          ? {
              ...section,
              [field]: lang ? {
                ...section[field],
                [lang]: value
              } : value
            }
          : section
      )
    }));
  };

  const addLinkToSection = (sectionId) => {
    const newLink = {
      label: { de: 'Neuer Link', en: 'New Link', fr: 'Nouveau lien', it: 'Nuovo link', es: 'Nuevo enlace' },
      url: { de: '#', en: '#' },
      internal: true
    };
    
    setFooterData(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.map(section => 
        section.id === sectionId
          ? { ...section, links: [...section.links, newLink] }
          : section
      )
    }));
  };

  const updateLink = (sectionId, linkIndex, field, value, lang = null) => {
    setFooterData(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.map(section => 
        section.id === sectionId
          ? {
              ...section,
              links: section.links.map((link, index) => 
                index === linkIndex
                  ? {
                      ...link,
                      [field]: lang ? {
                        ...link[field],
                        [lang]: value
                      } : value
                    }
                  : link
              )
            }
          : section
      )
    }));
  };

  const removeLink = (sectionId, linkIndex) => {
    setFooterData(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.map(section => 
        section.id === sectionId
          ? {
              ...section,
              links: section.links.filter((_, index) => index !== linkIndex)
            }
          : section
      )
    }));
  };

  const removeQuickLinkSection = (sectionId) => {
    setFooterData(prev => ({
      ...prev,
      quickLinks: prev.quickLinks.filter(section => section.id !== sectionId)
    }));
  };

  const updateSocialLink = (platform, field, value) => {
    setFooterData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.map(link => 
        link.platform === platform
          ? { ...link, [field]: value }
          : link
      )
    }));
  };

  const updateNewsletter = (field, value, lang = null) => {
    setFooterData(prev => ({
      ...prev,
      newsletter: {
        ...prev.newsletter,
        [field]: lang ? {
          ...prev.newsletter[field],
          [lang]: value
        } : value
      }
    }));
  };

  const updateCopyright = (field, value, lang = null) => {
    setFooterData(prev => ({
      ...prev,
      copyright: {
        ...prev.copyright,
        [field]: lang ? {
          ...prev.copyright[field],
          [lang]: value
        } : value
      }
    }));
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Footer Content Manager</h2>
        <button
          onClick={saveFooterData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Icon name="Save" size={16} className="inline mr-2" />
          {loading ? 'Saving...' : 'Save Footer Settings'}
        </button>
      </div>

      {/* Company Information */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Company Information</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
            <div className="space-y-2">
              {languages.map(lang => (
                <div key={lang} className="flex items-center space-x-2">
                  <span className="w-12 text-sm font-medium">{lang.toUpperCase()}</span>
                  <input
                    type="text"
                    value={footerData.companyInfo.name?.[lang] || ''}
                    onChange={(e) => updateCompanyInfo('name', e.target.value, lang)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <div className="space-y-2">
              {languages.map(lang => (
                <div key={lang} className="flex items-center space-x-2">
                  <span className="w-12 text-sm font-medium">{lang.toUpperCase()}</span>
                  <textarea
                    value={footerData.companyInfo.description?.[lang] || ''}
                    onChange={(e) => updateCompanyInfo('description', e.target.value, lang)}
                    rows={2}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Footer Logo</label>
              <input
                type="text"
                value={footerData.companyInfo.logo || ''}
                onChange={(e) => updateCompanyInfo('logo', e.target.value)}
                placeholder="/path/to/logo.png"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <label className="flex items-center mt-6">
              <input
                type="checkbox"
                checked={footerData.companyInfo.showLogo}
                onChange={(e) => updateCompanyInfo('showLogo', e.target.checked)}
                className="mr-2"
              />
              Show Logo
            </label>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Quick Links</h3>
          <button
            onClick={addQuickLinkSection}
            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
          >
            <Icon name="Plus" size={16} className="inline mr-1" />
            Add Section
          </button>
        </div>

        <div className="space-y-4">
          {footerData.quickLinks.map((section, sectionIndex) => (
            <div key={section.id} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                  <div className="space-y-1">
                    {languages.map(lang => (
                      <div key={lang} className="flex items-center space-x-2">
                        <span className="w-8 text-xs font-medium">{lang.toUpperCase()}</span>
                        <input
                          type="text"
                          value={section.title?.[lang] || ''}
                          onChange={(e) => updateQuickLinkSection(section.id, 'title', e.target.value, lang)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => removeQuickLinkSection(section.id)}
                  className="ml-2 text-red-600 hover:text-red-700"
                >
                  <Icon name="Trash2" size={16} />
                </button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-700">Links</label>
                  <button
                    onClick={() => addLinkToSection(section.id)}
                    className="px-2 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                  >
                    <Icon name="Plus" size={14} className="inline mr-1" />
                    Add Link
                  </button>
                </div>

                {section.links.map((link, linkIndex) => (
                  <div key={linkIndex} className="border border-gray-200 rounded p-2 bg-white">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs font-medium text-gray-600">Label</label>
                        <button
                          onClick={() => removeLink(section.id, linkIndex)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Icon name="X" size={14} />
                        </button>
                      </div>
                      {languages.map(lang => (
                        <div key={lang} className="flex items-center space-x-1">
                          <span className="w-6 text-xs">{lang.toUpperCase()}</span>
                          <input
                            type="text"
                            value={link.label?.[lang] || ''}
                            onChange={(e) => updateLink(section.id, linkIndex, 'label', e.target.value, lang)}
                            className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs"
                          />
                          <input
                            type="text"
                            value={link.url?.[lang] || ''}
                            onChange={(e) => updateLink(section.id, linkIndex, 'url', e.target.value, lang)}
                            placeholder="URL"
                            className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs"
                          />
                        </div>
                      ))}
                      <label className="flex items-center text-xs">
                        <input
                          type="checkbox"
                          checked={link.internal}
                          onChange={(e) => updateLink(section.id, linkIndex, 'internal', e.target.checked)}
                          className="mr-1"
                        />
                        Internal Link
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Links */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
        <div className="space-y-3">
          {footerData.socialLinks.map(link => {
            const platform = socialPlatforms.find(p => p.id === link.platform);
            return (
              <div key={link.platform} className="flex items-center space-x-3">
                <Icon name={platform?.icon || 'Link'} size={20} className="text-gray-600" />
                <span className="w-24 text-sm font-medium">{platform?.name}</span>
                <input
                  type="url"
                  value={link.url || ''}
                  onChange={(e) => updateSocialLink(link.platform, 'url', e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={link.active}
                    onChange={(e) => updateSocialLink(link.platform, 'active', e.target.checked)}
                    className="mr-2"
                  />
                  Active
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Newsletter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Newsletter Signup</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={footerData.newsletter.enabled}
              onChange={(e) => updateNewsletter('enabled', e.target.checked)}
              className="mr-2"
            />
            Enable Newsletter
          </label>
        </div>

        {footerData.newsletter.enabled && (
          <div className="space-y-4">
            {['title', 'description', 'placeholder', 'buttonText'].map(field => (
              <div key={field}>
                <label className="block text-sm font-medium text-gray-700 mb-2 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
                <div className="space-y-2">
                  {languages.map(lang => (
                    <div key={lang} className="flex items-center space-x-2">
                      <span className="w-12 text-sm font-medium">{lang.toUpperCase()}</span>
                      <input
                        type="text"
                        value={footerData.newsletter[field]?.[lang] || ''}
                        onChange={(e) => updateNewsletter(field, e.target.value, lang)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Copyright */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4">Copyright Text</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Copyright Text</label>
            <div className="space-y-2">
              {languages.map(lang => (
                <div key={lang} className="flex items-center space-x-2">
                  <span className="w-12 text-sm font-medium">{lang.toUpperCase()}</span>
                  <input
                    type="text"
                    value={footerData.copyright.text?.[lang] || ''}
                    onChange={(e) => updateCopyright('text', e.target.value, lang)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={footerData.copyright.showYear}
                onChange={(e) => updateCopyright('showYear', e.target.checked)}
                className="mr-2"
              />
              Show Year
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={footerData.copyright.autoUpdateYear}
                onChange={(e) => updateCopyright('autoUpdateYear', e.target.checked)}
                className="mr-2"
              />
              Auto-update Year
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FooterManager;