import React, { useState, useEffect } from 'react';
import { API_BASE_URL, BACKEND_URL } from "../../config/api";
import Icon from '../../components/AppIcon';
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const AnalyticsDashboard = () => {
  const [period, setPeriod] = useState('7d');
  const [stats, setStats] = useState(null);
  const [realtime, setRealtime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch analytics data
  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/analytics/stats?period=${period}`);
      if (!response.ok) throw new Error('Failed to fetch analytics');
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      console.error('Analytics error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch real-time data
  const fetchRealtime = async () => {
    try {
      const response = await fetch(API_BASE_URL + '/analytics/realtime');
      if (!response.ok) throw new Error('Failed to fetch realtime data');
      const data = await response.json();
      setRealtime(data);
    } catch (err) {
      console.error('Realtime error:', err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchRealtime();

    // Refresh realtime data every 30 seconds
    const realtimeInterval = setInterval(fetchRealtime, 30000);
    
    // Refresh analytics data every 5 minutes
    const analyticsInterval = setInterval(fetchAnalytics, 300000);

    return () => {
      clearInterval(realtimeInterval);
      clearInterval(analyticsInterval);
    };
  }, [period]);

  // Colors for charts
  const COLORS = ['#fbbf24', '#60a5fa', '#34d399', '#f87171', '#a78bfa', '#fb923c'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Icon name="Loader" className="animate-spin" size={32} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading analytics: {error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-yellow-600">No analytics data available yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('24h')}
            className={`px-4 py-2 rounded-lg ${
              period === '24h' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            24 Hours
          </button>
          <button
            onClick={() => setPeriod('7d')}
            className={`px-4 py-2 rounded-lg ${
              period === '7d' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            7 Days
          </button>
          <button
            onClick={() => setPeriod('30d')}
            className={`px-4 py-2 rounded-lg ${
              period === '30d' ? 'bg-blue-600 text-white' : 'bg-gray-100 hover:bg-gray-200'
            }`}
          >
            30 Days
          </button>
        </div>
      </div>

      {/* Real-time Stats */}
      {realtime && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
              <span className="text-green-700 font-medium">
                {realtime.activeVisitors} Active Visitor{realtime.activeVisitors !== 1 ? 's' : ''} Right Now
              </span>
            </div>
            {realtime.currentPages && realtime.currentPages.length > 0 && (
              <span className="text-green-600 text-sm">
                Viewing: {realtime.currentPages.map(p => p.path).join(', ')}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Total Visitors</p>
              <p className="text-2xl font-bold">{stats.visitorStats?.total_visitors || 0}</p>
            </div>
            <Icon name="Users" size={24} className="text-blue-500" />
          </div>
          <p className="text-sm text-green-600 mt-2">
            +{stats.visitorStats?.new_visitors || 0} new
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Page Views</p>
              <p className="text-2xl font-bold">{stats.pageviewStats?.total_pageviews || 0}</p>
            </div>
            <Icon name="Eye" size={24} className="text-green-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {stats.pageviewStats?.unique_visitors || 0} unique
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Avg. Session</p>
              <p className="text-2xl font-bold">3:42</p>
            </div>
            <Icon name="Clock" size={24} className="text-yellow-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Duration
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Bounce Rate</p>
              <p className="text-2xl font-bold">42%</p>
            </div>
            <Icon name="TrendingDown" size={24} className="text-red-500" />
          </div>
          <p className="text-sm text-gray-600 mt-2">
            Average
          </p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Traffic Chart */}
        {stats.hourlyStats && stats.hourlyStats.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Traffic by Hour</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={stats.hourlyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pageviews" stroke="#fbbf24" name="Page Views" />
                <Line type="monotone" dataKey="visitors" stroke="#60a5fa" name="Visitors" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Device Types Chart */}
        {stats.deviceStats && stats.deviceStats.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Device Types</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={stats.deviceStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, count, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {stats.deviceStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        {stats.topPages && stats.topPages.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Top Pages</h3>
            <div className="space-y-2">
              {stats.topPages.map((page, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm truncate flex-1">{page.path}</span>
                  <div className="flex gap-4 text-sm">
                    <span className="text-gray-600">{page.views} views</span>
                    <span className="text-gray-500">{page.unique_views} unique</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Top Referrers */}
        {stats.topReferrers && stats.topReferrers.length > 0 && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium mb-4">Top Referrers</h3>
            <div className="space-y-2">
              {stats.topReferrers.map((referrer, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b">
                  <span className="text-sm truncate flex-1">
                    {referrer.referrer || 'Direct'}
                  </span>
                  <span className="text-sm text-gray-600">{referrer.count} visits</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Visitors Table */}
      {stats.recentVisitors && stats.recentVisitors.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Recent Visitors</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Visitor ID
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    First Visit
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Last Visit
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Visits
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Page Views
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Device
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                    Browser
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stats.recentVisitors.map((visitor, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-sm font-mono">
                      {visitor.visitor_id.substring(0, 12)}...
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {new Date(visitor.first_visit).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm">
                      {new Date(visitor.last_visit).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2 text-sm">{visitor.total_visits}</td>
                    <td className="px-4 py-2 text-sm">{visitor.total_pageviews}</td>
                    <td className="px-4 py-2 text-sm">{visitor.device_type}</td>
                    <td className="px-4 py-2 text-sm">{visitor.browser}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalyticsDashboard;
