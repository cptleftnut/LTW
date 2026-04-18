// lib/gameengine.ts
// Core game engine: state management, tower/creep/projectile logic

import {
  GRID_COLS,
  GRID_ROWS,
  ENTRY,
  EXIT,
  START_GOLD,
  START_LIVES,
  WAVE_BONUS,
  TOWER_DEFS,
  CREEP_DEFS,
  getWaveDefinition,
  type TowerDef,
  type CreepDef,
} from "./gamedata";
import { newGrid, copyGrid, findPath, canPlace, pathToWorld, nearestPathIndex, type Grid, type Path, type Point } from "./pathfinder";

export interface Tower {
  id: number;
  col: number;
  row: number;
  type: string;
  hp: number;
  cooldown: number;
  targetId: number | null;
}

export interface Creep {
  id: number;
  type: string;
  hp: number;
  maxHp: number;
  speed: number;
  x: number;
  y: number;
  pathIndex: number;
  slowTimer: number;
  slowAmount: number;
  armor: number;
  isFlying: boolean;
  goldReward: number;
  liveDamage: number;
}

export interface Projectile {
  id: number;
  x: number;
  y: number;
  targetId: number;
  speed: number;
  damage: number;
  aoe: number;
  slow: number;
  slowDur: number;
  type: string;
}

export interface GameState {
  grid: Grid;
  path: Path | null;
  worldPath: Array<{ x: number; y: number }> | null;

  towers: Tower[];
  creeps: Creep[];
  projectiles: Projectile[];

  gold: number;
  lives: number;
  wave: number;
  score: number;
  gameState: "idle" | "between" | "wave" | "gameover";

  nextTowerId: number;
  nextCreepId: number;
  nextProjectileId: number;

  spawnQueue: Array<{ type: string; hp: number; at: number }>;
  spawnTimer: number;
  waveTimer: number;
}

export class GameEngine {
  state: GameState;

  constructor() {
    this.state = {
      grid: newGrid(),
      path: findPath(newGrid()),
      worldPath: pathToWorld(findPath(newGrid()) || []),

      towers: [],
      creeps: [],
      projectiles: [],

      gold: START_GOLD,
      lives: START_LIVES,
      wave: 0,
      score: 0,
      gameState: "idle",

      nextTowerId: 1,
      nextCreepId: 1,
      nextProjectileId: 1,

      spawnQueue: [],
      spawnTimer: 0,
      waveTimer: 0,
    };
  }

  /**
   * Start a new wave
   */
  startWave() {
    if (this.state.gameState !== "idle" && this.state.gameState !== "between") {
      return;
    }

    this.state.wave++;
    this.state.gameState = "wave";
    this.state.spawnQueue = [];
    this.state.spawnTimer = 0;

    const waveDef = getWaveDefinition(this.state.wave);
    let spawnTime = 0;

    for (const spawn of waveDef) {
      for (let i = 0; i < spawn.count; i++) {
        spawnTime += spawn.interval;
        this.state.spawnQueue.push({
          type: spawn.type,
          hp: CREEP_DEFS[spawn.type].baseHp * spawn.hpScale,
          at: spawnTime,
        });
      }
    }
  }

  /**
   * Try to place a tower at grid position (col, row)
   */
  placeTower(col: number, row: number, towerType: string): boolean {
    const def = TOWER_DEFS[towerType];
    if (!def) return false;

    if (this.state.gold < def.cost) return false;

    const [canPlaceHere, newPath] = canPlace(this.state.grid, col, row);
    if (!canPlaceHere) return false;

    // Place tower
    this.state.grid[row][col] = true;
    this.state.path = newPath;
    this.state.worldPath = newPath ? pathToWorld(newPath) : null;

    const tower: Tower = {
      id: this.state.nextTowerId++,
      col,
      row,
      type: towerType,
      hp: 100,
      cooldown: 0,
      targetId: null,
    };

    this.state.towers.push(tower);
    this.state.gold -= def.cost;
    this.state.score += 10;

    return true;
  }

