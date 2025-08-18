import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import axios from 'axios';

const SEOManager = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pages');
  const [seoData, setSeoData] = useState({
    pages: {},
    global: {},
    sitemap: {},
    robots: {},
    schemas: {}
  });

  const languages = ['de', 'en', 'fr', 'it', 'es'];
  
  const pages = [
    { id: 'homepage', name: 'Homepage', path: '/[lang]/homepage' },
    { id: 'projects', name: 'Projects', path: '/[lang]/projekte' },
    { id: 'services', name: 'Services', path: '/[lang]/leistungen' },
    { id: 'about', name: 'About Us', path: '/[lang]/uber-uns' },
    { id: 'contact', name: 'Contact', path: '/[lang]/kontakt' },
    { id: 'impressum', name: 'Impressum', path: '/[lang]/impressum' },
    { id: 'datenschutz', name: 'Datenschutz', path: '/[lang]/datenschutz' }
  ];

  const schemaTypes = [
    'Organization',
    'LocalBusiness', 
    'ArchitectureOffice',
    'Service',
    'Project',
    'ContactPage',
    'AboutPage'
  ];

  useEffect(() => {
    fetchSEOData();
  }, []);

  const fetchSEOData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get('http://localhost:3001/api/content/seo', { headers });
      
      if (response.data && response.data.value) {
        const data = JSON.parse(response.data.value);
        setSeoData(data);
      } else {
        // Initialize with defaults
        setSeoData(getDefaultSEOData());
      }
    } catch (error) {
      console.error('Error fetching SEO data:', error);
      setSeoData(getDefaultSEOData());
    } finally {
      setLoading(false);
    }
  };

  const getDefaultSEOData = () => {
    const defaultPageSEO = {
      title: {
        de: 'Braun & Eyer Architekturbüro | {{page}}',
        en: 'Braun & Eyer Architecture | {{page}}',
        fr: 'Braun & Eyer Architecture | {{page}}',
        it: 'Braun & Eyer Architettura | {{page}}',
        es: 'Braun & Eyer Arquitectura | {{page}}'
      },
      description: {
        de: 'Moderne Architektur und nachhaltiges Design in Saarbrücken',
        en: 'Modern architecture and sustainable design in Saarbrücken',
        fr: 'Architecture moderne et design durable à Sarrebruck',
        it: 'Architettura moderna e design sostenibile a Saarbrücken',
        es: 'Arquitectura moderna y diseño sostenible en Saarbrücken'
      },
      keywords: {
        de: 'Architektur, Saarbrücken, Neubau, Sanierung, nachhaltig',
        en: 'Architecture, Saarbrücken, new construction, renovation, sustainable',
        fr: 'Architecture, Sarrebruck, construction neuve, rénovation, durable',
        it: 'Architettura, Saarbrücken, nuova costruzione, ristrutturazione, sostenibile',
        es: 'Arquitectura, Saarbrücken, nueva construcción, renovación, sostenible'
      },
      ogImage: '/og-default.jpg',
      ogType: 'website',
      twitterCard: 'summary_large_image'
    };

    const pagesData = {};
    pages.forEach(page => {
      pagesData[page.id] = { ...defaultPageSEO };
    });

    return {
      pages: pagesData,
      global: {
        siteName: 'Braun & Eyer Architekturbüro',
        siteUrl: 'https://www.braunundeyer.de',
        defaultLanguage: 'de',
        favicon: '/favicon.ico',
        appleTouchIcon: '/apple-touch-icon.png',
        manifestFile: '/manifest.json',
        themeColor: '#ffffff',
        googleSiteVerification: '',
        bingSiteVerification: '',
        facebookAppId: '',
        twitterHandle: '@braunundeyer',
        googleAnalyticsId: '',
        gtagId: ''
      },
      sitemap: {
        enabled: true,
        changefreq: 'weekly',
        priority: 0.8,
        excludePaths: ['/admin', '/api'],
        lastmod: new Date().toISOString(),
        alternateRefs: true,
        includeImages: true,
        autoGenerate: true,
        customEntries: []
      },
      robots: {
        rules: [
          {
            userAgent: '*',
            allow: '/',
            disallow: ['/admin', '/api', '/private'],
            crawlDelay: 0,
            sitemap: 'https://www.braunundeyer.de/sitemap.xml'
          }
        ],
        host: 'www.braunundeyer.de'
      },
      schemas: {
        organization: {
          '@context': 'https://schema.org',
          '@type': 'ArchitecturalFirm',
          name: 'Braun & Eyer Architekturbüro',
          url: 'https://www.braunundeyer.de',
          logo: 'https://www.braunundeyer.de/logo.png',
          sameAs: [
            'https://www.facebook.com/braunundeyer',
            'https://www.instagram.com/braunundeyer',
            'https://www.linkedin.com/company/braunundeyer'
          ],
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Hauptstraße 123',
            addressLocality: 'Saarbrücken',
            postalCode: '66111',
            addressCountry: 'DE'
          },
          contactPoint: {
            '@type': 'ContactPoint',
            telephone: '+49-681-123456',
            contactType: 'customer service',
            availableLanguage: ['German', 'English', 'French', 'Italian', 'Spanish']
          }
        }
      }
    };
  };

  const saveSEOData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      await axios.post(
        'http://localhost:3001/api/content',
        {
          key: 'seo',
          value: JSON.stringify(seoData),
          language: 'de'
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      
      // Generate sitemap if enabled
      if (seoData.sitemap.enabled && seoData.sitemap.autoGenerate) {
        await axios.post(
          'http://localhost:3001/api/seo/generate-sitemap',
          seoData.sitemap,
          { headers: token ? { Authorization: `Bearer ${token}` } : {} }
        );
      }
      
      // Update robots.txt
      await axios.post(
        'http://localhost:3001/api/seo/update-robots',
        seoData.robots,
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      
      alert('SEO settings saved successfully!');
    } catch (error) {
      console.error('Error saving SEO data:', error);
      alert('Failed to save SEO settings');
    } finally {
      setLoading(false);
    }
  };

  const updatePageSEO = (pageId, field, value, lang = null) => {
    setSeoData(prev => ({
      ...prev,
      pages: {
        ...prev.pages,
        [pageId]: {
          ...prev.pages[pageId],
          [field]: lang ? {
            ...prev.pages[pageId]?.[field],
            [lang]: value
          } : value
        }
      }
    }));
  };

  const updateGlobalSEO = (field, value) => {
    setSeoData(prev => ({
      ...prev,
      global: {
        ...prev.global,
        [field]: value
      }
    }));
  };

  const updateSitemap = (field, value) => {
    setSeoData(prev => ({
      ...prev,
      sitemap: {
        ...prev.sitemap,
        [field]: value
      }
    }));
  };

  const updateRobots = (ruleIndex, field, value) => {
    setSeoData(prev => {
      const newRules = [...prev.robots.rules];
      newRules[ruleIndex] = {
        ...newRules[ruleIndex],
        [field]: value
      };
      return {
        ...prev,
        robots: {
          ...prev.robots,
          rules: newRules
        }
      };
    });
  };

  const addRobotsRule = () => {
    setSeoData(prev => ({
      ...prev,
      robots: {
        ...prev.robots,
        rules: [
          ...prev.robots.rules,
          {
            userAgent: 'bot-name',
            allow: '/',
            disallow: [],
            crawlDelay: 0
          }
        ]
      }
    }));
  };

  const removeRobotsRule = (index) => {
    setSeoData(prev => ({
      ...prev,
      robots: {
        ...prev.robots,
        rules: prev.robots.rules.filter((_, i) => i !== index)
      }
    }));
  };

  const renderPagesSEO = () => {
    const [selectedPage, setSelectedPage] = useState(pages[0].id);
    const pageData = seoData.pages[selectedPage] || {};

    return (
      <div className="space-y-6">
        {/* Page Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Page</label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg"
          >
            {pages.map(page => (
              <option key={page.id} value={page.id}>
                {page.name} - {page.path}
              </option>
            ))}
          </select>
        </div>

        {/* Title Tags */}
        <div>
          <h3 className="text-lg font-medium mb-3">Page Title</h3>
          <div className="space-y-2">
            {languages.map(lang => (
              <div key={lang} className="flex items-center space-x-2">
                <span className="w-12 text-sm font-medium">{lang.toUpperCase()}</span>
                <input
                  type="text"
                  value={pageData.title?.[lang] || ''}
                  onChange={(e) => updatePageSEO(selectedPage, 'title', e.target.value, lang)}
                  placeholder={`Title (${lang})`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded"
                />
                <span className="text-xs text-gray-500">
                  {(pageData.title?.[lang] || '').length}/60
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Meta Descriptions */}
        <div>
          <h3 className="text-lg font-medium mb-3">Meta Description</h3>
          <div className="space-y-2">
            {languages.map(lang => (
              <div key={lang} className="flex items-start space-x-2">
                <span className="w-12 text-sm font-medium pt-2">{lang.toUpperCase()}</span>
                <textarea
                  value={pageData.description?.[lang] || ''}
                  onChange={(e) => updatePageSEO(selectedPage, 'description', e.target.value, lang)}
                  placeholder={`Description (${lang})`}
                  rows={2}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded"
                />
                <span className="text-xs text-gray-500 pt-2">
                  {(pageData.description?.[lang] || '').length}/160
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Keywords */}
        <div>
          <h3 className="text-lg font-medium mb-3">Keywords</h3>
          <div className="space-y-2">
            {languages.map(lang => (
              <div key={lang} className="flex items-center space-x-2">
                <span className="w-12 text-sm font-medium">{lang.toUpperCase()}</span>
                <input
                  type="text"
                  value={pageData.keywords?.[lang] || ''}
                  onChange={(e) => updatePageSEO(selectedPage, 'keywords', e.target.value, lang)}
                  placeholder={`Keywords separated by commas (${lang})`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Open Graph */}
        <div>
          <h3 className="text-lg font-medium mb-3">Open Graph Settings</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OG Image</label>
              <input
                type="text"
                value={pageData.ogImage || ''}
                onChange={(e) => updatePageSEO(selectedPage, 'ogImage', e.target.value)}
                placeholder="/path/to/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">OG Type</label>
              <select
                value={pageData.ogType || 'website'}
                onChange={(e) => updatePageSEO(selectedPage, 'ogType', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="website">Website</option>
                <option value="article">Article</option>
                <option value="product">Product</option>
                <option value="profile">Profile</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Card</label>
              <select
                value={pageData.twitterCard || 'summary'}
                onChange={(e) => updatePageSEO(selectedPage, 'twitterCard', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              >
                <option value="summary">Summary</option>
                <option value="summary_large_image">Summary Large Image</option>
                <option value="app">App</option>
                <option value="player">Player</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderGlobalSettings = () => {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site Name</label>
            <input
              type="text"
              value={seoData.global.siteName || ''}
              onChange={(e) => updateGlobalSEO('siteName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Site URL</label>
            <input
              type="url"
              value={seoData.global.siteUrl || ''}
              onChange={(e) => updateGlobalSEO('siteUrl', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Default Language</label>
            <select
              value={seoData.global.defaultLanguage || 'de'}
              onChange={(e) => updateGlobalSEO('defaultLanguage', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            >
              {languages.map(lang => (
                <option key={lang} value={lang}>{lang.toUpperCase()}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Theme Color</label>
            <input
              type="color"
              value={seoData.global.themeColor || '#ffffff'}
              onChange={(e) => updateGlobalSEO('themeColor', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded h-10"
            />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Site Verification</h3>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Site Verification</label>
              <input
                type="text"
                value={seoData.global.googleSiteVerification || ''}
                onChange={(e) => updateGlobalSEO('googleSiteVerification', e.target.value)}
                placeholder="Verification code"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Bing Site Verification</label>
              <input
                type="text"
                value={seoData.global.bingSiteVerification || ''}
                onChange={(e) => updateGlobalSEO('bingSiteVerification', e.target.value)}
                placeholder="Verification code"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Social Media</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook App ID</label>
              <input
                type="text"
                value={seoData.global.facebookAppId || ''}
                onChange={(e) => updateGlobalSEO('facebookAppId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Twitter Handle</label>
              <input
                type="text"
                value={seoData.global.twitterHandle || ''}
                onChange={(e) => updateGlobalSEO('twitterHandle', e.target.value)}
                placeholder="@username"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium mb-3">Analytics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Analytics ID</label>
              <input
                type="text"
                value={seoData.global.googleAnalyticsId || ''}
                onChange={(e) => updateGlobalSEO('googleAnalyticsId', e.target.value)}
                placeholder="UA-XXXXXXXXX-X"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Tag ID</label>
              <input
                type="text"
                value={seoData.global.gtagId || ''}
                onChange={(e) => updateGlobalSEO('gtagId', e.target.value)}
                placeholder="G-XXXXXXXXXX"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderSitemapSettings = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Sitemap Configuration</h3>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={seoData.sitemap.enabled}
              onChange={(e) => updateSitemap('enabled', e.target.checked)}
              className="mr-2"
            />
            Enable Sitemap
          </label>
        </div>

        {seoData.sitemap.enabled && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Change Frequency</label>
                <select
                  value={seoData.sitemap.changefreq || 'weekly'}
                  onChange={(e) => updateSitemap('changefreq', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                >
                  <option value="always">Always</option>
                  <option value="hourly">Hourly</option>
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="never">Never</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Priority</label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.1"
                  value={seoData.sitemap.priority || 0.5}
                  onChange={(e) => updateSitemap('priority', parseFloat(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Exclude Paths (one per line)</label>
              <textarea
                value={(seoData.sitemap.excludePaths || []).join('\n')}
                onChange={(e) => updateSitemap('excludePaths', e.target.value.split('\n').filter(p => p))}
                rows={4}
                placeholder="/admin&#10;/api&#10;/private"
                className="w-full px-3 py-2 border border-gray-300 rounded"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={seoData.sitemap.alternateRefs}
                  onChange={(e) => updateSitemap('alternateRefs', e.target.checked)}
                  className="mr-2"
                />
                Include alternate language references
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={seoData.sitemap.includeImages}
                  onChange={(e) => updateSitemap('includeImages', e.target.checked)}
                  className="mr-2"
                />
                Include images in sitemap
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={seoData.sitemap.autoGenerate}
                  onChange={(e) => updateSitemap('autoGenerate', e.target.checked)}
                  className="mr-2"
                />
                Auto-generate sitemap on save
              </label>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">
                Last generated: {seoData.sitemap.lastmod ? new Date(seoData.sitemap.lastmod).toLocaleString() : 'Never'}
              </p>
              <button
                onClick={() => {/* Generate sitemap */}}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                <Icon name="RefreshCw" size={16} className="inline mr-2" />
                Generate Sitemap Now
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderRobotsSettings = () => {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Robots.txt Configuration</h3>
          <button
            onClick={addRobotsRule}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Icon name="Plus" size={16} className="inline mr-1" />
            Add Rule
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Host</label>
          <input
            type="text"
            value={seoData.robots.host || ''}
            onChange={(e) => setSeoData(prev => ({
              ...prev,
              robots: { ...prev.robots, host: e.target.value }
            }))}
            placeholder="www.example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div className="space-y-4">
          {seoData.robots.rules?.map((rule, index) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h4 className="font-medium">Rule {index + 1}</h4>
                {index > 0 && (
                  <button
                    onClick={() => removeRobotsRule(index)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Icon name="Trash2" size={16} />
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">User Agent</label>
                  <input
                    type="text"
                    value={rule.userAgent}
                    onChange={(e) => updateRobots(index, 'userAgent', e.target.value)}
                    placeholder="* or bot name"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Crawl Delay (seconds)</label>
                  <input
                    type="number"
                    value={rule.crawlDelay || 0}
                    onChange={(e) => updateRobots(index, 'crawlDelay', parseInt(e.target.value))}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allow Paths</label>
                  <input
                    type="text"
                    value={rule.allow}
                    onChange={(e) => updateRobots(index, 'allow', e.target.value)}
                    placeholder="/"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Disallow Paths (comma-separated)</label>
                  <input
                    type="text"
                    value={Array.isArray(rule.disallow) ? rule.disallow.join(', ') : rule.disallow}
                    onChange={(e) => updateRobots(index, 'disallow', e.target.value.split(',').map(s => s.trim()))}
                    placeholder="/admin, /api"
                    className="w-full px-3 py-2 border border-gray-300 rounded"
                  />
                </div>
                {index === 0 && (
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Sitemap URL</label>
                    <input
                      type="text"
                      value={rule.sitemap || ''}
                      onChange={(e) => updateRobots(index, 'sitemap', e.target.value)}
                      placeholder="https://example.com/sitemap.xml"
                      className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-100 rounded p-4">
          <h4 className="font-medium mb-2">Preview</h4>
          <pre className="text-sm whitespace-pre-wrap font-mono">
{seoData.robots.rules?.map(rule => 
`User-agent: ${rule.userAgent}
${rule.allow ? `Allow: ${rule.allow}` : ''}
${Array.isArray(rule.disallow) ? rule.disallow.map(d => `Disallow: ${d}`).join('\n') : `Disallow: ${rule.disallow || ''}`}
${rule.crawlDelay ? `Crawl-delay: ${rule.crawlDelay}` : ''}
${rule.sitemap ? `Sitemap: ${rule.sitemap}` : ''}
`).join('\n')}
{seoData.robots.host ? `Host: ${seoData.robots.host}` : ''}
          </pre>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">SEO Manager</h2>
        <button
          onClick={saveSEOData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Icon name="Save" size={16} className="inline mr-2" />
          {loading ? 'Saving...' : 'Save SEO Settings'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('pages')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'pages'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Page SEO
          </button>
          <button
            onClick={() => setActiveTab('global')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'global'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Global Settings
          </button>
          <button
            onClick={() => setActiveTab('sitemap')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'sitemap'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Sitemap
          </button>
          <button
            onClick={() => setActiveTab('robots')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'robots'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Robots.txt
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'pages' && renderPagesSEO()}
        {activeTab === 'global' && renderGlobalSettings()}
        {activeTab === 'sitemap' && renderSitemapSettings()}
        {activeTab === 'robots' && renderRobotsSettings()}
      </div>
    </div>
  );
};

export default SEOManager;