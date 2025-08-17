import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { EditModeProvider, useEditMode } from './cms/contexts/EditModeContext';
import AdminDashboard from './cms/pages/AdminDashboard';

// Login component that uses EditModeContext
function LoginPage() {
  const { login, isAuthenticated } = useEditMode();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const result = await login(email, password);
      if (!result.success) {
        setError(result.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail('admin@braunundeyer.de');
    setPassword('admin123');
  };

  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-heading font-light text-primary mb-2">
            Braun & Eyer Architekturbüro
          </h1>
          <p className="text-text-secondary">Admin Panel</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-2xl p-8">
          <h2 className="text-2xl font-heading font-light text-primary mb-6">
            CMS Login
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@braunundeyer.de"
                required
                disabled={isLoading}
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="••••••••"
                required
                disabled={isLoading}
              />
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-2">Demo credentials:</p>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Use demo account
            </button>
            <p className="text-xs text-gray-500 mt-1">
              Email: admin@braunundeyer.de<br />
              Password: admin123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main App component
function App() {
  React.useEffect(() => {
    // Add admin-page class to body for proper cursor styles
    document.body.classList.add('admin-page');
    
    // Cleanup
    return () => {
      document.body.classList.remove('admin-page');
    };
  }, []);

  return (
    <EditModeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<LoginPage />} />
          <Route path="/admin/*" element={<LoginPage />} />
        </Routes>
      </BrowserRouter>
    </EditModeProvider>
  );
}

export default App;