  /**
   * Sell a tower
   */
  sellTower(towerId: number): boolean {
    const idx = this.state.towers.findIndex((t) => t.id === towerId);
    if (idx === -1) return false;

    const tower = this.state.towers[idx];
    const def = TOWER_DEFS[tower.type];

    this.state.grid[tower.row][tower.col] = false;
    this.state.towers.splice(idx, 1);
    this.state.gold += Math.floor(def.cost * def.sellFrac);

    // Recompute path
    this.state.path = findPath(this.state.grid);
    this.state.worldPath = this.state.path ? pathToWorld(this.state.path) : null;

    return true;
  }

  /**
   * Update game state by delta time (seconds)
   */
  update(dt: number) {
    if (this.state.gameState === "gameover") return;

    if (this.state.gameState === "wave") {
      this.updateWave(dt);
    }

    this.updateTowers(dt);
    this.updateCreeps(dt);
    this.updateProjectiles(dt);

    // Check if wave is complete
    if (
      this.state.gameState === "wave" &&
      this.state.creeps.length === 0 &&
      this.state.spawnQueue.length === 0
    ) {
      this.state.gameState = "between";
      this.state.gold += WAVE_BONUS(this.state.wave);
      this.state.score += this.state.wave * 100;
    }

    // Check game over
    if (this.state.lives <= 0) {
      this.state.gameState = "gameover";
    }
  }

  private updateWave(dt: number) {
    this.state.spawnTimer += dt;

    while (
      this.state.spawnQueue.length > 0 &&
      this.state.spawnTimer >= this.state.spawnQueue[0].at
    ) {
      const spawn = this.state.spawnQueue.shift()!;
      this.spawnCreep(spawn.type, spawn.hp);
    }
  }

  private spawnCreep(type: string, hp: number) {
    const def = CREEP_DEFS[type];
    if (!def || !this.state.worldPath || this.state.worldPath.length === 0) {
      return;
    }

    const startPos = this.state.worldPath[0];
    const creep: Creep = {
      id: this.state.nextCreepId++,
      type,
      hp,
      maxHp: hp,
      speed: def.baseSpeed,
      x: startPos.x,
      y: startPos.y,
      pathIndex: 0,
      slowTimer: 0,
      slowAmount: 0,
      armor: def.armor,
      isFlying: def.isFlying,
      goldReward: def.gold,
      liveDamage: def.damage,
    };

    this.state.creeps.push(creep);
  }

  private updateTowers(dt: number) {
    for (const tower of this.state.towers) {
      tower.cooldown = Math.max(0, tower.cooldown - dt);

      if (tower.cooldown <= 0) {
        const target = this.findTarget(tower);
        if (target) {
          tower.targetId = target.id;
          this.fireProjectile(tower, target);
          const def = TOWER_DEFS[tower.type];
          tower.cooldown = 1 / def.fireRate;
        }
      }
    }
  }

  private findTarget(tower: Tower): Creep | null {
    const def = TOWER_DEFS[tower.type];
    const towerPos = {
      x: (tower.col + 0.5 - GRID_COLS / 2) * 8,
      y: (tower.row + 0.5 - GRID_ROWS / 2) * 8,
    };

    let closest: Creep | null = null;
    let closestDist = def.range * 8;

    for (const creep of this.state.creeps) {
      const dx = creep.x - towerPos.x;
      const dy = creep.y - towerPos.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < closestDist && creep.pathIndex < (this.state.worldPath?.length || 0)) {
        closest = creep;
        closestDist = dist;
      }
    }

