import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import axios from 'axios';

const ContactSettings = () => {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('office');
  
  // Office Information
  const [officeInfo, setOfficeInfo] = useState({
    companyName: 'Braun & Eyer Architekturbüro',
    street: 'Hauptstraße 123',
    zipCode: '66111',
    city: 'Saarbrücken',
    country: 'Deutschland',
    phone: '+49 681 123456',
    fax: '+49 681 123457',
    email: 'info@braunundeyer.de',
    vatId: 'DE123456789',
    registrationCourt: 'Amtsgericht Saarbrücken',
    registrationNumber: 'HRB 12345'
  });

  // Opening Hours
  const [openingHours, setOpeningHours] = useState([
    { day: 'Monday', dayDe: 'Montag', open: '09:00', close: '18:00', closed: false },
    { day: 'Tuesday', dayDe: 'Dienstag', open: '09:00', close: '18:00', closed: false },
    { day: 'Wednesday', dayDe: 'Mittwoch', open: '09:00', close: '18:00', closed: false },
    { day: 'Thursday', dayDe: 'Donnerstag', open: '09:00', close: '18:00', closed: false },
    { day: 'Friday', dayDe: 'Freitag', open: '09:00', close: '17:00', closed: false },
    { day: 'Saturday', dayDe: 'Samstag', open: '10:00', close: '14:00', closed: false },
    { day: 'Sunday', dayDe: 'Sonntag', open: '', close: '', closed: true }
  ]);

  // Map Settings
  const [mapSettings, setMapSettings] = useState({
    latitude: 49.2327,
    longitude: 7.0055,
    zoom: 15,
    mapStyle: 'streets',
    showMarker: true,
    markerTitle: 'Braun & Eyer Architekturbüro'
  });

  // Contact Form Settings
  const [formSettings, setFormSettings] = useState({
    recipientEmail: 'info@braunundeyer.de',
    ccEmails: [],
    emailSubjectPrefix: '[Website Contact]',
    autoReply: true,
    autoReplySubject: 'Vielen Dank für Ihre Nachricht',
    autoReplyMessage: 'Wir haben Ihre Nachricht erhalten und werden uns schnellstmöglich bei Ihnen melden.',
    requiredFields: ['name', 'email', 'message'],
    optionalFields: ['phone', 'company', 'projectType'],
    enableCaptcha: true,
    saveToDatabase: true,
    notifySlack: false,
    slackWebhook: ''
  });

  // Social Media Links
  const [socialLinks, setSocialLinks] = useState([
    { platform: 'Facebook', url: 'https://facebook.com/braunundeyer', icon: 'Facebook', active: true },
    { platform: 'Instagram', url: 'https://instagram.com/braunundeyer', icon: 'Instagram', active: true },
    { platform: 'LinkedIn', url: 'https://linkedin.com/company/braunundeyer', icon: 'Linkedin', active: true },
    { platform: 'Twitter', url: '', icon: 'Twitter', active: false },
    { platform: 'YouTube', url: '', icon: 'Youtube', active: false }
  ]);

  useEffect(() => {
    fetchContactSettings();
  }, []);

  const fetchContactSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get('http://localhost:3001/api/content/contact-settings', { headers });
      
      if (response.data && response.data.value) {
        const data = JSON.parse(response.data.value);
        setOfficeInfo(data.officeInfo || officeInfo);
        setOpeningHours(data.openingHours || openingHours);
        setMapSettings(data.mapSettings || mapSettings);
        setFormSettings(data.formSettings || formSettings);
        setSocialLinks(data.socialLinks || socialLinks);
      }
    } catch (error) {
      console.error('Error fetching contact settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveContactSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = {
        officeInfo,
        openingHours,
        mapSettings,
        formSettings,
        socialLinks
      };
      
      await axios.post(
        'http://localhost:3001/api/content',
        {
          key: 'contact-settings',
          value: JSON.stringify(data),
          language: 'de'
        },
        { headers: token ? { Authorization: `Bearer ${token}` } : {} }
      );
      
      alert('Contact settings saved successfully!');
    } catch (error) {
      console.error('Error saving contact settings:', error);
      alert('Failed to save contact settings');
    } finally {
      setLoading(false);
    }
  };

  const updateOfficeInfo = (field, value) => {
    setOfficeInfo({ ...officeInfo, [field]: value });
  };

  const updateOpeningHour = (index, field, value) => {
    const updated = [...openingHours];
    updated[index] = { ...updated[index], [field]: value };
    setOpeningHours(updated);
  };

  const updateMapSettings = (field, value) => {
    setMapSettings({ ...mapSettings, [field]: value });
  };

  const updateFormSettings = (field, value) => {
    setFormSettings({ ...formSettings, [field]: value });
  };

  const updateSocialLink = (index, field, value) => {
    const updated = [...socialLinks];
    updated[index] = { ...updated[index], [field]: value };
    setSocialLinks(updated);
  };

  const addCcEmail = () => {
    const email = prompt('Enter CC email address:');
    if (email && email.includes('@')) {
      setFormSettings({
        ...formSettings,
        ccEmails: [...formSettings.ccEmails, email]
      });
    }
  };

  const removeCcEmail = (index) => {
    setFormSettings({
      ...formSettings,
      ccEmails: formSettings.ccEmails.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Contact Settings</h2>
        <button
          onClick={saveContactSettings}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          <Icon name="Save" size={16} className="inline mr-2" />
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('office')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'office'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Office Info
          </button>
          <button
            onClick={() => setActiveTab('hours')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'hours'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Opening Hours
          </button>
          <button
            onClick={() => setActiveTab('map')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'map'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Map Settings
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'form'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Contact Form
          </button>
          <button
            onClick={() => setActiveTab('social')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'social'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Social Media
          </button>
        </nav>
      </div>

      {/* Office Information Tab */}
      {activeTab === 'office' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-4">Office Information</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input
                type="text"
                value={officeInfo.companyName}
                onChange={(e) => updateOfficeInfo('companyName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                value={officeInfo.street}
                onChange={(e) => updateOfficeInfo('street', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
              <input
                type="text"
                value={officeInfo.zipCode}
                onChange={(e) => updateOfficeInfo('zipCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={officeInfo.city}
                onChange={(e) => updateOfficeInfo('city', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input
                type="tel"
                value={officeInfo.phone}
                onChange={(e) => updateOfficeInfo('phone', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Fax</label>
              <input
                type="tel"
                value={officeInfo.fax}
                onChange={(e) => updateOfficeInfo('fax', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={officeInfo.email}
                onChange={(e) => updateOfficeInfo('email', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">VAT ID</label>
              <input
                type="text"
                value={officeInfo.vatId}
                onChange={(e) => updateOfficeInfo('vatId', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Opening Hours Tab */}
      {activeTab === 'hours' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-4">Opening Hours</h3>
          
          <div className="space-y-3">
            {openingHours.map((hour, index) => (
              <div key={hour.day} className="flex items-center space-x-4 p-3 border rounded-lg">
                <div className="w-32 font-medium">{hour.dayDe}</div>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hour.closed}
                    onChange={(e) => updateOpeningHour(index, 'closed', e.target.checked)}
                    className="mr-2"
                  />
                  Closed
                </label>
                
                {!hour.closed && (
                  <>
                    <input
                      type="time"
                      value={hour.open}
                      onChange={(e) => updateOpeningHour(index, 'open', e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded"
                    />
                    <span>to</span>
                    <input
                      type="time"
                      value={hour.close}
                      onChange={(e) => updateOpeningHour(index, 'close', e.target.value)}
                      className="px-3 py-1 border border-gray-300 rounded"
                    />
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Map Settings Tab */}
      {activeTab === 'map' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-4">Map Settings</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
              <input
                type="number"
                step="0.0001"
                value={mapSettings.latitude}
                onChange={(e) => updateMapSettings('latitude', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
              <input
                type="number"
                step="0.0001"
                value={mapSettings.longitude}
                onChange={(e) => updateMapSettings('longitude', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Zoom Level</label>
              <input
                type="number"
                min="1"
                max="20"
                value={mapSettings.zoom}
                onChange={(e) => updateMapSettings('zoom', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Map Style</label>
              <select
                value={mapSettings.mapStyle}
                onChange={(e) => updateMapSettings('mapStyle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value="streets">Streets</option>
                <option value="satellite">Satellite</option>
                <option value="hybrid">Hybrid</option>
                <option value="terrain">Terrain</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marker Title</label>
              <input
                type="text"
                value={mapSettings.markerTitle}
                onChange={(e) => updateMapSettings('markerTitle', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div className="flex items-center">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={mapSettings.showMarker}
                  onChange={(e) => updateMapSettings('showMarker', e.target.checked)}
                  className="mr-2"
                />
                Show Map Marker
              </label>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">
              To get coordinates: Right-click on Google Maps and select "What's here?" to see latitude and longitude.
            </p>
          </div>
        </div>
      )}

      {/* Contact Form Tab */}
      {activeTab === 'form' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-4">Contact Form Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Recipient Email</label>
              <input
                type="email"
                value={formSettings.recipientEmail}
                onChange={(e) => updateFormSettings('recipientEmail', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">CC Emails</label>
              <div className="space-y-2">
                {formSettings.ccEmails.map((email, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="email"
                      value={email}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <button
                      onClick={() => removeCcEmail(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded"
                    >
                      <Icon name="X" size={16} />
                    </button>
                  </div>
                ))}
                <button
                  onClick={addCcEmail}
                  className="px-3 py-1 text-blue-600 border border-blue-600 rounded hover:bg-blue-50"
                >
                  <Icon name="Plus" size={16} className="inline mr-1" />
                  Add CC Email
                </button>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Subject Prefix</label>
              <input
                type="text"
                value={formSettings.emailSubjectPrefix}
                onChange={(e) => updateFormSettings('emailSubjectPrefix', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formSettings.autoReply}
                  onChange={(e) => updateFormSettings('autoReply', e.target.checked)}
                  className="mr-2"
                />
                Enable Auto-Reply
              </label>
              
              {formSettings.autoReply && (
                <div className="ml-6 space-y-2">
                  <input
                    type="text"
                    value={formSettings.autoReplySubject}
                    onChange={(e) => updateFormSettings('autoReplySubject', e.target.value)}
                    placeholder="Auto-reply subject"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                  <textarea
                    value={formSettings.autoReplyMessage}
                    onChange={(e) => updateFormSettings('autoReplyMessage', e.target.value)}
                    placeholder="Auto-reply message"
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formSettings.enableCaptcha}
                  onChange={(e) => updateFormSettings('enableCaptcha', e.target.checked)}
                  className="mr-2"
                />
                Enable reCAPTCHA
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formSettings.saveToDatabase}
                  onChange={(e) => updateFormSettings('saveToDatabase', e.target.checked)}
                  className="mr-2"
                />
                Save Submissions to Database
              </label>
            </div>
          </div>
        </div>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium mb-4">Social Media Links</h3>
          
          <div className="space-y-3">
            {socialLinks.map((link, index) => (
              <div key={link.platform} className="flex items-center space-x-4 p-3 border rounded-lg">
                <Icon name={link.icon} size={24} className="text-gray-600" />
                <div className="flex-1">
                  <div className="font-medium">{link.platform}</div>
                  <input
                    type="url"
                    value={link.url}
                    onChange={(e) => updateSocialLink(index, 'url', e.target.value)}
                    placeholder={`https://${link.platform.toLowerCase()}.com/yourprofile`}
                    className="w-full mt-1 px-3 py-1 border border-gray-300 rounded text-sm"
                  />
                </div>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={link.active}
                    onChange={(e) => updateSocialLink(index, 'active', e.target.checked)}
                    className="mr-2"
                  />
                  Active
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactSettings;