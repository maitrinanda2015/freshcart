import { useState } from "react";
import { View, Text, ScrollView, Pressable, Switch, StyleSheet, Alert, Platform } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "../../store/userStore";
import { useOrders } from "../../store/orderStore";
import { useCart, getCount } from "../../store/cartStore";
import { COLORS } from "../../constants/theme";

function MenuRow({ icon, label, value, onPress, right, danger }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && onPress && { opacity: 0.6 }]}>
      <View style={[styles.rowIcon, danger && { backgroundColor: "#FDEBEB" }]}>
        <Ionicons name={icon} size={20} color={danger ? "#D64545" : COLORS.primary} />
      </View>
      <Text style={[styles.rowLabel, danger && { color: "#D64545" }]}>{label}</Text>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      {right ?? (onPress && !danger ? <Ionicons name="chevron-forward" size={18} color={COLORS.muted} /> : null)}
    </Pressable>
  );
}

export default function Profile() {
  const insets = useSafeAreaInsets();
  const user = useUser((s) => s.user);
  const logout = useUser((s) => s.logout);
  const allOrders = useOrders((s) => s.orders);
  const orders = allOrders.filter((o) => o.userEmail === user?.email);
  const cartCount = useCart((s) => getCount(s.items));
  const clearCart = useCart((s) => s.clearCart);
  const [notifications, setNotifications] = useState(true);

  const name = user?.name ?? "Guest User";
  const email = user?.email ?? "Not signed in";
  const initials = name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

  const delivered = orders.filter((o) => o.status === "Delivered");
  const totalSpent = delivered.reduce((sum, o) => sum + o.total, 0);

  const doLogout = () => {
    logout();
    clearCart();
    router.replace("/sign-in");
  };

  // Alert works on phones; the browser needs window.confirm instead
  const confirmLogout = () => {
    if (Platform.OS === "web") {
      if (window.confirm("Are you sure you want to log out?")) doLogout();
    } else {
      Alert.alert("Log out", "Are you sure you want to log out?", [
        { text: "Cancel", style: "cancel" },
        { text: "Log out", style: "destructive", onPress: doLogout },
      ]);
    }
  };

  const comingSoon = (feature) =>
    Platform.OS === "web" ? window.alert(`${feature} is coming soon!`) : Alert.alert(feature, "Coming soon!");

  return (
    <ScrollView
      style={{ backgroundColor: COLORS.white }}
      contentContainerStyle={{ paddingTop: insets.top + 16, paddingHorizontal: 24, paddingBottom: 32 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Profile</Text>

      {/* User card */}
      <View style={styles.userCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 14 }}>
          <Text style={styles.name}>{name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        <Pressable style={styles.editButton} onPress={() => comingSoon("Edit profile")}>
          <Ionicons name="create-outline" size={18} color={COLORS.primary} />
        </Pressable>
      </View>

      {/* Stats */}
      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>{orders.length}</Text>
          <Text style={styles.statLabel}>Orders</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>₹{totalSpent}</Text>
          <Text style={styles.statLabel}>Spent</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.stat}>
          <Text style={styles.statValue}>{cartCount}</Text>
          <Text style={styles.statLabel}>In cart</Text>
        </View>
      </View>

      {/* Menu */}
      <Text style={styles.sectionTitle}>Account</Text>
      <View style={styles.menu}>
        <MenuRow icon="receipt-outline" label="My Orders" value={orders.length ? `${orders.length}` : ""} onPress={() => router.push("/orders")} />
        <MenuRow icon="location-outline" label="Delivery Addresses" onPress={() => comingSoon("Addresses")} />
        <MenuRow icon="card-outline" label="Payment Methods" onPress={() => comingSoon("Payment methods")} />
        <MenuRow icon="pricetag-outline" label="Coupons & Offers" onPress={() => comingSoon("Coupons")} />
      </View>

      <Text style={styles.sectionTitle}>Settings</Text>
      <View style={styles.menu}>
        <MenuRow
          icon="notifications-outline"
          label="Notifications"
          right={
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#D9DEE2", true: COLORS.primary }}
              thumbColor={COLORS.white}
            />
          }
        />
        <MenuRow icon="help-circle-outline" label="Help & Support" onPress={() => comingSoon("Help & Support")} />
        <MenuRow icon="information-circle-outline" label="About FreshCart" value="v1.0.0" />
      </View>

      <View style={[styles.menu, { marginTop: 24 }]}>
        {user ? (
          <MenuRow icon="log-out-outline" label="Log Out" danger onPress={confirmLogout} />
        ) : (
          <MenuRow icon="log-in-outline" label="Sign In" onPress={() => router.push("/sign-in")} />
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 26, fontWeight: "bold", color: COLORS.dark, marginBottom: 20 },
  userCard: {
    flexDirection: "row", alignItems: "center", padding: 16,
    backgroundColor: COLORS.primaryLight, borderRadius: 20,
  },
  avatar: {
    width: 60, height: 60, borderRadius: 30, backgroundColor: COLORS.primary,
    alignItems: "center", justifyContent: "center",
  },
  avatarText: { color: COLORS.white, fontSize: 22, fontWeight: "bold" },
  name: { fontSize: 18, fontWeight: "bold", color: COLORS.dark },
  email: { fontSize: 13, color: COLORS.muted, marginTop: 2 },
  editButton: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: COLORS.white,
    alignItems: "center", justifyContent: "center",
  },
  stats: {
    flexDirection: "row", alignItems: "center", marginTop: 16, paddingVertical: 16,
    borderWidth: 1, borderColor: "#EEF1F3", borderRadius: 20,
  },
  stat: { flex: 1, alignItems: "center" },
  statValue: { fontSize: 18, fontWeight: "800", color: COLORS.dark },
  statLabel: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  statDivider: { width: 1, height: 30, backgroundColor: "#EEF1F3" },
  sectionTitle: { fontSize: 14, fontWeight: "700", color: COLORS.muted, marginTop: 24, marginBottom: 10 },
  menu: { borderWidth: 1, borderColor: "#EEF1F3", borderRadius: 20, paddingHorizontal: 14 },
  row: {
    flexDirection: "row", alignItems: "center", paddingVertical: 14,
    borderBottomWidth: 1, borderBottomColor: "#F4F6F7",
  },
  rowIcon: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.primaryLight,
    alignItems: "center", justifyContent: "center",
  },
  rowLabel: { flex: 1, fontSize: 15, color: COLORS.dark, fontWeight: "500", marginLeft: 12 },
  rowValue: { fontSize: 13, color: COLORS.muted, marginRight: 8 },
});