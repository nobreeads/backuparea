export interface UserProgress {
  modulesCompleted: number[];
  puzzlesCompleted: string[];
  lastUpdated: string;
}

export interface UnlockedProducts {
  [productId: string]: {
    unlockedAt: string;
  };
}

export const storage = {
  getUsername: (): string | null => {
    return localStorage.getItem('mn_user');
  },

  setUsername: (username: string): void => {
    localStorage.setItem('mn_user', username);
  },

  clearUsername: (): void => {
    localStorage.removeItem('mn_user');
  },

  getProgress: (username: string): UserProgress => {
    const key = `mn_progress_${username}`;
    const data = localStorage.getItem(key);
    if (!data) {
      return {
        modulesCompleted: [],
        puzzlesCompleted: [],
        lastUpdated: new Date().toISOString()
      };
    }
    return JSON.parse(data);
  },

  setProgress: (username: string, progress: UserProgress): void => {
    const key = `mn_progress_${username}`;
    progress.lastUpdated = new Date().toISOString();
    localStorage.setItem(key, JSON.stringify(progress));
  },

  markModuleComplete: (username: string, moduleId: number): void => {
    const progress = storage.getProgress(username);
    if (!progress.modulesCompleted.includes(moduleId)) {
      progress.modulesCompleted.push(moduleId);
      storage.setProgress(username, progress);
    }
  },

  markPuzzleComplete: (username: string, puzzleId: string): void => {
    const progress = storage.getProgress(username);
    if (!progress.puzzlesCompleted.includes(puzzleId)) {
      progress.puzzlesCompleted.push(puzzleId);
      storage.setProgress(username, progress);
    }
  },

  getUnlockedProducts: (username: string): UnlockedProducts => {
    const key = `mn_unlocked_${username}`;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : {};
  },

  unlockProduct: (username: string, productId: string): void => {
    const unlocked = storage.getUnlockedProducts(username);
    unlocked[productId] = {
      unlockedAt: new Date().toISOString()
    };
    const key = `mn_unlocked_${username}`;
    localStorage.setItem(key, JSON.stringify(unlocked));
  },

  isProductUnlocked: (username: string, productId: string): boolean => {
    const unlocked = storage.getUnlockedProducts(username);
    return !!unlocked[productId];
  },

  clearAllUserData: (username: string): void => {
    localStorage.removeItem(`mn_progress_${username}`);
    localStorage.removeItem(`mn_unlocked_${username}`);
  },

  logout: (): void => {
    const username = storage.getUsername();
    if (username) {
      storage.clearUsername();
    }
  }
};
