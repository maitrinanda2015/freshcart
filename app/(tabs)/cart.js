import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useCart, getSubtotal } from "../../store/cartStore";
import AddButton from "../../components/AddButton";
import PrimaryButton from "../../components/PrimaryButton";
import { COLORS } from "../../constants/theme";
import { useOrders } from "../../store/orderStore";

const FREE_DELIVERY_ABOVE = 500;
const DELIVERY_FEE = 40;

export default function Cart() {
  const insets = useSafeAreaInsets();
  const items = useCart((s) => s.items);
  const removeItem = useCart((s) => s.removeItem);
  const clearCart = useCart((s) => s.clearCart);
    const placeOrderInStore = useOrders((s) => s.placeOrder);

  const subtotal = getSubtotal(items);
  const delivery = subtotal >= FREE_DELIVERY_ABOVE ? 0 : DELIVERY_FEE;
  const total = subtotal + delivery;

    const placeOrder = () => {
    placeOrderInStore({ items, subtotal, delivery, total });
    clearCart();
    router.push({
      pathname: "/success",
      params: {
        message: `Your order of ₹${total} has been\nplaced successfully!`,
        button: "Track My Order",
        next: "/orders",
      },
    });
  };

  // Empty state
  if (items.length === 0) {
    return (
      <View style={[styles.empty, { paddingTop: insets.top }]}>
        <Text style={{ fontSize: 72 }}>🛒</Text>
        <Text style={styles.emptyTitle}>Your cart is empty</Text>
        <Text style={styles.emptyText}>Add some fresh groceries to get started.</Text>
        <PrimaryButton
          title="Browse Products"
          onPress={() => router.push("/home")}
          style={{ alignSelf: "stretch", marginTop: 28 }}
        />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 24, paddingBottom: 24 }}>
        <Text style={styles.title}>My Cart</Text>

        {/* Cart items */}
        {items.map((item) => (
          <View key={item.id} style={styles.item}>
            <View style={[styles.itemImage, { backgroundColor: item.bg }]}>
              <Text style={{ fontSize: 32 }}>{item.emoji}</Text>
            </View>
            <View style={{ flex: 1, marginLeft: 14 }}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemUnit}>{item.unit}</Text>
              <Text style={styles.itemPrice}>₹{item.price * item.qty}</Text>
            </View>
            <View style={{ alignItems: "flex-end", justifyContent: "space-between", alignSelf: "stretch" }}>
              <Pressable onPress={() => removeItem(item.id)} hitSlop={8}>
                <Ionicons name="trash-outline" size={18} color={COLORS.muted} />
              </Pressable>
              <AddButton product={item} />
            </View>
          </View>
        ))}

        {/* Free delivery hint */}
        {delivery > 0 && (
          <View style={styles.hint}>
            <Ionicons name="bicycle-outline" size={18} color={COLORS.primaryDark} />
            <Text style={styles.hintText}>
              Add ₹{FREE_DELIVERY_ABOVE - subtotal} more for free delivery
            </Text>
          </View>
        )}

        {/* Bill summary */}
        <View style={styles.bill}>
          <Text style={styles.billTitle}>Bill Details</Text>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Item total</Text>
            <Text style={styles.billValue}>₹{subtotal}</Text>
          </View>
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Delivery fee</Text>
            <Text style={[styles.billValue, delivery === 0 && { color: COLORS.primary }]}>
              {delivery === 0 ? "FREE" : `₹${delivery}`}
            </Text>
          </View>
          <View style={[styles.billRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>To pay</Text>
            <Text style={styles.totalValue}>₹{total}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Fixed checkout bar */}
      <View style={styles.checkout}>
        <View>
          <Text style={styles.checkoutLabel}>Total</Text>
          <Text style={styles.checkoutTotal}>₹{total}</Text>
        </View>
        <PrimaryButton title="Place Order" onPress={placeOrder} style={{ flex: 1, marginLeft: 20 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "bold", color: COLORS.dark, marginBottom: 20 },
  item: {
    flexDirection: "row", alignItems: "center", padding: 12, borderRadius: 18,
    borderWidth: 1, borderColor: "#EEF1F3", marginBottom: 12,
  },
  itemImage: { width: 70, height: 70, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  itemName: { fontSize: 15, fontWeight: "700", color: COLORS.dark },
  itemUnit: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  itemPrice: { fontSize: 16, fontWeight: "800", color: COLORS.dark, marginTop: 6 },
  hint: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: COLORS.primaryLight, borderRadius: 14, padding: 12, marginTop: 4,
  },
  hintText: { color: COLORS.primaryDark, fontSize: 13, fontWeight: "600" },
  bill: { backgroundColor: COLORS.field, borderRadius: 18, padding: 16, marginTop: 16 },
  billTitle: { fontSize: 16, fontWeight: "700", color: COLORS.dark, marginBottom: 12 },
  billRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 8 },
  billLabel: { color: COLORS.muted, fontSize: 14 },
  billValue: { color: COLORS.dark, fontSize: 14, fontWeight: "600" },
  totalRow: { borderTopWidth: 1, borderTopColor: "#E2E6E9", paddingTop: 10, marginTop: 4, marginBottom: 0 },
  totalLabel: { fontSize: 15, fontWeight: "700", color: COLORS.dark },
  totalValue: { fontSize: 17, fontWeight: "800", color: COLORS.dark },
  checkout: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 24, paddingVertical: 14,
    borderTopWidth: 1, borderTopColor: "#EEF1F3", backgroundColor: COLORS.white,
  },
  checkoutLabel: { color: COLORS.muted, fontSize: 12 },
  checkoutTotal: { fontSize: 20, fontWeight: "800", color: COLORS.dark },
  empty: {
    flex: 1, alignItems: "center", justifyContent: "center",
    backgroundColor: COLORS.white, paddingHorizontal: 32,
  },
  emptyTitle: { fontSize: 22, fontWeight: "bold", color: COLORS.dark, marginTop: 16 },
  emptyText: { fontSize: 14, color: COLORS.muted, marginTop: 6, textAlign: "center" },
});