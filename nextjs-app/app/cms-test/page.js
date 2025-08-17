'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CheckCircle, AlertCircle, Info, ExternalLink } from 'lucide-react';

export default function CMSTestPage() {
  const router = useRouter();
  const [accessMethod, setAccessMethod] = useState('');
  const [clickTestCount, setClickTestCount] = useState(0);
  const [testStatus, setTestStatus] = useState('idle');
  
  useEffect(() => {
    // Check how user accessed this page
    const referrer = document.referrer;
    if (referrer.includes('localhost')) {
      setAccessMethod('triple-click');
      setTestStatus('success');
    }
  }, []);

  const handleTestClick = () => {
    setClickTestCount(prev => {
      const newCount = prev + 1;
      if (newCount === 3) {
        setTestStatus('success');
        setTimeout(() => setClickTestCount(0), 2000);
        return 0;
      }
      return newCount;
    });
    
    // Reset after 1 second of no clicks
    setTimeout(() => {
      if (clickTestCount > 0 && clickTestCount < 3) {
        setClickTestCount(0);
        setTestStatus('idle');
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors duration-200 mb-6"
          >
            <ArrowLeft size={20} />
            <span>Zurück zur Website</span>
          </button>
          
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
            <h1 className="text-3xl font-bold text-white mb-2">
              🔧 CMS Test Environment
            </h1>
            <p className="text-gray-400">
              Lokale Testumgebung für die CMS-Zugriffsfunktion
            </p>
          </div>
        </div>

        {/* Status Card */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Zugriffsstatus</h2>
            {testStatus === 'success' ? (
              <div className="flex items-center space-x-2 text-green-400">
                <CheckCircle size={24} />
                <span className="font-medium">Erfolgreich</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-yellow-400">
                <AlertCircle size={24} />
                <span className="font-medium">Warte auf Triple-Click</span>
              </div>
            )}
          </div>
          
          {testStatus === 'success' && (
            <div className="bg-green-900/30 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-400">
                ✅ Triple-Click-Funktion funktioniert korrekt!
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Sie wurden erfolgreich von der Footer-Copyright-Zeile hierher weitergeleitet.
              </p>
            </div>
          )}
        </div>

        {/* Test Area */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">Triple-Click Test</h2>
          <p className="text-gray-400 mb-6">
            Testen Sie die Triple-Click-Funktion direkt hier:
          </p>
          
          <div 
            onClick={handleTestClick}
            className="bg-gray-900 border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-gray-500 transition-colors duration-200"
          >
            <p className="text-gray-300 font-medium mb-2">
              © 2025 Test Architekturbüro. Alle Rechte vorbehalten.
            </p>
            <p className="text-gray-500 text-sm">
              Klicks: {clickTestCount}/3
            </p>
            {clickTestCount > 0 && clickTestCount < 3 && (
              <div className="mt-4">
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-200"
                    style={{ width: `${(clickTestCount / 3) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Environment Info */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-8">
          <h2 className="text-xl font-semibold text-white mb-4">
            <Info className="inline mr-2" size={20} />
            Umgebungsinformationen
          </h2>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">Environment:</span>
              <span className="text-white font-mono">
                {process.env.NEXT_PUBLIC_ENV || 'development'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">CMS URL (Dev):</span>
              <span className="text-white font-mono text-sm">
                {process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3003/cms-test'}
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-700">
              <span className="text-gray-400">CMS URL (Prod):</span>
              <span className="text-white font-mono text-sm">
                https://cms.braunundeyer.de
              </span>
            </div>
            <div className="flex justify-between items-center py-2">
              <span className="text-gray-400">API URL:</span>
              <span className="text-white font-mono text-sm">
                {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}
              </span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-400 mb-3">
            📝 Anleitung
          </h3>
          <ol className="space-y-2 text-gray-300">
            <li>1. Navigieren Sie zu einer beliebigen Seite mit Footer</li>
            <li>2. Scrollen Sie zum Footer herunter</li>
            <li>3. Triple-Clicken Sie auf den Copyright-Text</li>
            <li>4. Sie werden zu dieser Testseite weitergeleitet</li>
            <li className="text-blue-400 font-medium mt-4">
              In Produktion wird zu https://cms.braunundeyer.de weitergeleitet
            </li>
          </ol>
        </div>

        {/* Production Simulation */}
        <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-semibold text-white mb-3">
            🚀 Produktions-Simulation
          </h3>
          <p className="text-gray-400 mb-4">
            Testen Sie, wie die Weiterleitung in Produktion funktionieren würde:
          </p>
          <a
            href="https://cms.braunundeyer.de"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors duration-200"
          >
            <span>Öffne CMS (Produktion)</span>
            <ExternalLink size={18} />
          </a>
        </div>
      </div>
    </div>
  );
}