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
    
    const dateFilter = `datetime('now', '-${days} days')`;
    const today = new Date();
    
    // Get daily page views from actual data
    const pageViewsData = await db.prepare(`
      SELECT 
        DATE(timestamp) as date,
        COUNT(*) as views,
        COUNT(DISTINCT visitor_id) as visitors
      FROM pageviews
      WHERE datetime(timestamp) >= ${dateFilter}
      GROUP BY DATE(timestamp)
      ORDER BY date DESC
    `).all();
    
    // Get sessions data
    const sessionsData = await db.prepare(`
      SELECT 
        DATE(session_start) as date,
        COUNT(*) as sessions
      FROM analytics_sessions
      WHERE datetime(session_start) >= ${dateFilter}
      GROUP BY DATE(session_start)
    `).all();
    
    // Merge pageviews and sessions data
    const pageViewsMap = new Map();
    pageViewsData.forEach(pv => {
      pageViewsMap.set(pv.date, { ...pv, sessions: 0 });
    });
    sessionsData.forEach(s => {
      if (pageViewsMap.has(s.date)) {
        pageViewsMap.get(s.date).sessions = s.sessions;
      } else {
        pageViewsMap.set(s.date, {
          date: s.date,
          views: 0,
          visitors: 0,
          sessions: s.sessions
        });
      }
    });
    
    // Fill in missing dates with zeros
    const pageViews = [];
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      if (pageViewsMap.has(dateStr)) {
        pageViews.push(pageViewsMap.get(dateStr));
      } else {
        pageViews.push({
          date: dateStr,
          views: 0,
          visitors: 0,
          sessions: 0
        });
      }
    }
    
    // Get overview stats from actual data
    const visitorStats = await db.prepare(`
      SELECT 
        COUNT(DISTINCT visitor_id) as totalVisitors,
        COUNT(DISTINCT CASE 
          WHEN date(first_visit) >= date('now', '-${days} days') 
          THEN visitor_id 
        END) as newVisitors
      FROM visitors
      WHERE datetime(last_visit) >= ${dateFilter}
    `).get() || { totalVisitors: 0, newVisitors: 0 };
    
    const pageviewStats = await db.prepare(`
      SELECT COUNT(*) as totalPageViews
      FROM pageviews
      WHERE datetime(timestamp) >= ${dateFilter}
    `).get() || { totalPageViews: 0 };
    
    const sessionStats = await db.prepare(`
      SELECT 
        AVG(duration) as avgSessionDuration,
        COUNT(CASE WHEN page_count = 1 THEN 1 END) * 100.0 / COUNT(*) as bounceRate
      FROM analytics_sessions
      WHERE datetime(session_start) >= ${dateFilter}
        AND session_end IS NOT NULL
    `).get() || { avgSessionDuration: 0, bounceRate: 0 };
    
    const eventStats = await db.prepare(`
      SELECT COUNT(CASE WHEN event_name IN ('contact_form_submit', 'newsletter_signup', 'download') THEN 1 END) as conversions
      FROM analytics_events
      WHERE datetime(timestamp) >= ${dateFilter}
    `).get() || { conversions: 0 };
    
    const returningVisitors = visitorStats.totalVisitors - visitorStats.newVisitors;
    const conversionRate = visitorStats.totalVisitors > 0 
      ? ((eventStats.conversions / visitorStats.totalVisitors) * 100).toFixed(1)
      : '0.0';
    
    const analyticsData = {
      overview: {
        totalVisitors: visitorStats.totalVisitors || 0,
        totalPageViews: pageviewStats.totalPageViews || 0,
        avgSessionDuration: Math.round(sessionStats.avgSessionDuration || 0),
        bounceRate: Math.round(sessionStats.bounceRate || 0),
        newVsReturning: {
          new: visitorStats.newVisitors || 0,
          returning: returningVisitors || 0
        },
        conversionRate: conversionRate,
        totalConversions: eventStats.conversions || 0
      },
      pageViews: pageViews,
      
      // Get actual top pages
      topPages: (await db.prepare(`
        SELECT 
          path,
          COUNT(*) as views,
          AVG(duration) as avgTime,
          0 as bounceRate
        FROM pageviews
        WHERE datetime(timestamp) >= ${dateFilter}
        GROUP BY path
        ORDER BY views DESC
        LIMIT 10
      `).all() || []).map(page => ({
        ...page,
        avgTime: Math.round(page.avgTime || 0),
        bounceRate: Math.round(page.bounceRate || 0)
      })),
      // Get traffic sources from referrer data
      trafficSources: await (async () => {
        const sources = await db.prepare(`
          SELECT 
            CASE 
              WHEN referrer IS NULL OR referrer = '' THEN 'Direct'
              WHEN referrer LIKE '%google%' OR referrer LIKE '%bing%' OR referrer LIKE '%yahoo%' THEN 'Organic Search'
              WHEN referrer LIKE '%facebook%' OR referrer LIKE '%twitter%' OR referrer LIKE '%linkedin%' OR referrer LIKE '%instagram%' THEN 'Social Media'
              WHEN referrer LIKE '%mail%' OR referrer LIKE '%outlook%' THEN 'Email'
              ELSE 'Referral'
            END as source,
            COUNT(DISTINCT visitor_id) as visitors
          FROM visitors
          WHERE datetime(last_visit) >= ${dateFilter}
          GROUP BY source
          ORDER BY visitors DESC
        `).all() || [];
        
        const total = sources.reduce((sum, s) => sum + s.visitors, 0);
        return sources.map(s => ({
          ...s,
          percentage: total > 0 ? ((s.visitors / total) * 100).toFixed(1) : 0
        }));
      })(),
      // Get device types from actual data
      deviceTypes: await (async () => {
        const devices = await db.prepare(`
          SELECT 
            device_type as type,
            COUNT(*) as count
          FROM visitors
          WHERE datetime(last_visit) >= ${dateFilter}
            AND device_type IS NOT NULL
          GROUP BY device_type
          ORDER BY count DESC
        `).all() || [];
        
        const total = devices.reduce((sum, d) => sum + d.count, 0);
        return devices.map(d => ({
          ...d,
          percentage: total > 0 ? ((d.count / total) * 100).toFixed(1) : 0
        }));
      })(),
      // Get browser stats from actual data
      browsers: await (async () => {
        const browsers = await db.prepare(`
          SELECT 
            browser,
            COUNT(*) as count
          FROM visitors
          WHERE datetime(last_visit) >= ${dateFilter}
            AND browser IS NOT NULL
          GROUP BY browser
          ORDER BY count DESC
          LIMIT 5
        `).all() || [];
        
        const total = browsers.reduce((sum, b) => sum + b.count, 0);
        return browsers.map(b => ({
          ...b,
          percentage: total > 0 ? ((b.count / total) * 100).toFixed(1) : 0
        }));
      })(),
      // Get country data (using mock for now as we don't have country data)
      countries: [
        { country: 'Germany', visitors: Math.floor(visitorStats.totalVisitors * 0.7), percentage: 70.0 },
        { country: 'Austria', visitors: Math.floor(visitorStats.totalVisitors * 0.1), percentage: 10.0 },
        { country: 'Switzerland', visitors: Math.floor(visitorStats.totalVisitors * 0.08), percentage: 8.0 },
        { country: 'France', visitors: Math.floor(visitorStats.totalVisitors * 0.05), percentage: 5.0 },
        { country: 'USA', visitors: Math.floor(visitorStats.totalVisitors * 0.03), percentage: 3.0 }
      ],
      // Get user flow from pageview sequences
      userFlow: await (async () => {
        const flows = await db.prepare(`
          SELECT 
            p1.path as from_path,
            p2.path as to_path,
            COUNT(DISTINCT p1.visitor_id) as users
          FROM pageviews p1
          JOIN pageviews p2 ON p1.visitor_id = p2.visitor_id 
            AND p2.timestamp > p1.timestamp
            AND p2.timestamp < datetime(p1.timestamp, '+30 minutes')
          WHERE datetime(p1.timestamp) >= ${dateFilter}
          GROUP BY p1.path, p2.path
          ORDER BY users DESC
          LIMIT 10
        `).all() || [];
        
        return flows.map(f => ({
          from: f.from_path?.split('/').pop() || 'Unknown',
          to: f.to_path?.split('/').pop() || 'Unknown',
          users: f.users || 0
        }));
      })(),
      // Get conversion data from events
      conversions: await (async () => {
        const conversionData = await db.prepare(`
          SELECT 
            event_name,
            COUNT(*) as count
          FROM analytics_events
          WHERE datetime(timestamp) >= ${dateFilter}
            AND event_name IN ('contact_form_submit', 'newsletter_signup', 'project_view', 'download')
          GROUP BY event_name
        `).all() || [];
        
        const conversions = {
          contactForm: 0,
          newsletter: 0,
          projectViews: 0,
          downloads: 0
        };
        
        conversionData.forEach(c => {
          switch(c.event_name) {
            case 'contact_form_submit': conversions.contactForm = c.count; break;
            case 'newsletter_signup': conversions.newsletter = c.count; break;
            case 'project_view': conversions.projectViews = c.count; break;
            case 'download': conversions.downloads = c.count; break;
          }
        });
        
        return conversions;
      })(),
      // Get real-time data
      realtime: await (async () => {
        const activeUsers = await db.prepare(`
          SELECT COUNT(DISTINCT visitor_id) as count
          FROM pageviews
          WHERE datetime(timestamp) >= datetime('now', '-5 minutes')
        `).get()?.count || 0;
        
        const pageViewsLastHour = await db.prepare(`
          SELECT COUNT(*) as count
          FROM pageviews
          WHERE datetime(timestamp) >= datetime('now', '-1 hour')
        `).get()?.count || 0;
        
        const currentPages = await db.prepare(`
          SELECT 
            path,
            COUNT(DISTINCT visitor_id) as users
          FROM pageviews
          WHERE datetime(timestamp) >= datetime('now', '-5 minutes')
          GROUP BY path
          ORDER BY users DESC
          LIMIT 5
        `).all() || [];
        
        return {
          activeUsers,
          pageViewsLastHour,
          currentPages
        };
      })()
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
    // Get active visitors (last 5 minutes)
    const activeUsers = await db.prepare(`
      SELECT COUNT(DISTINCT visitor_id) as count
      FROM pageviews
      WHERE datetime(timestamp) >= datetime('now', '-5 minutes')
    `).get()?.count || 0;
    
    // Get page views in last hour
    const pageViewsLastHour = await db.prepare(`
      SELECT COUNT(*) as count
      FROM pageviews
      WHERE datetime(timestamp) >= datetime('now', '-1 hour')
    `).get()?.count || 0;
    
    // Get current pages being viewed
    const currentPages = await db.prepare(`
      SELECT 
        path,
        COUNT(DISTINCT visitor_id) as users
      FROM pageviews
      WHERE datetime(timestamp) >= datetime('now', '-5 minutes')
      GROUP BY path
      ORDER BY users DESC
      LIMIT 10
    `).all() || [];
    
    // Get recent activity feed
    const recentPageviews = await db.prepare(`
      SELECT 
        p.path,
        p.title,
        p.timestamp,
        p.visitor_id,
        v.country,
        v.city
      FROM pageviews p
      LEFT JOIN visitors v ON p.visitor_id = v.visitor_id
      WHERE datetime(p.timestamp) >= datetime('now', '-5 minutes')
      ORDER BY p.timestamp DESC
      LIMIT 20
    `).all() || [];
    
    const recentEvents = await db.prepare(`
      SELECT 
        e.event_name,
        e.path,
        e.timestamp,
        e.visitor_id,
        v.country,
        v.city
      FROM analytics_events e
      LEFT JOIN visitors v ON e.visitor_id = v.visitor_id
      WHERE datetime(e.timestamp) >= datetime('now', '-5 minutes')
      ORDER BY e.timestamp DESC
      LIMIT 20
    `).all() || [];
    
    // Combine and sort activities
    const activities = [];
    
    recentPageviews.forEach(pv => {
      activities.push({
        type: 'pageview',
        action: 'Page view',
        path: pv.path || 'Unknown',
        timestamp: pv.timestamp,
        location: pv.city && pv.country ? `${pv.city}, ${pv.country}` : 'Unknown Location',
        visitor_id: pv.visitor_id
      });
    });
    
    recentEvents.forEach(ev => {
      let action = 'Event';
      switch(ev.event_name) {
        case 'contact_form_submit': action = 'Form submission'; break;
        case 'newsletter_signup': action = 'Newsletter signup'; break;
        case 'project_view': action = 'Project view'; break;
        case 'download': action = 'Download'; break;
        default: action = ev.event_name;
      }
      activities.push({
        type: 'event',
        action: action,
        path: ev.path || 'Unknown',
        timestamp: ev.timestamp,
        location: ev.city && ev.country ? `${ev.city}, ${ev.country}` : 'Unknown Location',
        visitor_id: ev.visitor_id
      });
    });
    
    // Sort by timestamp descending and limit
    activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    const liveActivityFeed = activities.slice(0, 20);
    
    const realtimeData = {
      activeUsers,
      pageViewsLastHour,
      currentPages,
      liveActivityFeed
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


export default router;