import { defineStore } from 'pinia';

export const BrawlStore = defineStore('BrawlStore', {
  state: () => ({
    brawlerToGuess: {},
    attemptCount: 0,
    listBrawlerAttempt: [] as any[],
    originalList: [] as any[],
    filteredList: [] as any[],
    hintSelected: ''
  }),
  getters: {
    
  },
  actions: {
    addAttempt() {
      this.attemptCount++
    }
  },
});
