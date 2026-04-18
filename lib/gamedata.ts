// lib/gamedata.ts
// Shared game configuration: towers, creeps, waves, grid

export const GRID_COLS = 22;
export const GRID_ROWS = 14;
export const CELL_SIZE = 8; // pixels per cell
export const BASE_Y = 0.5;

export const ENTRY = { col: 1, row: 7 };
export const EXIT = { col: GRID_COLS, row: 8 };

export const START_GOLD = 200;
export const START_LIVES = 20;
export const WAVE_BONUS = (wave: number) => 10 + wave * 3;

// Tower definitions
export interface TowerDef {
  name: string;
  cost: number;
  sellFrac: number;
  damage: number;
  range: number;
  fireRate: number;
  projectile: string;
  aoe: number;
  slowAmount: number;
  slowDur: number;
  color: string;
  emitColor: string;
  description: string;
}

export const TOWER_DEFS: Record<string, TowerDef> = {
  arrow: {
    name: "Arrow",
    cost: 50,
    sellFrac: 0.5,
    damage: 12,
    range: 3.5,
    fireRate: 0.58,
    projectile: "arrow",
    aoe: 0,
    slowAmount: 0,
    slowDur: 0,
    color: "#4ADE80",
    emitColor: "#4ADE80",
    description: "Fast and balanced.",
  },
  cannon: {
    name: "Cannon",
    cost: 100,
    sellFrac: 0.5,
    damage: 55,
    range: 2.5,
    fireRate: 0.25,
    projectile: "cannon",
    aoe: 1.2,
    slowAmount: 0,
    slowDur: 0,
    color: "#FB9238",
    emitColor: "#FB9238",
    description: "Area damage. Slow.",
  },
  sniper: {
    name: "Sniper",
    cost: 150,
    sellFrac: 0.5,
    damage: 110,
    range: 7.0,
    fireRate: 0.17,
    projectile: "sniper",
    aoe: 0,
    slowAmount: 0,
    slowDur: 0,
    color: "#38BDF8",
    emitColor: "#38BDF8",
    description: "Extreme range. Single target.",
  },
  freeze: {
    name: "Freeze",
    cost: 120,
    sellFrac: 0.5,
    damage: 5,
    range: 2.5,
    fireRate: 0.4,
    projectile: "freeze",
    aoe: 0,
    slowAmount: 0.45,
    slowDur: 1.8,
    color: "#C084FC",
    emitColor: "#C084FC",
    description: "Slows enemies significantly.",
  },
  bomb: {
    name: "Bomb",
    cost: 200,
    sellFrac: 0.5,
    damage: 80,
    range: 3.0,
    fireRate: 0.18,
    projectile: "bomb",
    aoe: 2.0,
    slowAmount: 0,
    slowDur: 0,
    color: "#EF4444",
    emitColor: "#EF4444",
    description: "Massive explosion. Expensive.",
  },
};

// Creep definitions
export interface CreepDef {
  name: string;
  baseHp: number;
  baseSpeed: number;
  size: number;
  color: string;
  isFlying: boolean;
  armor: number;
  gold: number;
  damage: number;
  isBoss?: boolean;
}

export const CREEP_DEFS: Record<string, CreepDef> = {
  goblin: {
    name: "Goblin",
    baseHp: 50,
    baseSpeed: 14,
    size: 2,
    color: "#84CC16",
    isFlying: false,
    armor: 0,
    gold: 4,
    damage: 1,
  },
  wolf: {
    name: "Wolf",
    baseHp: 30,
    baseSpeed: 26,
    size: 2.5,
    color: "#F97316",
    isFlying: false,
    armor: 0,
    gold: 6,
    damage: 1,
  },
  ogre: {
    name: "Ogre",
    baseHp: 160,
    baseSpeed: 7,
    size: 4,
    color: "#6366F1",
    isFlying: false,
    armor: 0.15,
    gold: 10,
    damage: 2,
  },
  gargoyle: {
    name: "Gargoyle",
    baseHp: 40,
    baseSpeed: 18,
    size: 3,
    color: "#22D3EE",
    isFlying: true,
    armor: 0,
    gold: 8,
    damage: 1,
  },
  demon: {
    name: "Demon",
    baseHp: 500,
    baseSpeed: 5,
    size: 5,
    color: "#DC2626",
    isFlying: false,
    armor: 0.25,
    gold: 40,
    damage: 5,
    isBoss: true,
  },
};

// Wave definitions
export interface WaveSpawn {
  type: string;
  count: number;
  interval: number;
  hpScale: number;
}

export function getWaveDefinition(waveNum: number): WaveSpawn[] {
  const isBoss = waveNum % 5 === 0;
  const hpMult = 1 + (waveNum - 1) * 0.3;
  const def: WaveSpawn[] = [];

  if (isBoss) {
    def.push({ type: "demon", count: 1, interval: 0, hpScale: hpMult * 1.5 });
    def.push({ type: "goblin", count: 10, interval: 0.8, hpScale: hpMult });
  } else if (waveNum <= 3) {
    def.push({ type: "goblin", count: 8 + waveNum * 2, interval: 0.9, hpScale: hpMult });
  } else if (waveNum <= 6) {
    def.push({ type: "goblin", count: 10, interval: 0.8, hpScale: hpMult });
    def.push({ type: "wolf", count: 4, interval: 1.2, hpScale: hpMult });
  } else if (waveNum <= 10) {
    def.push({ type: "wolf", count: 6, interval: 0.9, hpScale: hpMult });
    def.push({ type: "ogre", count: 3, interval: 2.0, hpScale: hpMult });
  } else if (waveNum <= 15) {
    def.push({ type: "wolf", count: 8, interval: 0.7, hpScale: hpMult });
    def.push({ type: "ogre", count: 4, interval: 1.8, hpScale: hpMult });
    def.push({ type: "gargoyle", count: 4, interval: 1.5, hpScale: hpMult });
  } else {
    def.push({ type: "goblin", count: 12, interval: 0.5, hpScale: hpMult });
    def.push({ type: "wolf", count: 8, interval: 0.6, hpScale: hpMult });
    def.push({ type: "ogre", count: 5, interval: 1.5, hpScale: hpMult });
    def.push({ type: "gargoyle", count: 6, interval: 1.2, hpScale: hpMult });
  }

  return def;
}
