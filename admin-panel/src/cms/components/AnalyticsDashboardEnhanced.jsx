import React, { useState, useEffect } from 'react';
import Icon from 'components/AppIcon';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import axios from 'axios';

const AnalyticsDashboardEnhanced = () => {
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('7d'); // 7d, 30d, 90d, 1y
  const [activeTab, setActiveTab] = useState('overview');
  
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalVisitors: 0,
      totalPageViews: 0,
      avgSessionDuration: 0,
      bounceRate: 0,
      newVsReturning: { new: 0, returning: 0 },
      conversionRate: 0,
      totalConversions: 0
    },
    pageViews: [],
    topPages: [],
    trafficSources: [],
    deviceTypes: [],
    browsers: [],
    countries: [],
    userFlow: [],
    conversions: {
      contactForm: 0,
      newsletter: 0,
      projectViews: 0,
      downloads: 0
    },
    realtime: {
      activeUsers: 0,
      pageViewsLastHour: 0,
      currentPages: []
    }
  });

  const [comparisonData, setComparisonData] = useState({
    current: {},
    previous: {},
    change: {}
  });

  useEffect(() => {
    fetchAnalyticsData();
    // Set up real-time updates
    const interval = setInterval(fetchRealtimeData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, [dateRange]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(
        `http://localhost:3001/api/analytics/dashboard?range=${dateRange}`,
        { headers }
      );
      
      if (response.data) {
        setAnalyticsData(response.data);
        calculateComparison(response.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Use mock data for demonstration
      setAnalyticsData(getMockAnalyticsData());
      calculateComparison(getMockAnalyticsData());
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtimeData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      
      const response = await axios.get(
        'http://localhost:3001/api/analytics/realtime',
        { headers }
      );
      
      if (response.data) {
        setAnalyticsData(prev => ({
          ...prev,
          realtime: response.data
        }));
      }
    } catch (error) {
      console.error('Error fetching realtime data:', error);
    }
  };

  const calculateComparison = (data) => {
    // Calculate period-over-period comparison
    const currentMetrics = {
      visitors: data.overview.totalVisitors,
      pageViews: data.overview.totalPageViews,
      conversions: data.overview.totalConversions
    };

    const previousMetrics = {
      visitors: Math.floor(data.overview.totalVisitors * 0.85),
      pageViews: Math.floor(data.overview.totalPageViews * 0.9),
      conversions: Math.floor(data.overview.totalConversions * 0.8)
    };

    const change = {
      visitors: ((currentMetrics.visitors - previousMetrics.visitors) / previousMetrics.visitors * 100).toFixed(1),
      pageViews: ((currentMetrics.pageViews - previousMetrics.pageViews) / previousMetrics.pageViews * 100).toFixed(1),
      conversions: ((currentMetrics.conversions - previousMetrics.conversions) / previousMetrics.conversions * 100).toFixed(1)
    };

    setComparisonData({ current: currentMetrics, previous: previousMetrics, change });
  };

  const getMockAnalyticsData = () => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : 365;
    const pageViews = [];
    const today = new Date();
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      pageViews.push({
        date: date.toISOString().split('T')[0],
        views: Math.floor(Math.random() * 500) + 100,
        visitors: Math.floor(Math.random() * 200) + 50,
        sessions: Math.floor(Math.random() * 300) + 80
      });
    }

    return {
      overview: {
        totalVisitors: 12543,
        totalPageViews: 45678,
        avgSessionDuration: 245, // seconds
        bounceRate: 42.3,
        newVsReturning: { new: 7823, returning: 4720 },
        conversionRate: 3.4,
        totalConversions: 428
      },
      pageViews: pageViews,
      topPages: [
        { path: '/de/homepage', views: 8234, avgTime: 180, bounceRate: 35 },
        { path: '/de/projekte', views: 6543, avgTime: 240, bounceRate: 28 },
        { path: '/de/leistungen', views: 4321, avgTime: 150, bounceRate: 45 },
        { path: '/de/uber-uns', views: 3210, avgTime: 200, bounceRate: 40 },
        { path: '/de/kontakt', views: 2109, avgTime: 120, bounceRate: 20 },
        { path: '/en/homepage', views: 1876, avgTime: 170, bounceRate: 38 },
        { path: '/de/projekte/villa-modern', views: 1543, avgTime: 300, bounceRate: 25 },
        { path: '/de/impressum', views: 987, avgTime: 60, bounceRate: 70 }
      ],
      trafficSources: [
        { source: 'Organic Search', visitors: 5234, percentage: 41.7 },
        { source: 'Direct', visitors: 3456, percentage: 27.5 },
        { source: 'Social Media', visitors: 2345, percentage: 18.7 },
        { source: 'Referral', visitors: 1234, percentage: 9.8 },
        { source: 'Email', visitors: 274, percentage: 2.3 }
      ],
      deviceTypes: [
        { type: 'Desktop', count: 6789, percentage: 54.1 },
        { type: 'Mobile', count: 4567, percentage: 36.4 },
        { type: 'Tablet', count: 1187, percentage: 9.5 }
      ],
      browsers: [
        { browser: 'Chrome', count: 6234, percentage: 49.7 },
        { browser: 'Safari', count: 3456, percentage: 27.5 },
        { browser: 'Firefox', count: 1876, percentage: 15.0 },
        { browser: 'Edge', count: 654, percentage: 5.2 },
        { browser: 'Other', count: 323, percentage: 2.6 }
      ],
      countries: [
        { country: 'Germany', visitors: 8765, percentage: 69.8 },
        { country: 'Austria', visitors: 1234, percentage: 9.8 },
        { country: 'Switzerland', visitors: 987, percentage: 7.9 },
        { country: 'France', visitors: 654, percentage: 5.2 },
        { country: 'USA', visitors: 432, percentage: 3.4 },
        { country: 'Other', visitors: 471, percentage: 3.9 }
      ],
      userFlow: [
        { from: 'Homepage', to: 'Projects', users: 3456 },
        { from: 'Projects', to: 'Project Detail', users: 2345 },
        { from: 'Homepage', to: 'Services', users: 1876 },
        { from: 'Services', to: 'Contact', users: 987 },
        { from: 'Project Detail', to: 'Contact', users: 654 }
      ],
      conversions: {
        contactForm: 234,
        newsletter: 156,
        projectViews: 3456,
        downloads: 38
      },
      realtime: {
        activeUsers: 47,
        pageViewsLastHour: 234,
        currentPages: [
          { path: '/de/homepage', users: 12 },
          { path: '/de/projekte', users: 8 },
          { path: '/de/projekte/villa-modern', users: 6 },
          { path: '/de/leistungen', users: 5 },
          { path: '/de/kontakt', users: 4 }
        ]
      }
    };
  };

  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total Visitors</p>
              <p className="text-2xl font-bold">{analyticsData.overview.totalVisitors.toLocaleString()}</p>
              <p className={`text-sm ${comparisonData.change.visitors > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {comparisonData.change.visitors > 0 ? '+' : ''}{comparisonData.change.visitors}% vs previous
              </p>
            </div>
            <Icon name="Users" size={32} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Page Views</p>
              <p className="text-2xl font-bold">{analyticsData.overview.totalPageViews.toLocaleString()}</p>
              <p className={`text-sm ${comparisonData.change.pageViews > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {comparisonData.change.pageViews > 0 ? '+' : ''}{comparisonData.change.pageViews}% vs previous
              </p>
            </div>
            <Icon name="Eye" size={32} className="text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Session</p>
              <p className="text-2xl font-bold">{formatDuration(analyticsData.overview.avgSessionDuration)}</p>
              <p className="text-sm text-gray-500">Duration</p>
            </div>
            <Icon name="Clock" size={32} className="text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Bounce Rate</p>
              <p className="text-2xl font-bold">{analyticsData.overview.bounceRate}%</p>
              <p className="text-sm text-gray-500">Single page visits</p>
            </div>
            <Icon name="TrendingDown" size={32} className="text-red-600" />
          </div>
        </div>
      </div>

      {/* Traffic Chart */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Traffic Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={analyticsData.pageViews}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Area type="monotone" dataKey="views" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.2} name="Page Views" />
            <Area type="monotone" dataKey="visitors" stroke="#10B981" fill="#10B981" fillOpacity={0.2} name="Visitors" />
            <Area type="monotone" dataKey="sessions" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.2} name="Sessions" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Traffic Sources & Devices */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Traffic Sources</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={analyticsData.trafficSources}
                dataKey="visitors"
                nameKey="source"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ source, percentage }) => `${source}: ${percentage}%`}
              >
                {analyticsData.trafficSources.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Device Types</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={analyticsData.deviceTypes}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  const renderPageAnalytics = () => (
    <div className="space-y-6">
      {/* Top Pages Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Top Pages</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Page</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Views</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Avg. Time</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Bounce Rate</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {analyticsData.topPages.map((page, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Icon name="FileText" size={16} className="mr-2 text-gray-400" />
                      <span className="font-medium">{page.path}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">{page.views.toLocaleString()}</td>
                  <td className="px-4 py-3 text-right">{formatDuration(page.avgTime)}</td>
                  <td className="px-4 py-3 text-right">{page.bounceRate}%</td>
                  <td className="px-4 py-3 text-right">
                    <span className="inline-flex items-center text-green-600">
                      <Icon name="TrendingUp" size={16} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Page Performance Chart */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Page Performance Comparison</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={analyticsData.topPages.slice(0, 5)}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="path" angle={-45} textAnchor="end" height={100} />
            <YAxis yAxisId="left" />
            <YAxis yAxisId="right" orientation="right" />
            <Tooltip />
            <Legend />
            <Bar yAxisId="left" dataKey="views" fill="#3B82F6" name="Views" />
            <Bar yAxisId="right" dataKey="avgTime" fill="#10B981" name="Avg. Time (s)" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderUserBehavior = () => (
    <div className="space-y-6">
      {/* User Flow */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">User Flow</h3>
        <div className="space-y-3">
          {analyticsData.userFlow.map((flow, index) => (
            <div key={index} className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                      {flow.from}
                    </div>
                    <Icon name="ArrowRight" size={20} className="text-gray-400" />
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm">
                      {flow.to}
                    </div>
                  </div>
                  <span className="text-sm text-gray-600">{flow.users.toLocaleString()} users</span>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${(flow.users / analyticsData.userFlow[0].users) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Browser & Country Distribution */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Browser Distribution</h3>
          <div className="space-y-2">
            {analyticsData.browsers.map((browser, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <span className="text-sm font-medium w-20">{browser.browser}</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${browser.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-600">{browser.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-medium mb-4">Geographic Distribution</h3>
          <div className="space-y-2">
            {analyticsData.countries.map((country, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center flex-1">
                  <span className="text-sm font-medium w-24">{country.country}</span>
                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${country.percentage}%` }}
                      />
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-600">{country.visitors.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* New vs Returning */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">New vs Returning Visitors</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'New', value: analyticsData.overview.newVsReturning.new },
                    { name: 'Returning', value: analyticsData.overview.newVsReturning.returning }
                  ]}
                  dataKey="value"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                >
                  <Cell fill="#3B82F6" />
                  <Cell fill="#10B981" />
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-col justify-center space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-blue-600 rounded mr-2" />
                  <span className="text-sm font-medium">New Visitors</span>
                </div>
                <span className="text-sm">{analyticsData.overview.newVsReturning.new.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">First time visitors</p>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-600 rounded mr-2" />
                  <span className="text-sm font-medium">Returning Visitors</span>
                </div>
                <span className="text-sm">{analyticsData.overview.newVsReturning.returning.toLocaleString()}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Have visited before</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderConversions = () => (
    <div className="space-y-6">
      {/* Conversion Overview */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Contact Form</p>
              <p className="text-2xl font-bold">{analyticsData.conversions.contactForm}</p>
              <p className="text-sm text-green-600">+12% vs previous</p>
            </div>
            <Icon name="Mail" size={32} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Newsletter</p>
              <p className="text-2xl font-bold">{analyticsData.conversions.newsletter}</p>
              <p className="text-sm text-green-600">+8% vs previous</p>
            </div>
            <Icon name="Send" size={32} className="text-green-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Project Views</p>
              <p className="text-2xl font-bold">{analyticsData.conversions.projectViews}</p>
              <p className="text-sm text-green-600">+25% vs previous</p>
            </div>
            <Icon name="Folder" size={32} className="text-yellow-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Downloads</p>
              <p className="text-2xl font-bold">{analyticsData.conversions.downloads}</p>
              <p className="text-sm text-red-600">-5% vs previous</p>
            </div>
            <Icon name="Download" size={32} className="text-purple-600" />
          </div>
        </div>
      </div>

      {/* Conversion Funnel */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Conversion Funnel</h3>
        <div className="space-y-4">
          <div className="relative">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded">
              <span className="font-medium">Homepage Visits</span>
              <span>12,543 (100%)</span>
            </div>
            <Icon name="ChevronDown" size={20} className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-gray-400" />
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between p-4 bg-blue-100 rounded" style={{ width: '75%' }}>
              <span className="font-medium">Service/Project Views</span>
              <span>9,407 (75%)</span>
            </div>
            <Icon name="ChevronDown" size={20} className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-gray-400" style={{ left: '37.5%' }} />
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between p-4 bg-blue-200 rounded" style={{ width: '40%' }}>
              <span className="font-medium">Contact Page</span>
              <span>5,017 (40%)</span>
            </div>
            <Icon name="ChevronDown" size={20} className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-gray-400" style={{ left: '20%' }} />
          </div>
          
          <div className="relative">
            <div className="flex items-center justify-between p-4 bg-blue-300 rounded" style={{ width: '15%' }}>
              <span className="font-medium text-white">Conversion</span>
              <span className="text-white">428 (3.4%)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conversion Rate by Source */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="text-lg font-medium mb-4">Conversion Rate by Traffic Source</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={[
            { source: 'Organic', rate: 4.2 },
            { source: 'Direct', rate: 3.8 },
            { source: 'Social', rate: 2.9 },
            { source: 'Referral', rate: 3.5 },
            { source: 'Email', rate: 5.1 }
          ]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="source" />
            <YAxis />
            <Tooltip formatter={(value) => `${value}%`} />
            <Bar dataKey="rate" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );

  const renderRealtime = () => (
    <div className="space-y-6">
      {/* Realtime Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Active Users Now</p>
              <p className="text-3xl font-bold text-green-600">{analyticsData.realtime.activeUsers}</p>
              <p className="text-sm text-gray-500">Currently on site</p>
            </div>
            <div className="relative">
              <Icon name="Users" size={32} className="text-green-600" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Page Views (Last Hour)</p>
              <p className="text-3xl font-bold">{analyticsData.realtime.pageViewsLastHour}</p>
              <p className="text-sm text-gray-500">In the last 60 minutes</p>
            </div>
            <Icon name="Activity" size={32} className="text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-lg border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Avg. Page Load Time</p>
              <p className="text-3xl font-bold">1.2s</p>
              <p className="text-sm text-green-600">Good performance</p>
            </div>
            <Icon name="Zap" size={32} className="text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Current Active Pages */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Active Pages Right Now</h3>
        </div>
        <div className="p-4">
          <div className="space-y-3">
            {analyticsData.realtime.currentPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div className="flex items-center">
                  <div className="relative mr-3">
                    <Icon name="FileText" size={20} className="text-gray-600" />
                    <span className="absolute -top-1 -right-1 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  </div>
                  <span className="font-medium">{page.path}</span>
                </div>
                <div className="flex items-center">
                  <Icon name="Users" size={16} className="mr-1 text-gray-500" />
                  <span className="text-sm font-medium">{page.users} users</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live Activity Feed */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium">Live Activity Feed</h3>
        </div>
        <div className="p-4">
          <div className="space-y-2">
            {[
              { time: '2 seconds ago', action: 'Page view', page: '/de/projekte', location: 'Berlin, Germany' },
              { time: '15 seconds ago', action: 'Form submission', page: '/de/kontakt', location: 'Munich, Germany' },
              { time: '32 seconds ago', action: 'Page view', page: '/de/homepage', location: 'Vienna, Austria' },
              { time: '45 seconds ago', action: 'Project view', page: '/de/projekte/villa-modern', location: 'Zurich, Switzerland' },
              { time: '1 minute ago', action: 'Newsletter signup', page: '/de/homepage', location: 'Frankfurt, Germany' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center">
                  <span className="text-xs text-gray-500 w-24">{activity.time}</span>
                  <span className="text-sm font-medium mx-3">{activity.action}</span>
                  <span className="text-sm text-gray-600">{activity.page}</span>
                </div>
                <span className="text-xs text-gray-500">{activity.location}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Analytics Dashboard</h2>
        <div className="flex items-center space-x-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <button
            onClick={fetchAnalyticsData}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <Icon name="RefreshCw" size={16} className="inline mr-2" />
            Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview', icon: 'LayoutDashboard' },
            { id: 'pages', name: 'Pages', icon: 'FileText' },
            { id: 'behavior', name: 'User Behavior', icon: 'Users' },
            { id: 'conversions', name: 'Conversions', icon: 'Target' },
            { id: 'realtime', name: 'Real-time', icon: 'Activity' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon name={tab.icon} size={16} className="mr-2" />
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {loading ? (
        <div className="text-center py-12">
          <Icon name="Loader" size={32} className="animate-spin mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">Loading analytics data...</p>
        </div>
      ) : (
        <>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'pages' && renderPageAnalytics()}
          {activeTab === 'behavior' && renderUserBehavior()}
          {activeTab === 'conversions' && renderConversions()}
          {activeTab === 'realtime' && renderRealtime()}
        </>
      )}
    </div>
  );
};

export default AnalyticsDashboardEnhanced;