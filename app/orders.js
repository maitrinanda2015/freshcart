import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useOrders } from "../store/orderStore";
import { useCart } from "../store/cartStore";
import BackButton from "../components/BackButton";
import PrimaryButton from "../components/PrimaryButton";
import { COLORS } from "../constants/theme";
import { useUser } from "../store/userStore";

const FILTERS = ["All", "On Delivery", "Delivered", "Cancelled"];

const STATUS_STYLE = {
  "On Delivery": { bg: "#FFF4DE", color: "#C98A0B", icon: "bicycle-outline" },
  Delivered: { bg: COLORS.primaryLight, color: COLORS.primaryDark, icon: "checkmark-circle-outline" },
  Cancelled: { bg: "#FDEBEB", color: "#D64545", icon: "close-circle-outline" },
};

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

export default function Orders() {
  const insets = useSafeAreaInsets();
    const user = useUser((s) => s.user);
  const allOrders = useOrders((s) => s.orders);
  const orders = allOrders.filter((o) => o.userEmail === user?.email);
  const updateStatus = useOrders((s) => s.updateStatus);
  const addItem = useCart((s) => s.addItem);
  const [filter, setFilter] = useState("All");

  const visible = filter === "All" ? orders : orders.filter((o) => o.status === filter);

  const reorder = (order) => {
    order.items.forEach((item) => addItem(item, item.qty));
    router.push("/cart");
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <BackButton />
        <Text style={styles.title}>My Orders</Text>

        {/* Filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
          {FILTERS.map((f) => {
            const active = f === filter;
            const count = f === "All" ? orders.length : orders.filter((o) => o.status === f).length;
            return (
              <Pressable key={f} onPress={() => setFilter(f)} style={[styles.chip, active && styles.chipActive]}>
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {f} {count > 0 ? `(${count})` : ""}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {visible.length === 0 ? (
        <View style={styles.empty}>
          <Text style={{ fontSize: 64 }}>📦</Text>
          <Text style={styles.emptyTitle}>
            {orders.length === 0 ? "No orders yet" : `No ${filter.toLowerCase()} orders`}
          </Text>
          <Text style={styles.emptyText}>Your orders will appear here.</Text>
          {orders.length === 0 && (
            <PrimaryButton
              title="Start Shopping"
              onPress={() => router.replace("/home")}
              style={{ alignSelf: "stretch", marginTop: 24 }}
            />
          )}
        </View>
      ) : (
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: insets.bottom + 24 }}>
          {visible.map((order, index) => {
            const s = STATUS_STYLE[order.status];
            const itemCount = order.items.reduce((n, i) => n + i.qty, 0);
            return (
              <Animated.View key={order.id} entering={FadeInDown.delay(index * 60)} style={styles.card}>
                {/* Top row: emojis + status */}
                <View style={styles.cardTop}>
                  <View style={styles.emojis}>
                    {order.items.slice(0, 3).map((i) => (
                      <View key={i.id} style={[styles.emojiBox, { backgroundColor: i.bg }]}>
                        <Text style={{ fontSize: 22 }}>{i.emoji}</Text>
                      </View>
                    ))}
                    {order.items.length > 3 && (
                      <View style={[styles.emojiBox, { backgroundColor: COLORS.field }]}>
                        <Text style={styles.more}>+{order.items.length - 3}</Text>
                      </View>
                    )}
                  </View>
                  <View style={[styles.status, { backgroundColor: s.bg }]}>
                    <Ionicons name={s.icon} size={14} color={s.color} />
                    <Text style={[styles.statusText, { color: s.color }]}>{order.status}</Text>
                  </View>
                </View>

                {/* Details */}
                <Text style={styles.orderId}>Order #{order.id}</Text>
                <Text style={styles.meta}>
                  {formatDate(order.date)} · {itemCount} {itemCount === 1 ? "item" : "items"}
                </Text>
                <Text style={styles.itemNames} numberOfLines={1}>
                  {order.items.map((i) => `${i.name} ×${i.qty}`).join(", ")}
                </Text>

                {/* Bottom row: total + actions */}
                <View style={styles.cardBottom}>
                  <Text style={styles.total}>₹{order.total}</Text>
                  <View style={{ flexDirection: "row", gap: 8 }}>
                    {order.status === "On Delivery" && (
                      <>
                        <Pressable style={styles.outlineBtn} onPress={() => updateStatus(order.id, "Cancelled")}>
                          <Text style={[styles.btnText, { color: "#D64545" }]}>Cancel</Text>
                        </Pressable>
                        <Pressable style={styles.solidBtn} onPress={() => updateStatus(order.id, "Delivered")}>
                          <Text style={[styles.btnText, { color: COLORS.white }]}>Mark Delivered</Text>
                        </Pressable>
                      </>
                    )}
                    {order.status !== "On Delivery" && (
                      <Pressable style={styles.solidBtn} onPress={() => reorder(order)}>
                        <Text style={[styles.btnText, { color: COLORS.white }]}>Reorder</Text>
                      </Pressable>
                    )}
                  </View>
                </View>
              </Animated.View>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: { paddingHorizontal: 24, paddingBottom: 16 },
  title: { fontSize: 26, fontWeight: "bold", color: COLORS.dark, marginTop: -12, marginBottom: 16 },
  chip: {
    paddingHorizontal: 16, paddingVertical: 9, borderRadius: 20,
    borderWidth: 1, borderColor: "#E6E9EC",
  },
  chipActive: { backgroundColor: COLORS.primaryLight, borderColor: COLORS.primary },
  chipText: { fontSize: 13, color: COLORS.muted, fontWeight: "600" },
  chipTextActive: { color: COLORS.primaryDark },
  card: {
    borderWidth: 1, borderColor: "#EEF1F3", borderRadius: 18,
    padding: 14, marginBottom: 14, backgroundColor: COLORS.white,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  emojis: { flexDirection: "row", gap: 6 },
  emojiBox: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  more: { fontSize: 13, fontWeight: "700", color: COLORS.muted },
  status: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 10, paddingVertical: 6, borderRadius: 12,
  },
  statusText: { fontSize: 12, fontWeight: "700" },
  orderId: { fontSize: 15, fontWeight: "700", color: COLORS.dark, marginTop: 12 },
  meta: { fontSize: 12, color: COLORS.muted, marginTop: 3 },
  itemNames: { fontSize: 13, color: COLORS.dark, marginTop: 8 },
  cardBottom: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: "#EEF1F3",
  },
  total: { fontSize: 18, fontWeight: "800", color: COLORS.dark },
  outlineBtn: {
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
    borderWidth: 1, borderColor: "#F2C4C4",
  },
  solidBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, backgroundColor: COLORS.primary },
  btnText: { fontSize: 13, fontWeight: "700" },
  empty: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32 },
  emptyTitle: { fontSize: 20, fontWeight: "bold", color: COLORS.dark, marginTop: 14 },
  emptyText: { fontSize: 14, color: COLORS.muted, marginTop: 6 },
});