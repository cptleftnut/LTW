// lib/tower-upgrades.ts
// Tower upgrade system

export interface TowerUpgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  type: "damage" | "range" | "fireRate";
  value: number; // Multiplier or additive value
}

export interface TowerUpgrades {
  damage: number; // Multiplier (1.0 = no upgrade)
  range: number; // Multiplier (1.0 = no upgrade)
  fireRate: number; // Multiplier (1.0 = no upgrade)
}

export const UPGRADE_DEFS: Record<string, TowerUpgrade> = {
  damage_1: {
    id: "damage_1",
    name: "Damage I",
    description: "Increase damage by 20%",
    cost: 100,
    type: "damage",
    value: 1.2,
  },
  damage_2: {
    id: "damage_2",
    name: "Damage II",
    description: "Increase damage by 40%",
    cost: 200,
    type: "damage",
    value: 1.4,
  },
  range_1: {
    id: "range_1",
    name: "Range I",
    description: "Increase range by 15%",
    cost: 120,
    type: "range",
    value: 1.15,
  },
  range_2: {
    id: "range_2",
    name: "Range II",
    description: "Increase range by 30%",
    cost: 220,
    type: "range",
    value: 1.3,
  },
  fireRate_1: {
    id: "fireRate_1",
    name: "Fire Rate I",
    description: "Increase fire rate by 25%",
    cost: 110,
    type: "fireRate",
    value: 1.25,
  },
  fireRate_2: {
    id: "fireRate_2",
    name: "Fire Rate II",
    description: "Increase fire rate by 50%",
    cost: 210,
    type: "fireRate",
    value: 1.5,
  },
};

export class UpgradeManager {
  private upgrades: Map<number, TowerUpgrades> = new Map(); // towerId -> upgrades

  /**
   * Initialize upgrades for a tower
   */
  initializeTower(towerId: number) {
    this.upgrades.set(towerId, {
      damage: 1.0,
      range: 1.0,
      fireRate: 1.0,
    });
  }

  /**
   * Apply an upgrade to a tower
   */
  applyUpgrade(towerId: number, upgradeId: string): boolean {
    const upgrade = UPGRADE_DEFS[upgradeId];
    if (!upgrade) return false;

    const towerUpgrades = this.upgrades.get(towerId);
    if (!towerUpgrades) return false;

    if (upgrade.type === "damage") {
      towerUpgrades.damage *= upgrade.value;
    } else if (upgrade.type === "range") {
      towerUpgrades.range *= upgrade.value;
    } else if (upgrade.type === "fireRate") {
      towerUpgrades.fireRate *= upgrade.value;
    }

    return true;
  }

  /**
   * Get upgrades for a tower
   */
  getUpgrades(towerId: number): TowerUpgrades {
    return this.upgrades.get(towerId) || { damage: 1.0, range: 1.0, fireRate: 1.0 };
  }

  /**
   * Remove a tower's upgrades
   */
  removeTower(towerId: number) {
    this.upgrades.delete(towerId);
  }

  /**
   * Reset all upgrades
   */
  reset() {
    this.upgrades.clear();
  }
}

export const upgradeManager = new UpgradeManager();
