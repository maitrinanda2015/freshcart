import { View, Text, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { ZoomIn, FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import { COLORS } from "../../constants/theme";

export default function Success() {
  const insets = useSafeAreaInsets();

  // Read params, with defaults for the Sign Up flow
  const {
    message = "You have successfully\ncreated your account.",
    button = "Browse Home",
    next = "/home",
  } = useLocalSearchParams();

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom + 32 }]}>
      <View style={styles.center}>
        <Animated.View entering={ZoomIn.springify().damping(12)} style={styles.outerCircle}>
          <View style={styles.innerCircle}>
            <Ionicons name="checkmark" size={40} color={COLORS.white} />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(250)} style={{ alignItems: "center" }}>
          <Text style={styles.title}>Success!</Text>
          <Text style={styles.text}>{message}</Text>
        </Animated.View>
      </View>

      <PrimaryButton title={button} onPress={() => router.replace(next)} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, paddingHorizontal: 24 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  outerCircle: {
    width: 120, height: 120, borderRadius: 60, backgroundColor: COLORS.primaryLight,
    alignItems: "center", justifyContent: "center", marginBottom: 28,
  },
  innerCircle: {
    width: 76, height: 76, borderRadius: 38, backgroundColor: COLORS.primary,
    alignItems: "center", justifyContent: "center",
  },
  title: { fontSize: 26, fontWeight: "bold", color: COLORS.dark, marginBottom: 10 },
  text: { fontSize: 14, color: COLORS.muted, textAlign: "center", lineHeight: 22 },
});