import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, Switch } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";
import { audioManager } from "@/lib/audio-manager";
import { gameModeManager, type Difficulty, type MapType } from "@/lib/game-modes";

export default function SettingsScreen() {
  const colors = useColors();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);
  const [difficulty, setDifficulty] = useState<Difficulty>("normal");
  const [selectedMap, setSelectedMap] = useState<MapType>("map1");

  const handleSoundToggle = (value: boolean) => {
    setSoundEnabled(value);
    audioManager.setSoundEnabled(value);
  };

  const handleMusicToggle = (value: boolean) => {
    setMusicEnabled(value);
    audioManager.setMusicEnabled(value);
  };

  const handleDifficultyChange = (diff: Difficulty) => {
    setDifficulty(diff);
    gameModeManager.setDifficulty(diff);
  };

  const handleMapChange = (map: MapType) => {
    setSelectedMap(map);
    gameModeManager.setMap(map);
  };

  return (
    <ScreenContainer className="bg-background">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="p-6 gap-6">
          {/* Audio Settings */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Audio</Text>

            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-foreground">Sound Effects</Text>
              <Switch value={soundEnabled} onValueChange={handleSoundToggle} />
            </View>

            <View className="flex-row justify-between items-center">
              <Text className="text-foreground">Background Music</Text>
              <Switch value={musicEnabled} onValueChange={handleMusicToggle} />
            </View>
          </View>

          {/* Difficulty Settings */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Difficulty</Text>

            <View className="gap-2">
              {(["easy", "normal", "hard"] as Difficulty[]).map((diff) => (
                <Pressable
                  key={diff}
                  onPress={() => handleDifficultyChange(diff)}
                  style={({ pressed }) => [
                    {
                      padding: 12,
                      borderRadius: 8,
                      backgroundColor: difficulty === diff ? colors.primary : "#E5E7EB",
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text
                    className={`font-semibold capitalize ${
                      difficulty === diff ? "text-white" : "text-foreground"
                    }`}
                  >
                    {diff}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text className="text-xs text-muted mt-3">
              {difficulty === "easy" && "Slower creeps, more gold, more lives"}
              {difficulty === "normal" && "Balanced gameplay"}
              {difficulty === "hard" && "Faster creeps, less gold, fewer lives"}
            </Text>
          </View>

          {/* Map Selection */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-4">Map</Text>

            <View className="gap-2">
              {(["map1", "map2", "map3"] as MapType[]).map((map) => (
                <Pressable
                  key={map}
                  onPress={() => handleMapChange(map)}
                  style={({ pressed }) => [
                    {
                      padding: 12,
                      borderRadius: 8,
                      backgroundColor: selectedMap === map ? colors.primary : "#E5E7EB",
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <View>
                    <Text
                      className={`font-semibold ${
                        selectedMap === map ? "text-white" : "text-foreground"
                      }`}
                    >
                      {map === "map1" && "Classic Path"}
                      {map === "map2" && "Spiral Path"}
                      {map === "map3" && "Zigzag Path"}
                    </Text>
                    <Text
                      className={`text-xs ${
                        selectedMap === map ? "text-white/80" : "text-muted"
                      }`}
                    >
                      {map === "map1" && "A winding path with multiple turns"}
                      {map === "map2" && "A spiral pattern with tight corners"}
                      {map === "map3" && "A challenging zigzag with many turns"}
                    </Text>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>

          {/* About */}
          <View className="bg-surface rounded-lg p-4 border border-border">
            <Text className="text-lg font-semibold text-foreground mb-2">About</Text>
            <Text className="text-sm text-muted">Line Tower Wars v1.0.0</Text>
            <Text className="text-sm text-muted mt-2">
              A strategic tower defense game where you place towers to defend against waves of
              enemies.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
