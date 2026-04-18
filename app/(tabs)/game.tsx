import React, { useState, useEffect, useRef } from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { GameCanvas } from "@/components/game-canvas";
import { GameEngine } from "@/lib/gameengine";
import { TOWER_DEFS } from "@/lib/gamedata";
import { useColors } from "@/hooks/use-colors";

export default function GameScreen() {
  const colors = useColors();
  const engineRef = useRef(new GameEngine());
  const [gameState, setGameState] = useState(engineRef.current.state);
  const [selectedTower, setSelectedTower] = useState<string | null>(null);
  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Game loop
  useEffect(() => {
    gameLoopRef.current = setInterval(() => {
      const engine = engineRef.current;
      engine.update(0.016); // ~60fps
      setGameState({ ...engine.state });
    }, 16);

    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, []);

  const handleTowerTap = (towerType: string) => {
    setSelectedTower(selectedTower === towerType ? null : towerType);
  };

  const handleCanvasTap = (col: number, row: number) => {
    if (!selectedTower) return;

    const engine = engineRef.current;
    if (engine.placeTower(col, row, selectedTower)) {
      setGameState({ ...engine.state });
      setSelectedTower(null);
    } else {
      Alert.alert("Cannot Place Tower", "Invalid placement or insufficient gold.");
    }
  };

  const handleStartWave = () => {
    const engine = engineRef.current;
    engine.startWave();
    setGameState({ ...engine.state });
  };

  const handleReset = () => {
    const engine = engineRef.current;
    engine.reset();
    setGameState({ ...engine.state });
    setSelectedTower(null);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {/* Status Bar */}
        <View className="bg-surface p-4 border-b border-border">
          <View className="flex-row justify-between mb-2">
            <Text className="text-foreground font-semibold">Wave {gameState.wave}</Text>
            <Text className="text-foreground font-semibold">Lives: {gameState.lives}</Text>
          </View>
          <View className="flex-row justify-between">
            <Text className="text-foreground font-semibold">Gold: {gameState.gold}</Text>
            <Text className="text-foreground font-semibold">Score: {gameState.score}</Text>
          </View>
          <Text className="text-muted text-sm mt-2">State: {gameState.gameState}</Text>
        </View>

        {/* Game Canvas */}
        <GameCanvas gameState={gameState} onTap={handleCanvasTap} />

        {/* Tower Selection Menu */}
        <View className="bg-surface p-4 border-t border-border">
          <Text className="text-foreground font-semibold mb-3">Towers</Text>
          <View className="flex-row flex-wrap gap-2">
            {Object.entries(TOWER_DEFS).map(([key, def]) => (
              <Pressable
                key={key}
                onPress={() => handleTowerTap(key)}
                style={({ pressed }) => [
                  {
                    flex: 0.45,
                    padding: 12,
                    borderRadius: 8,
                    backgroundColor: selectedTower === key ? def.color : "#E5E7EB",
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
              >
                <Text
                  className={`font-semibold text-center ${
                    selectedTower === key ? "text-white" : "text-foreground"
                  }`}
                >
                  {def.name}
                </Text>
                <Text
                  className={`text-xs text-center ${
                    selectedTower === key ? "text-white" : "text-muted"
                  }`}
                >
                  {def.cost}g
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="bg-surface p-4 border-t border-border gap-2">
          {gameState.gameState === "between" || gameState.gameState === "idle" ? (
            <Pressable
              onPress={handleStartWave}
              style={({ pressed }) => [
                {
                  backgroundColor: "#3B82F6",
                  padding: 12,
                  borderRadius: 8,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-white font-semibold text-center">Start Wave</Text>
            </Pressable>
          ) : null}

          {gameState.gameState === "gameover" ? (
            <Pressable
              onPress={handleReset}
              style={({ pressed }) => [
                {
                  backgroundColor: "#10B981",
                  padding: 12,
                  borderRadius: 8,
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Text className="text-white font-semibold text-center">Play Again</Text>
            </Pressable>
          ) : null}
        </View>

        {/* Game Over Message */}
        {gameState.gameState === "gameover" && (
          <View className="bg-error/10 p-4 m-4 rounded-lg border border-error">
            <Text className="text-error font-bold text-center mb-2">Game Over!</Text>
            <Text className="text-foreground text-center">
              Final Wave: {gameState.wave}
            </Text>
            <Text className="text-foreground text-center">
              Final Score: {gameState.score}
            </Text>
          </View>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
