import express from 'express';
import db from '../config/db-simple.js';
import logger from '../utils/logger.js';

const router = express.Router();

// Initialize analytics tables
const initAnalyticsTables = () => {
  setTimeout(() => {
    try {
      // Visitors table
      db.run(`
      CREATE TABLE IF NOT EXISTS visitors (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        visitor_id TEXT UNIQUE NOT NULL,
        first_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
        last_visit DATETIME DEFAULT CURRENT_TIMESTAMP,
        total_visits INTEGER DEFAULT 1,
        total_pageviews INTEGER DEFAULT 0,
        referrer TEXT,
        landing_page TEXT,
        country TEXT,
        city TEXT,
        device_type TEXT,
        browser TEXT,
        os TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Page views table
    db.run(`
      CREATE TABLE IF NOT EXISTS pageviews (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        visitor_id TEXT,
        path TEXT,
        title TEXT,
        referrer TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        duration INTEGER,
        screen_width INTEGER,
        screen_height INTEGER,
        language TEXT,
        user_agent TEXT,
        query_params TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Analytics sessions table (renamed to avoid conflict with auth sessions)
    db.run(`
      CREATE TABLE IF NOT EXISTS analytics_sessions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        visitor_id TEXT,
        session_start DATETIME DEFAULT CURRENT_TIMESTAMP,
        session_end DATETIME,
        duration INTEGER,
        page_count INTEGER DEFAULT 1,
        bounce BOOLEAN DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Events table
    db.run(`
      CREATE TABLE IF NOT EXISTS analytics_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        visitor_id TEXT,
        event_name TEXT,
        event_data TEXT,
        path TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Daily stats table for quick aggregation
    db.run(`
      CREATE TABLE IF NOT EXISTS daily_stats (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date DATE UNIQUE,
        total_visitors INTEGER DEFAULT 0,
        new_visitors INTEGER DEFAULT 0,
        total_pageviews INTEGER DEFAULT 0,
        avg_session_duration INTEGER DEFAULT 0,
        bounce_rate REAL DEFAULT 0,
        top_pages TEXT,
        top_referrers TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

      logger.info('Analytics tables initialized');
    } catch (error) {
      logger.error('Failed to initialize analytics tables:', error);
    }
  }, 1000); // Wait 1 second for database to be ready
};

// Initialize tables on module load
initAnalyticsTables();

// Helper function to parse user agent
const parseUserAgent = (userAgent) => {
  const browser = userAgent.match(/(Chrome|Firefox|Safari|Edge|Opera)/i)?.[0] || 'Unknown';
  const os = userAgent.match(/(Windows|Mac|Linux|Android|iOS)/i)?.[0] || 'Unknown';
  const isMobile = /Mobile|Android|iPhone/i.test(userAgent);
  const deviceType = isMobile ? 'Mobile' : 'Desktop';
  
  return { browser, os, deviceType };
};

// Track page view
router.post('/pageview', async (req, res) => {
  try {
    const {
      visitorId,
      path,
      title,
      timestamp,
      referrer,
      screenWidth,
      screenHeight,
      language,
      userAgent,
      queryParams
    } = req.body;

    // Insert pageview
    const stmt = db.prepare(`
      INSERT INTO pageviews (
        visitor_id, path, title, referrer, timestamp,
        screen_width, screen_height, language, user_agent, query_params
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      visitorId || 'anonymous',
      path,
      title,
      referrer,
      timestamp || new Date().toISOString(),
      screenWidth,
      screenHeight,
      language,
      userAgent,
      queryParams
    );

    // Update visitor stats
    if (visitorId && visitorId !== 'anonymous') {
      const updateStmt = db.prepare(`
        UPDATE visitors 
        SET last_visit = CURRENT_TIMESTAMP,
            total_pageviews = total_pageviews + 1
        WHERE visitor_id = ?
      `);
      updateStmt.run(visitorId);
    }

    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to track pageview:', error);
    res.status(500).json({ error: 'Failed to track pageview' });
  }
});

// Track new visitor
router.post('/visitor', async (req, res) => {
  try {
    const {
      visitorId,
      firstVisit,
      referrer,
      landingPage,
      userAgent
    } = req.body;

    const { browser, os, deviceType } = parseUserAgent(userAgent || '');

    const stmt = db.prepare(`
      INSERT OR IGNORE INTO visitors (
        visitor_id, first_visit, referrer, landing_page,
        browser, os, device_type
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      visitorId,
      firstVisit || new Date().toISOString(),
      referrer,
      landingPage,
      browser,
      os,
      deviceType
    );

    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to track visitor:', error);
    res.status(500).json({ error: 'Failed to track visitor' });
  }
});

// Track session
router.post('/session', async (req, res) => {
  try {
    const {
      visitorId,
      sessionStart,
      page
    } = req.body;

    // Check for existing active session
    const existingSession = db.prepare(`
      SELECT id FROM analytics_sessions 
      WHERE visitor_id = ? 
      AND session_end IS NULL 
      AND datetime(session_start) > datetime('now', '-30 minutes')
    `).get(visitorId);

    if (existingSession) {
      // Update existing session
      const updateStmt = db.prepare(`
        UPDATE analytics_sessions 
        SET page_count = page_count + 1 
        WHERE id = ?
      `);
      updateStmt.run(existingSession.id);
    } else {
      // Create new session
      const stmt = db.prepare(`
        INSERT INTO analytics_sessions (visitor_id, session_start)
        VALUES (?, ?)
      `);
      stmt.run(visitorId, sessionStart || new Date().toISOString());

      // Update visitor visit count
      const updateVisitor = db.prepare(`
        UPDATE visitors 
        SET total_visits = total_visits + 1,
            last_visit = CURRENT_TIMESTAMP
        WHERE visitor_id = ?
      `);
      updateVisitor.run(visitorId);
    }

    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to track session:', error);
    res.status(500).json({ error: 'Failed to track session' });
  }
});

// Track custom event
router.post('/event', async (req, res) => {
  try {
    const {
      visitorId,
      eventName,
      eventData,
      path,
      timestamp
    } = req.body;

    const stmt = db.prepare(`
      INSERT INTO analytics_events (
        visitor_id, event_name, event_data, path, timestamp
      ) VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(
      visitorId || 'anonymous',
      eventName,
      JSON.stringify(eventData || {}),
      path,
      timestamp || new Date().toISOString()
    );

    res.json({ success: true });
  } catch (error) {
    logger.error('Failed to track event:', error);
    res.status(500).json({ error: 'Failed to track event' });
  }
});

// Get analytics dashboard data
router.get('/dashboard', async (req, res) => {
  try {
    const { range = '7d' } = req.query;
    
    // Calculate date range
    let days = 7;
    switch (range) {
      case '30d': days = 30; break;
      case '90d': days = 90; break;
      case '1y': days = 365; break;
      default: days = 7;
    }
    
    // Generate mock analytics data for demonstration
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
    
    const analyticsData = {
      overview: {
        totalVisitors: Math.floor(Math.random() * 10000) + 5000,
        totalPageViews: Math.floor(Math.random() * 30000) + 15000,
        avgSessionDuration: Math.floor(Math.random() * 300) + 120,
        bounceRate: Math.floor(Math.random() * 30) + 30,
        newVsReturning: {
          new: Math.floor(Math.random() * 6000) + 3000,
          returning: Math.floor(Math.random() * 4000) + 2000
        },
        conversionRate: (Math.random() * 5 + 1).toFixed(1),
        totalConversions: Math.floor(Math.random() * 500) + 100
      },
      pageViews: pageViews,
      topPages: [
        { path: '/de/homepage', views: Math.floor(Math.random() * 5000) + 3000, avgTime: 180, bounceRate: 35 },
        { path: '/de/projekte', views: Math.floor(Math.random() * 4000) + 2000, avgTime: 240, bounceRate: 28 },
        { path: '/de/leistungen', views: Math.floor(Math.random() * 3000) + 1500, avgTime: 150, bounceRate: 45 },
        { path: '/de/uber-uns', views: Math.floor(Math.random() * 2000) + 1000, avgTime: 200, bounceRate: 40 },
        { path: '/de/kontakt', views: Math.floor(Math.random() * 1500) + 800, avgTime: 120, bounceRate: 20 }
      ],
      trafficSources: [
        { source: 'Organic Search', visitors: Math.floor(Math.random() * 3000) + 2000, percentage: 41.7 },
        { source: 'Direct', visitors: Math.floor(Math.random() * 2000) + 1500, percentage: 27.5 },
        { source: 'Social Media', visitors: Math.floor(Math.random() * 1500) + 1000, percentage: 18.7 },
        { source: 'Referral', visitors: Math.floor(Math.random() * 1000) + 500, percentage: 9.8 },
        { source: 'Email', visitors: Math.floor(Math.random() * 300) + 100, percentage: 2.3 }
      ],
      deviceTypes: [
        { type: 'Desktop', count: Math.floor(Math.random() * 4000) + 3000, percentage: 54.1 },
        { type: 'Mobile', count: Math.floor(Math.random() * 3000) + 2000, percentage: 36.4 },
        { type: 'Tablet', count: Math.floor(Math.random() * 1000) + 500, percentage: 9.5 }
      ],
      browsers: [
        { browser: 'Chrome', count: Math.floor(Math.random() * 4000) + 3000, percentage: 49.7 },
        { browser: 'Safari', count: Math.floor(Math.random() * 2000) + 1500, percentage: 27.5 },
        { browser: 'Firefox', count: Math.floor(Math.random() * 1500) + 1000, percentage: 15.0 },
        { browser: 'Edge', count: Math.floor(Math.random() * 500) + 300, percentage: 5.2 },
        { browser: 'Other', count: Math.floor(Math.random() * 300) + 100, percentage: 2.6 }
      ],
      countries: [
        { country: 'Germany', visitors: Math.floor(Math.random() * 6000) + 4000, percentage: 69.8 },
        { country: 'Austria', visitors: Math.floor(Math.random() * 1000) + 500, percentage: 9.8 },
        { country: 'Switzerland', visitors: Math.floor(Math.random() * 800) + 400, percentage: 7.9 },
        { country: 'France', visitors: Math.floor(Math.random() * 500) + 300, percentage: 5.2 },
        { country: 'USA', visitors: Math.floor(Math.random() * 400) + 200, percentage: 3.4 }
      ],
      userFlow: [
        { from: 'Homepage', to: 'Projects', users: Math.floor(Math.random() * 2000) + 1500 },
        { from: 'Projects', to: 'Project Detail', users: Math.floor(Math.random() * 1500) + 1000 },
        { from: 'Homepage', to: 'Services', users: Math.floor(Math.random() * 1200) + 800 },
        { from: 'Services', to: 'Contact', users: Math.floor(Math.random() * 800) + 400 }
      ],
      conversions: {
        contactForm: Math.floor(Math.random() * 200) + 100,
        newsletter: Math.floor(Math.random() * 150) + 50,
        projectViews: Math.floor(Math.random() * 2000) + 1500,
        downloads: Math.floor(Math.random() * 50) + 10
      },
      realtime: {
        activeUsers: Math.floor(Math.random() * 60) + 20,
        pageViewsLastHour: Math.floor(Math.random() * 300) + 100,
        currentPages: [
          { path: '/de/homepage', users: Math.floor(Math.random() * 15) + 5 },
          { path: '/de/projekte', users: Math.floor(Math.random() * 10) + 3 },
          { path: '/de/leistungen', users: Math.floor(Math.random() * 6) + 2 }
        ]
      }
    };
    
    res.json(analyticsData);
  } catch (error) {
    logger.error('Error fetching analytics dashboard:', error);
    res.status(500).json({ error: 'Failed to fetch analytics data' });
  }
});

// Get real-time analytics
router.get('/realtime', async (req, res) => {
  try {
    const realtimeData = {
      activeUsers: Math.floor(Math.random() * 100) + 20,
      pageViewsLastHour: Math.floor(Math.random() * 300) + 100,
      currentPages: [
        { path: '/de/homepage', users: Math.floor(Math.random() * 20) + 5 },
        { path: '/de/projekte', users: Math.floor(Math.random() * 15) + 3 },
        { path: '/de/leistungen', users: Math.floor(Math.random() * 10) + 2 },
        { path: '/de/kontakt', users: Math.floor(Math.random() * 8) + 1 }
      ]
    };
    
    res.json(realtimeData);
  } catch (error) {
    logger.error('Error fetching realtime analytics:', error);
    res.status(500).json({ error: 'Failed to fetch realtime data' });
  }
});

// Get analytics stats for admin panel
router.get('/stats', async (req, res) => {
  try {
    const { period = '7d' } = req.query;
    
    // Calculate date range
    let dateFilter = "datetime('now', '-7 days')";
    if (period === '30d') dateFilter = "datetime('now', '-30 days')";
    if (period === '24h') dateFilter = "datetime('now', '-1 day')";
    if (period === 'today') dateFilter = "date('now')";
    
    // Get visitor stats
    const visitorStats = await db.prepare(`
      SELECT 
        COUNT(DISTINCT visitor_id) as total_visitors,
        COUNT(DISTINCT CASE WHEN date(first_visit) >= date('now', '-${period === '30d' ? '30' : period === '7d' ? '7' : '1'} days') THEN visitor_id END) as new_visitors
      FROM visitors
      WHERE datetime(last_visit) >= ${dateFilter}
    `).get();

    // Get pageview stats
    const pageviewStats = await db.prepare(`
      SELECT 
        COUNT(*) as total_pageviews,
        COUNT(DISTINCT visitor_id) as unique_visitors
      FROM pageviews
      WHERE datetime(timestamp) >= ${dateFilter}
    `).get();

    // Get top pages
    const topPages = await db.prepare(`
      SELECT 
        path,
        COUNT(*) as views,
        COUNT(DISTINCT visitor_id) as unique_views
      FROM pageviews
      WHERE datetime(timestamp) >= ${dateFilter}
      GROUP BY path
      ORDER BY views DESC
      LIMIT 10
    `).all();

    // Get top referrers
    const topReferrers = await db.prepare(`
      SELECT 
        referrer,
        COUNT(*) as count
      FROM pageviews
      WHERE datetime(timestamp) >= ${dateFilter}
        AND referrer != ''
        AND referrer IS NOT NULL
      GROUP BY referrer
      ORDER BY count DESC
      LIMIT 10
    `).all();

    // Get browser stats
    const browserStats = await db.prepare(`
      SELECT 
        browser,
        COUNT(*) as count
      FROM visitors
      WHERE datetime(last_visit) >= ${dateFilter}
      GROUP BY browser
      ORDER BY count DESC
    `).all();

    // Get device stats
    const deviceStats = await db.prepare(`
      SELECT 
        device_type,
        COUNT(*) as count
      FROM visitors
      WHERE datetime(last_visit) >= ${dateFilter}
      GROUP BY device_type
      ORDER BY count DESC
    `).all();

    // Get hourly stats for chart
    const hourlyStats = await db.prepare(`
      SELECT 
        strftime('%H', timestamp) as hour,
        COUNT(*) as pageviews,
        COUNT(DISTINCT visitor_id) as visitors
      FROM pageviews
      WHERE datetime(timestamp) >= ${dateFilter}
      GROUP BY hour
      ORDER BY hour
    `).all();

    // Get recent visitors
    const recentVisitors = await db.prepare(`
      SELECT 
        visitor_id,
        first_visit,
        last_visit,
        total_visits,
        total_pageviews,
        landing_page,
        browser,
        device_type
      FROM visitors
      ORDER BY last_visit DESC
      LIMIT 20
    `).all();

    res.json({
      visitorStats,
      pageviewStats,
      topPages,
      topReferrers,
      browserStats,
      deviceStats,
      hourlyStats,
      recentVisitors,
      period
    });
  } catch (error) {
    logger.error('Failed to get analytics stats:', error);
    res.status(500).json({ error: 'Failed to get analytics stats' });
  }
});

// Get real-time stats
router.get('/realtime', async (req, res) => {
  try {
    // Get active visitors (last 5 minutes)
    const activeVisitors = await db.prepare(`
      SELECT COUNT(DISTINCT visitor_id) as count
      FROM pageviews
      WHERE datetime(timestamp) >= datetime('now', '-5 minutes')
    `).get();

    // Get current page views
    const currentPages = await db.prepare(`
      SELECT 
        path,
        COUNT(DISTINCT visitor_id) as visitors
      FROM pageviews
      WHERE datetime(timestamp) >= datetime('now', '-5 minutes')
      GROUP BY path
      ORDER BY visitors DESC
    `).all();

    res.json({
      activeVisitors: activeVisitors.count || 0,
      currentPages
    });
  } catch (error) {
    logger.error('Failed to get realtime stats:', error);
    res.status(500).json({ error: 'Failed to get realtime stats' });
  }
});

export default router;