    return closest;
  }

  private fireProjectile(tower: Tower, target: Creep) {
    const def = TOWER_DEFS[tower.type];
    const towerPos = {
      x: (tower.col + 0.5 - GRID_COLS / 2) * 8,
      y: (tower.row + 0.5 - GRID_ROWS / 2) * 8,
    };

    const projectile: Projectile = {
      id: this.state.nextProjectileId++,
      x: towerPos.x,
      y: towerPos.y,
      targetId: target.id,
      speed: 100,
      damage: def.damage,
      aoe: def.aoe * 8,
      slow: def.slowAmount,
      slowDur: def.slowDur,
      type: def.projectile,
    };

    this.state.projectiles.push(projectile);
  }

  private updateCreeps(dt: number) {
    for (const creep of this.state.creeps) {
      if (creep.slowTimer > 0) {
        creep.slowTimer -= dt;
      }

      const speed = creep.speed * (1 - creep.slowAmount * (creep.slowTimer > 0 ? 1 : 0));
      const moveDistance = speed * dt;

      if (!this.state.worldPath || this.state.worldPath.length === 0) {
        continue;
      }

      let distRemaining = moveDistance;
      while (distRemaining > 0 && creep.pathIndex < this.state.worldPath.length) {
        const currentWaypoint = this.state.worldPath[creep.pathIndex];
        const nextWaypoint =
          creep.pathIndex + 1 < this.state.worldPath.length
            ? this.state.worldPath[creep.pathIndex + 1]
            : null;

        if (!nextWaypoint) {
          // Reached the end
          creep.pathIndex = this.state.worldPath.length;
          break;
        }

        const dx = nextWaypoint.x - creep.x;
        const dy = nextWaypoint.y - creep.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= distRemaining) {
          creep.x = nextWaypoint.x;
          creep.y = nextWaypoint.y;
          distRemaining -= dist;
          creep.pathIndex++;
        } else {
          const ratio = distRemaining / dist;
          creep.x += dx * ratio;
          creep.y += dy * ratio;
          distRemaining = 0;
        }
      }

      // Check if creep reached the exit
      if (creep.pathIndex >= this.state.worldPath.length) {
        this.state.lives -= creep.liveDamage;
        const idx = this.state.creeps.indexOf(creep);
        if (idx !== -1) {
          this.state.creeps.splice(idx, 1);
        }
      }
    }
  }

  private updateProjectiles(dt: number) {
    for (let i = this.state.projectiles.length - 1; i >= 0; i--) {
      const proj = this.state.projectiles[i];
      const target = this.state.creeps.find((c) => c.id === proj.targetId);

      if (!target) {
        this.state.projectiles.splice(i, 1);
        continue;
      }

      const dx = target.x - proj.x;
      const dy = target.y - proj.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < proj.speed * dt) {
        // Hit
        this.hitCreep(target, proj);
        this.state.projectiles.splice(i, 1);
      } else {
        const ratio = (proj.speed * dt) / dist;
        proj.x += dx * ratio;
        proj.y += dy * ratio;
      }
    }
  }

  private hitCreep(creep: Creep, proj: Projectile) {
    const damage = proj.damage * (1 - creep.armor);

    if (proj.aoe > 0) {
      // AoE damage
      for (const other of this.state.creeps) {
        const dx = other.x - creep.x;
        const dy = other.y - creep.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= proj.aoe) {
          other.hp -= damage;
          if (proj.slow > 0) {
            other.slowAmount = proj.slow;
            other.slowTimer = proj.slowDur;
          }
        }
      }
    } else {
      // Single target
      creep.hp -= damage;
      if (proj.slow > 0) {
        creep.slowAmount = proj.slow;
        creep.slowTimer = proj.slowDur;
      }
    }

    // Remove dead creeps
    this.state.creeps = this.state.creeps.filter((c) => {
      if (c.hp <= 0) {
        this.state.gold += c.goldReward;
        this.state.score += Math.floor(c.maxHp / 10);
        return false;
      }
      return true;
    });
  }

  /**
   * Reset the game
   */
  reset() {
    this.state = {
      grid: newGrid(),
      path: findPath(newGrid()),
      worldPath: pathToWorld(findPath(newGrid()) || []),

      towers: [],
      creeps: [],
      projectiles: [],

      gold: START_GOLD,
      lives: START_LIVES,
      wave: 0,
      score: 0,
      gameState: "idle",

      nextTowerId: 1,
      nextCreepId: 1,
      nextProjectileId: 1,

      spawnQueue: [],
      spawnTimer: 0,
      waveTimer: 0,
    };
  }
}
