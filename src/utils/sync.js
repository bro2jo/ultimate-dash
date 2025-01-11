// src/utils/sync.js
export const SyncManager = {
    async queueSync(action, data) {
      const syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
      syncQueue.push({ action, data, timestamp: Date.now() });
      localStorage.setItem('syncQueue', JSON.stringify(syncQueue));
    },
  
    async processSyncQueue() {
      if (!navigator.onLine) return;
  
      const syncQueue = JSON.parse(localStorage.getItem('syncQueue') || '[]');
      if (syncQueue.length === 0) return;
  
      for (const item of syncQueue) {
        try {
          // Process sync item
          await this.processItem(item);
          // Remove from queue if successful
          const newQueue = syncQueue.filter(i => i !== item);
          localStorage.setItem('syncQueue', JSON.stringify(newQueue));
        } catch (error) {
          console.error('Sync failed for item:', item, error);
        }
      }
    }
  };