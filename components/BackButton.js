import { Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

export default function BackButton() {
  return (
    <Pressable
      style={styles.back}
      onPress={() => (router.canGoBack() ? router.back() : router.replace("/sign-in"))}
    >
      <Ionicons name="arrow-back" size={20} color={COLORS.dark} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  back: {
    width: 40, height: 40, borderRadius: 20,
    borderWidth: 1, borderColor: "#E6E9EC",
    alignItems: "center", justifyContent: "center",
    marginBottom: 32,
  },
});