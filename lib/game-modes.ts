// lib/game-modes.ts
// Difficulty levels and map variations

export type Difficulty = "easy" | "normal" | "hard";
export type MapType = "map1" | "map2" | "map3";

export interface DifficultySettings {
  name: string;
  creepSpeedMultiplier: number;
  creepHpMultiplier: number;
  goldMultiplier: number;
  startingGold: number;
  startingLives: number;
}

export interface MapSettings {
  name: string;
  displayName: string;
  path: Array<{ col: number; row: number }>;
  description: string;
}

export const DIFFICULTY_SETTINGS: Record<Difficulty, DifficultySettings> = {
  easy: {
    name: "Easy",
    creepSpeedMultiplier: 0.7,
    creepHpMultiplier: 0.8,
    goldMultiplier: 1.5,
    startingGold: 300,
    startingLives: 30,
  },
  normal: {
    name: "Normal",
    creepSpeedMultiplier: 1.0,
    creepHpMultiplier: 1.0,
    goldMultiplier: 1.0,
    startingGold: 200,
    startingLives: 20,
  },
  hard: {
    name: "Hard",
    creepSpeedMultiplier: 1.3,
    creepHpMultiplier: 1.2,
    goldMultiplier: 0.8,
    startingGold: 150,
    startingLives: 15,
  },
};

// Map paths (entry and exit are fixed, these are waypoints)
export const MAP_SETTINGS: Record<MapType, MapSettings> = {
  map1: {
    name: "map1",
    displayName: "Classic Path",
    path: [
      { col: 1, row: 7 },
      { col: 5, row: 7 },
      { col: 5, row: 3 },
      { col: 10, row: 3 },
      { col: 10, row: 11 },
      { col: 15, row: 11 },
      { col: 15, row: 5 },
      { col: 22, row: 8 },
    ],
    description: "A winding path with multiple turns",
  },
  map2: {
    name: "map2",
    displayName: "Spiral Path",
    path: [
      { col: 1, row: 7 },
      { col: 6, row: 7 },
      { col: 6, row: 2 },
      { col: 11, row: 2 },
      { col: 11, row: 12 },
      { col: 17, row: 12 },
      { col: 17, row: 4 },
      { col: 22, row: 8 },
    ],
    description: "A spiral pattern with tight corners",
  },
  map3: {
    name: "map3",
    displayName: "Zigzag Path",
    path: [
      { col: 1, row: 7 },
      { col: 4, row: 7 },
      { col: 4, row: 3 },
      { col: 7, row: 3 },
      { col: 7, row: 11 },
      { col: 10, row: 11 },
      { col: 10, row: 5 },
      { col: 13, row: 5 },
      { col: 13, row: 9 },
      { col: 16, row: 9 },
      { col: 16, row: 6 },
      { col: 22, row: 8 },
    ],
    description: "A challenging zigzag with many turns",
  },
};

export class GameModeManager {
  private difficulty: Difficulty = "normal";
  private map: MapType = "map1";

  setDifficulty(difficulty: Difficulty) {
    this.difficulty = difficulty;
  }

  getDifficulty(): Difficulty {
    return this.difficulty;
  }

  getDifficultySettings(): DifficultySettings {
    return DIFFICULTY_SETTINGS[this.difficulty];
  }

  setMap(map: MapType) {
    this.map = map;
  }

  getMap(): MapType {
    return this.map;
  }

  getMapSettings(): MapSettings {
    return MAP_SETTINGS[this.map];
  }

  /**
   * Apply difficulty modifiers to creep stats
   */
  applyDifficultyModifiers(baseSpeed: number, baseHp: number): { speed: number; hp: number } {
    const settings = this.getDifficultySettings();
    return {
      speed: baseSpeed * settings.creepSpeedMultiplier,
      hp: baseHp * settings.creepHpMultiplier,
    };
  }

  /**
   * Apply difficulty modifiers to gold rewards
   */
  applyGoldModifier(baseGold: number): number {
    const settings = this.getDifficultySettings();
    return Math.floor(baseGold * settings.goldMultiplier);
  }
}

export const gameModeManager = new GameModeManager();
