import React, { useRef } from "react";
import { View, Pressable } from "react-native";
import type { GameState } from "@/lib/gameengine";
import { GRID_COLS, GRID_ROWS, TOWER_DEFS, CREEP_DEFS } from "@/lib/gamedata";

interface GameCanvasProps {
  gameState: GameState;
  onTap?: (col: number, row: number) => void;
}

/**
 * Simple canvas-based game renderer using React Native
 * Renders grid, towers, creeps, and projectiles
 */
export function GameCanvas({ gameState, onTap }: GameCanvasProps) {
  const canvasRef = useRef<any>(null);

  const handlePress = (event: any) => {
    const { locationX, locationY } = event.nativeEvent;
    const canvasWidth = 360; // Approximate width
    const canvasHeight = 240; // Approximate height

    const cellWidth = canvasWidth / GRID_COLS;
    const cellHeight = canvasHeight / GRID_ROWS;

    const col = Math.floor(locationX / cellWidth);
    const row = Math.floor(locationY / cellHeight);

    if (col >= 0 && col < GRID_COLS && row >= 0 && row < GRID_ROWS) {
      onTap?.(col, row);
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={{
        width: "100%",
        height: 240,
        backgroundColor: "#F5F5F5",
        borderWidth: 1,
        borderColor: "#E0E0E0",
        overflow: "hidden",
      }}
    >
      <View style={{ flex: 1, padding: 8 }}>
        {/* Grid visualization */}
        <View style={{ flex: 1, backgroundColor: "#FFFFFF", borderWidth: 1, borderColor: "#E0E0E0" }}>
          {/* Towers */}
          {gameState.towers.map((tower) => {
            const def = TOWER_DEFS[tower.type];
            const cellWidth = 360 / GRID_COLS;
            const cellHeight = 224 / GRID_ROWS;
            const x = tower.col * cellWidth;
            const y = tower.row * cellHeight;

            return (
              <View
                key={`tower-${tower.id}`}
                style={{
                  position: "absolute",
                  left: x + cellWidth * 0.15,
                  top: y + cellHeight * 0.15,
                  width: cellWidth * 0.7,
                  height: cellHeight * 0.7,
                  backgroundColor: def.color,
                  borderRadius: 4,
                }}
              />
            );
          })}

          {/* Creeps */}
          {gameState.creeps.map((creep) => {
            const def = CREEP_DEFS[creep.type];
            const cellWidth = 360 / GRID_COLS;
            const cellHeight = 224 / GRID_ROWS;
            const x = (creep.x / 8 + GRID_COLS / 2) * cellWidth;
            const y = (creep.y / 8 + GRID_ROWS / 2) * cellHeight;
            const size = Math.min(cellWidth, cellHeight) * 0.5;

            return (
              <View key={`creep-${creep.id}`} style={{ position: "absolute", left: x - size / 2, top: y - size / 2 }}>
                <View
                  style={{
                    width: size,
                    height: size,
                    backgroundColor: def.color,
                    borderRadius: size / 2,
                  }}
                />
                {/* Health bar */}
                <View
                  style={{
                    position: "absolute",
                    top: -8,
                    left: 0,
                    width: size,
                    height: 3,
                    backgroundColor: "#E5E7EB",
                    borderRadius: 2,
                  }}
                >
                  <View
                    style={{
                      width: (size * creep.hp) / creep.maxHp,
                      height: 3,
                      backgroundColor: "#10B981",
                      borderRadius: 2,
                    }}
                  />
                </View>
              </View>
            );
          })}

          {/* Projectiles */}
          {gameState.projectiles.map((proj) => {
            const cellWidth = 360 / GRID_COLS;
            const cellHeight = 224 / GRID_ROWS;
            const x = (proj.x / 8 + GRID_COLS / 2) * cellWidth;
            const y = (proj.y / 8 + GRID_ROWS / 2) * cellHeight;

            return (
              <View
                key={`proj-${proj.id}`}
                style={{
                  position: "absolute",
                  left: x - 3,
                  top: y - 3,
                  width: 6,
                  height: 6,
                  backgroundColor: "#FFD700",
                  borderRadius: 3,
                }}
              />
            );
          })}
        </View>
      </View>
    </Pressable>
  );
}
