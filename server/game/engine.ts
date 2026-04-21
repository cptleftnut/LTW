import { Server, Socket } from "socket.io";
import { RNG } from "./rng";

export type Tower = {
  x: number;
  lastShot: number;
};

export type Unit = {
  id: string;
  x: number;
  hp: number;
  owner: string;
};

export type PlayerState = {
  id: string;
  gold: number;
  hp: number;
  towers: Tower[];
  units: Unit[];
};

export type GameState = {
  players: PlayerState[];
  tick: number;
  seed: number;
};

export type Input = {
  playerId: string;
  type: "build" | "spawn";
  payload?: any;
};

export class GameInstance {
  private state: GameState;
  private inputQueue: Input[] = [];
  private rng: RNG;
  private interval: NodeJS.Timeout | null = null;
  private io: Server;
  private matchId: string;
  private onGameOver: (winnerId: string) => void;

  constructor(
    matchId: string,
    playerIds: string[],
    io: Server,
    onGameOver: (winnerId: string) => void,
    seed: number = Math.floor(Math.random() * 1000000)
  ) {
    this.matchId = matchId;
    this.io = io;
    this.onGameOver = onGameOver;
    this.rng = new RNG(seed);
    this.state = {
      tick: 0,
      seed: seed,
      players: playerIds.map((id) => ({
        id,
        gold: 100,
        hp: 20,
        towers: [],
        units: [],
      })),
    };
  }

  addInput(input: Input) {
    this.inputQueue.push(input);
  }

  start() {
    const TICK_RATE = 50; // 20 TPS
    this.interval = setInterval(() => {
      this.tick();
    }, TICK_RATE);
  }

  private tick() {
    this.state.tick++;
    this.processInputs();
    this.updateEconomy();
    this.spawnUnits();
    this.moveUnits();
    this.towersAttack();
    this.applyDamage();
    this.cleanup();

    const winnerId = this.checkWin();
    if (winnerId) {
      this.io.to(this.matchId).emit("game_over", { winnerId });
      this.stop();
      this.onGameOver(winnerId);
      return;
    }

    this.io.to(this.matchId).emit("state", this.state);
  }

  private processInputs() {
    for (const input of this.inputQueue) {
      const player = this.state.players.find((p) => p.id === input.playerId);
      if (!player) continue;

      if (input.type === "build") {
        if (player.gold >= 50) {
          player.gold -= 50;
          player.towers.push({ x: player.towers.length * 20, lastShot: 0 });
        }
      }
    }
    this.inputQueue = [];
  }

  private updateEconomy() {
    this.state.players.forEach((p) => {
      if (this.state.tick % 20 === 0) {
        p.gold += 10;
      }
    });
  }

  private spawnUnits() {
    this.state.players.forEach((p) => {
      if (this.state.tick % 40 === 0) {
        p.units.push({
          id: Math.random().toString(36).substr(2, 9),
          x: 0,
          hp: 10,
          owner: p.id,
        });
      }
    });
  }

  private moveUnits() {
    this.state.players.forEach((p) => {
      p.units.forEach((u) => {
        u.x += 2;
      });
    });
  }

  private towersAttack() {
    this.state.players.forEach((p) => {
      const enemies = this.state.players.filter((e) => e.id !== p.id);
      p.towers.forEach((tower) => {
        enemies.forEach((enemy) => {
          enemy.units.forEach((unit) => {
            if (Math.abs(unit.x - tower.x) < 30) {
              unit.hp -= 1;
            }
          });
        });
      });
    });
  }

  private applyDamage() {
    this.state.players.forEach((p) => {
      const enemies = this.state.players.filter((e) => e.id !== p.id);
      enemies.forEach((enemy) => {
        enemy.units.forEach((unit) => {
          if (unit.x > 500) {
            p.hp -= 1;
            unit.hp = 0;
          }
        });
      });
    });
  }

  private cleanup() {
    this.state.players.forEach((p) => {
      p.units = p.units.filter((u) => u.hp > 0);
    });
  }

  private checkWin(): string | null {
    const alive = this.state.players.filter((p) => p.hp > 0);
    if (this.state.players.length > 1 && alive.length === 1) {
      return alive[0].id;
    }
    return null;
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }
}
