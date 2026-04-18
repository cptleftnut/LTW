import { ScrollView, Text, View, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { ScreenContainer } from "@/components/screen-container";
import { useColors } from "@/hooks/use-colors";

export default function HomeScreen() {
  const router = useRouter();
  const colors = useColors();

  return (
    <ScreenContainer className="p-6">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 gap-8 justify-center">
          {/* Hero Section */}
          <View className="items-center gap-4">
            <Text className="text-5xl font-bold text-foreground">Line Tower Wars</Text>
            <Text className="text-base text-muted text-center">
              Defend your base from waves of enemies
            </Text>
          </View>

          {/* Start Game Button */}
          <View className="items-center gap-4">
            <TouchableOpacity
              onPress={() => router.push("/game")}
              style={{
                backgroundColor: colors.primary,
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: 12,
              }}
            >
              <Text className="text-white font-bold text-lg">Start Game</Text>
            </TouchableOpacity>
          </View>

          {/* Game Info */}
          <View className="w-full bg-surface rounded-2xl p-6 border border-border gap-3">
            <Text className="text-lg font-semibold text-foreground">How to Play</Text>
            <Text className="text-sm text-muted leading-relaxed">
              • Place towers to defend against creeps
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • Earn gold by defeating enemies
            </Text>
            <Text className="text-sm text-muted leading-relaxed">
              • Survive all waves to win
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
