// src/utils/cache.js
export const DataCache = {
    async getPlayer(id) {
      const key = `player-${id}`;
      try {
        const cached = localStorage.getItem(key);
        if (cached) {
          return JSON.parse(cached);
        }
        return null;
      } catch (error) {
        console.error('Error accessing cache:', error);
        return null;
      }
    },
  
    async setPlayer(id, data) {
      const key = `player-${id}`;
      try {
        localStorage.setItem(key, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving to cache:', error);
      }
    }
  };