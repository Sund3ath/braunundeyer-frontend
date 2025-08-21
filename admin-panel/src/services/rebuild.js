// Rebuild service for triggering Next.js rebuilds
import { API_BASE_URL } from '../config/api';

class RebuildService {
  constructor() {
    this.isRebuildEnabled = true; // Can be toggled via settings
    this.rebuildDelay = 5000; // 5 seconds delay to batch multiple changes
    this.pendingRebuild = null;
  }

  // Get rebuild status
  async getStatus() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/rebuild/status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get rebuild status');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting rebuild status:', error);
      return null;
    }
  }

  // Trigger manual rebuild
  async triggerManual(reason = 'Manual trigger from admin panel') {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/rebuild/trigger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ reason })
      });
      
      if (!response.ok) {
        throw new Error('Failed to trigger rebuild');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error triggering rebuild:', error);
      throw error;
    }
  }

  // Queue automatic rebuild on content change
  queueAutoRebuild(table, action = 'update') {
    if (!this.isRebuildEnabled) {
      return;
    }

    // Clear existing pending rebuild
    if (this.pendingRebuild) {
      clearTimeout(this.pendingRebuild);
    }

    // Queue new rebuild with delay
    this.pendingRebuild = setTimeout(async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/rebuild/auto`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ table, action })
        });
        
        if (response.ok) {
          const result = await response.json();
          console.log('Auto-rebuild queued:', result);
        }
      } catch (error) {
        console.error('Error queuing auto-rebuild:', error);
      }
    }, this.rebuildDelay);
  }

  // Get rebuild history
  async getHistory() {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/rebuild/history`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to get rebuild history');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting rebuild history:', error);
      return { history: [], total: 0 };
    }
  }

  // Check if table should trigger rebuild
  shouldTriggerRebuild(table) {
    const triggerTables = ['projects', 'hero_slides', 'project_translations', 'homepage_config'];
    return triggerTables.includes(table);
  }
}

export default new RebuildService();