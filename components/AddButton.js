import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../store/cartStore";
import { COLORS } from "../constants/theme";

export default function AddButton({ product }) {
  // Only re-render when THIS product's quantity changes
  const qty = useCart((s) => s.items.find((i) => i.id === product.id)?.qty ?? 0);
  const addItem = useCart((s) => s.addItem);
  const decreaseItem = useCart((s) => s.decreaseItem);

  if (qty === 0) {
    return (
      <Pressable style={styles.add} onPress={() => addItem(product)}>
        <Ionicons name="add" size={18} color={COLORS.white} />
      </Pressable>
    );
  }

  return (
    <View style={styles.counter}>
      <Pressable onPress={() => decreaseItem(product.id)} hitSlop={8}>
        <Ionicons name="remove" size={16} color={COLORS.white} />
      </Pressable>
      <Text style={styles.qty}>{qty}</Text>
      <Pressable onPress={() => addItem(product)} hitSlop={8}>
        <Ionicons name="add" size={16} color={COLORS.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  add: {
    width: 32, height: 32, borderRadius: 16, backgroundColor: COLORS.primary,
    alignItems: "center", justifyContent: "center",
  },
  counter: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: COLORS.primary, borderRadius: 16,
    height: 32, paddingHorizontal: 10,
  },
  qty: { color: COLORS.white, fontWeight: "700", fontSize: 14, minWidth: 14, textAlign: "center" },
});