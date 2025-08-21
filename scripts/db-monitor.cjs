#!/usr/bin/env node

const fs = require('fs');
const crypto = require('crypto');
const { exec } = require('child_process');
const path = require('path');

// Configuration
const DB_PATH = '/home/braunundeyer-frontend/backend/database.sqlite';
const CHECK_INTERVAL = 10000; // Check every 10 seconds
const DOCKER_COMPOSE_FILE = '/home/braunundeyer-frontend/docker-compose.prod-nginx.yml';
const LOG_FILE = '/home/braunundeyer-frontend/logs/db-monitor.log';

// Tables to monitor for changes
const MONITORED_TABLES = [
  'projects',
  'project_translations'
];

// State file to track last known state
const STATE_FILE = '/home/braunundeyer-frontend/.db-monitor-state.json';

// Ensure log directory exists
const logDir = path.dirname(LOG_FILE);
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

// Logging function
function log(message, level = 'INFO') {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] [${level}] ${message}\n`;
  
  console.log(logMessage.trim());
  fs.appendFileSync(LOG_FILE, logMessage);
}

// Load saved state
function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    }
  } catch (error) {
    log(`Error loading state: ${error.message}`, 'ERROR');
  }
  return {};
}

// Save current state
function saveState(state) {
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  } catch (error) {
    log(`Error saving state: ${error.message}`, 'ERROR');
  }
}

// Get database checksum for monitored tables
function getDatabaseChecksum() {
  return new Promise((resolve, reject) => {
    const sqlite3 = require('sqlite3').verbose();
    const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READONLY);
    
    const checksums = {};
    let completed = 0;
    
    MONITORED_TABLES.forEach(table => {
      // Query to get all data from the table
      const query = `SELECT * FROM ${table} ORDER BY id`;
      
      db.all(query, [], (err, rows) => {
        if (err) {
          log(`Error querying ${table}: ${err.message}`, 'WARN');
          checksums[table] = null;
        } else {
          // Create checksum that includes both data and row count
          // This ensures deletions are also detected
          const dataString = JSON.stringify({
            count: rows.length,
            data: rows
          });
          checksums[table] = crypto.createHash('md5').update(dataString).digest('hex');
        }
        
        completed++;
        if (completed === MONITORED_TABLES.length) {
          db.close();
          resolve(checksums);
        }
      });
    });
  });
}

// Check if specific tables have changed
function detectChanges(oldChecksums, newChecksums) {
  const changes = [];
  
  for (const table of MONITORED_TABLES) {
    if (oldChecksums[table] !== newChecksums[table]) {
      changes.push(table);
    }
  }
  
  return changes;
}

// Rebuild Next.js container
function rebuildNextJs() {
  return new Promise((resolve, reject) => {
    log('Starting Next.js rebuild...', 'INFO');
    
    const command = `cd /home/braunundeyer-frontend && docker compose -f docker-compose.prod-nginx.yml up -d --build nextjs-app`;
    
    exec(command, { maxBuffer: 10 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        log(`Rebuild failed: ${error.message}`, 'ERROR');
        if (stderr) log(`Stderr: ${stderr}`, 'ERROR');
        reject(error);
      } else {
        log('Next.js rebuild completed successfully', 'INFO');
        if (stdout) log(`Build output: ${stdout.substring(0, 500)}...`, 'DEBUG');
        resolve();
      }
    });
  });
}

// Check if rebuild is already in progress
let rebuildInProgress = false;
let lastRebuildTime = 0;
const MIN_REBUILD_INTERVAL = 60000; // Minimum 1 minute between rebuilds

// Main monitoring loop
async function monitor() {
  try {
    const currentChecksums = await getDatabaseChecksum();
    const savedState = loadState();
    
    if (savedState.checksums) {
      const changes = detectChanges(savedState.checksums, currentChecksums);
      
      if (changes.length > 0) {
        log(`Database changes detected in tables: ${changes.join(', ')}`, 'INFO');
        
        const now = Date.now();
        const timeSinceLastRebuild = now - lastRebuildTime;
        
        if (!rebuildInProgress && timeSinceLastRebuild >= MIN_REBUILD_INTERVAL) {
          rebuildInProgress = true;
          lastRebuildTime = now;
          
          try {
            await rebuildNextJs();
            saveState({ checksums: currentChecksums, lastRebuild: new Date().toISOString() });
          } catch (error) {
            log(`Rebuild error: ${error.message}`, 'ERROR');
          } finally {
            rebuildInProgress = false;
          }
        } else if (rebuildInProgress) {
          log('Rebuild already in progress, skipping...', 'INFO');
        } else {
          log(`Skipping rebuild - too soon since last rebuild (${Math.round(timeSinceLastRebuild/1000)}s ago)`, 'INFO');
        }
      }
    } else {
      // First run - just save the initial state
      log('Initial state saved', 'INFO');
      saveState({ checksums: currentChecksums, lastRebuild: null });
    }
  } catch (error) {
    log(`Monitor error: ${error.message}`, 'ERROR');
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  log('Monitoring stopped by user', 'INFO');
  process.exit(0);
});

process.on('SIGTERM', () => {
  log('Monitoring stopped by system', 'INFO');
  process.exit(0);
});

// Install sqlite3 if not available
function checkDependencies() {
  try {
    require('sqlite3');
    return true;
  } catch (e) {
    log('Installing required dependencies...', 'INFO');
    exec('cd /home/braunundeyer-frontend && npm install sqlite3', (error) => {
      if (error) {
        log(`Failed to install sqlite3: ${error.message}`, 'ERROR');
        process.exit(1);
      } else {
        log('Dependencies installed successfully', 'INFO');
        startMonitoring();
      }
    });
    return false;
  }
}

// Start monitoring
function startMonitoring() {
  log('Database monitoring started', 'INFO');
  log(`Monitoring tables: ${MONITORED_TABLES.join(', ')}`, 'INFO');
  log(`Check interval: ${CHECK_INTERVAL/1000} seconds`, 'INFO');
  
  // Initial check
  monitor();
  
  // Set up interval
  setInterval(monitor, CHECK_INTERVAL);
}

// Entry point
if (checkDependencies()) {
  startMonitoring();
}