import express from 'express';
import { exec } from 'child_process';
import { authenticate, authorize } from '../middleware/auth.middleware.js';
import logger from '../utils/logger.js';
import fs from 'fs/promises';
import path from 'path';

const router = express.Router();

// Track rebuild status
let rebuildInProgress = false;
let lastRebuildTime = 0;
const MIN_REBUILD_INTERVAL = 60000; // Minimum 1 minute between rebuilds

// Queue for rebuild requests
const rebuildQueue = [];
let queueProcessor = null;

// Process rebuild queue
async function processRebuildQueue() {
  if (rebuildQueue.length === 0) {
    queueProcessor = null;
    return;
  }

  const { reason, triggeredBy, res } = rebuildQueue.shift();
  
  try {
    const result = await triggerRebuild(reason, triggeredBy);
    if (res && !res.headersSent) {
      res.json(result);
    }
  } catch (error) {
    if (res && !res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
  
  // Process next item in queue after a delay
  setTimeout(() => processRebuildQueue(), 5000);
}

// Trigger rebuild function
async function triggerRebuild(reason, triggeredBy) {
  const now = Date.now();
  const timeSinceLastRebuild = now - lastRebuildTime;
  
  if (rebuildInProgress) {
    logger.info('Rebuild already in progress, queuing request');
    return {
      success: false,
      message: 'Rebuild already in progress',
      queued: true
    };
  }
  
  if (timeSinceLastRebuild < MIN_REBUILD_INTERVAL) {
    const waitTime = Math.round((MIN_REBUILD_INTERVAL - timeSinceLastRebuild) / 1000);
    logger.info(`Rebuild requested too soon, need to wait ${waitTime}s`);
    return {
      success: false,
      message: `Please wait ${waitTime} seconds before next rebuild`,
      nextAvailable: new Date(lastRebuildTime + MIN_REBUILD_INTERVAL)
    };
  }
  
  rebuildInProgress = true;
  lastRebuildTime = now;
  
  return new Promise((resolve) => {
    logger.info(`Starting Next.js rebuild - Reason: ${reason}, Triggered by: ${triggeredBy}`);
    
    const command = 'cd /home/braunundeyer-frontend && docker compose -f docker-compose.prod-nginx.yml up -d --build nextjs-app';
    
    exec(command, { maxBuffer: 10 * 1024 * 1024 }, async (error, stdout, stderr) => {
      rebuildInProgress = false;
      
      if (error) {
        logger.error(`Rebuild failed: ${error.message}`);
        if (stderr) logger.error(`Stderr: ${stderr}`);
        
        resolve({
          success: false,
          error: error.message,
          stderr: stderr
        });
      } else {
        logger.info('Next.js rebuild completed successfully');
        
        // Log rebuild history
        try {
          const historyPath = '/home/braunundeyer-frontend/logs/rebuild-history.json';
          let history = [];
          
          try {
            const data = await fs.readFile(historyPath, 'utf8');
            history = JSON.parse(data);
          } catch (e) {
            // File doesn't exist yet
          }
          
          history.push({
            timestamp: new Date().toISOString(),
            reason,
            triggeredBy,
            success: true
          });
          
          // Keep only last 100 entries
          if (history.length > 100) {
            history = history.slice(-100);
          }
          
          await fs.writeFile(historyPath, JSON.stringify(history, null, 2));
        } catch (e) {
          logger.error(`Failed to save rebuild history: ${e.message}`);
        }
        
        resolve({
          success: true,
          message: 'Rebuild completed successfully',
          timestamp: new Date().toISOString()
        });
      }
    });
  });
}

// Manual rebuild endpoint
router.post('/trigger',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    const { reason = 'Manual trigger' } = req.body;
    const triggeredBy = req.user.email;
    
    try {
      const result = await triggerRebuild(reason, triggeredBy);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

// Automatic rebuild on content changes
router.post('/auto',
  authenticate,
  authorize('admin', 'editor'),
  async (req, res) => {
    const { table, action = 'update' } = req.body;
    const triggeredBy = `${req.user.email} (${action} on ${table})`;
    
    // Only trigger rebuild for specific tables
    const triggerTables = ['projects', 'hero_slides', 'project_translations', 'homepage_config'];
    
    if (!triggerTables.includes(table)) {
      return res.json({
        success: false,
        message: `Table ${table} does not trigger rebuilds`
      });
    }
    
    // Queue the rebuild request
    rebuildQueue.push({
      reason: `Content ${action} in ${table}`,
      triggeredBy,
      res
    });
    
    // Start queue processor if not already running
    if (!queueProcessor) {
      queueProcessor = setTimeout(() => processRebuildQueue(), 1000);
    }
  }
);

// Get rebuild status
router.get('/status',
  authenticate,
  async (req, res) => {
    const canRebuild = !rebuildInProgress && 
                       (Date.now() - lastRebuildTime) >= MIN_REBUILD_INTERVAL;
    
    res.json({
      rebuildInProgress,
      lastRebuildTime: lastRebuildTime ? new Date(lastRebuildTime).toISOString() : null,
      canRebuild,
      queueLength: rebuildQueue.length,
      nextAvailable: new Date(lastRebuildTime + MIN_REBUILD_INTERVAL).toISOString()
    });
  }
);

// Get rebuild history
router.get('/history',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    try {
      const historyPath = '/home/braunundeyer-frontend/logs/rebuild-history.json';
      const data = await fs.readFile(historyPath, 'utf8');
      const history = JSON.parse(data);
      
      res.json({
        history: history.slice(-20), // Last 20 rebuilds
        total: history.length
      });
    } catch (error) {
      res.json({ history: [], total: 0 });
    }
  }
);

export default router;