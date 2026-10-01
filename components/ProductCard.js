import { View, Text, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import AddButton from "./AddButton";
import { COLORS } from "../constants/theme";

// variant: "grid" (tall card) or "list" (wide row)
export default function ProductCard({ product: p, variant = "grid" }) {
  const open = () => router.push(`/product/${p.id}`);

  if (variant === "list") {
    return (
      <Pressable onPress={open} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
        <View style={[styles.rowImage, { backgroundColor: p.bg }]}>
          <Text style={{ fontSize: 32 }}>{p.emoji}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.name} numberOfLines={1}>{p.name}</Text>
          <Text style={styles.unit}>{p.unit}</Text>
          <Text style={[styles.price, { marginTop: 6 }]}>₹{p.price}</Text>
        </View>
        <AddButton product={p} />
      </Pressable>
    );
  }

  return (
    <Pressable onPress={open} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.image, { backgroundColor: p.bg }]}>
        <Text style={{ fontSize: 48 }}>{p.emoji}</Text>
      </View>
      <Text style={[styles.name, { marginTop: 10 }]} numberOfLines={1}>{p.name}</Text>
      <Text style={styles.unit}>{p.unit}</Text>
      <View style={styles.footer}>
        <Text style={styles.price}>₹{p.price}</Text>
        <AddButton product={p} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "48%", backgroundColor: COLORS.white, borderRadius: 18, padding: 10,
    marginBottom: 14, borderWidth: 1, borderColor: "#EEF1F3",
  },
  image: { height: 110, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  row: {
    flexDirection: "row", alignItems: "center", padding: 10, borderRadius: 18,
    borderWidth: 1, borderColor: "#EEF1F3", marginBottom: 12, backgroundColor: COLORS.white,
  },
  rowImage: { width: 64, height: 64, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  pressed: { opacity: 0.85, transform: [{ scale: 0.98 }] },
  name: { fontSize: 14, fontWeight: "700", color: COLORS.dark },
  unit: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  footer: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 8 },
  price: { fontSize: 16, fontWeight: "800", color: COLORS.dark },
});