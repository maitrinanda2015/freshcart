import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "../../constants/theme";
import { CATEGORIES, PRODUCTS, BANNERS } from "../../data/products";
import ProductCard from "../../components/ProductCard";
import { useUser } from "../../store/userStore";

export default function Home() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState(null); // selected category id
  const user = useUser((s) => s.user);

  const firstName = user?.name?.split(" ")[0] ?? "there";
  const products = selected ? PRODUCTS.filter((p) => p.category === selected) : PRODUCTS;

  return (
    <ScrollView
      style={{ backgroundColor: COLORS.white }}
      contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: 24 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header: avatar, location, bell */}
      <View style={[styles.row, styles.px]}>
        <Pressable style={styles.avatar} onPress={() => router.push("/profile")}>
          <Text style={{ fontSize: 20 }}>🧑</Text>
        </Pressable>
        <Pressable style={styles.location}>
          <Ionicons name="location-outline" size={14} color={COLORS.primary} />
          <Text style={styles.locationText}>Home</Text>
          <Ionicons name="chevron-down" size={14} color={COLORS.dark} />
        </Pressable>
        <Pressable style={styles.bell} onPress={() => router.push("/orders")}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.dark} />
          <View style={styles.badge} />
        </Pressable>
      </View>

      {/* Greeting */}
      <View style={styles.px}>
        <Text style={styles.greeting}>Hey {firstName} 👋</Text>
        <Text style={styles.subtitle}>Find fresh groceries you want</Text>
      </View>

      {/* Search bar (opens the Search tab) */}
      <View style={[styles.row, styles.px, { marginTop: 20 }]}>
        <Pressable style={styles.search} onPress={() => router.push("/search")}>
          <Ionicons name="search" size={18} color={COLORS.primary} />
          <Text style={styles.searchText}>Search fresh groceries</Text>
        </Pressable>
        <Pressable style={styles.filterButton} onPress={() => router.push("/search")}>
          <Ionicons name="options-outline" size={22} color={COLORS.white} />
        </Pressable>
      </View>

      {/* Banners */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 14, marginTop: 24 }}
      >
        {BANNERS.map((b) => (
          <View key={b.id} style={[styles.banner, { backgroundColor: b.bg }]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.bannerTitle}>{b.title}</Text>
              <Text style={[styles.bannerValue, { color: b.accent }]}>{b.value}</Text>
              <View style={[styles.bannerButton, { backgroundColor: b.accent }]}>
                <Text style={styles.bannerButtonText}>Claim now</Text>
              </View>
            </View>
            <Text style={{ fontSize: 64 }}>{b.emoji}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Categories */}
      <View style={[styles.sectionHeader, styles.px]}>
        <Text style={styles.sectionTitle}>Categories</Text>
        {selected && (
          <Pressable onPress={() => setSelected(null)}>
            <Text style={styles.link}>Clear</Text>
          </Pressable>
        )}
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
      >
        {CATEGORIES.map((c) => {
          const active = selected === c.id;
          return (
            <Pressable
              key={c.id}
              style={styles.category}
              onPress={() => setSelected(active ? null : c.id)}
            >
              <View style={[styles.categoryIcon, { backgroundColor: c.bg }, active && styles.categoryActive]}>
                <Text style={{ fontSize: 26 }}>{c.emoji}</Text>
              </View>
              <Text style={[styles.categoryText, active && { color: COLORS.primary, fontWeight: "700" }]}>
                {c.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Products grid */}
      <View style={[styles.sectionHeader, styles.px]}>
        <Text style={styles.sectionTitle}>
          {selected ? CATEGORIES.find((c) => c.id === selected).name : "Popular"}
        </Text>
      </View>
      <View style={[styles.grid, styles.px]}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  px: { paddingHorizontal: 24 },
  row: { flexDirection: "row", alignItems: "center" },
  avatar: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: "#FDE7C8",
    alignItems: "center", justifyContent: "center",
  },
  location: {
    flexDirection: "row", alignItems: "center", gap: 4,
    marginLeft: "auto", marginRight: "auto",
    borderWidth: 1, borderColor: "#E6E9EC", borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  locationText: { fontSize: 13, fontWeight: "600", color: COLORS.dark },
  bell: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  badge: {
    position: "absolute", top: 9, right: 10, width: 8, height: 8,
    borderRadius: 4, backgroundColor: "#E5484D",
  },
  greeting: { fontSize: 26, fontWeight: "bold", color: COLORS.dark, marginTop: 20 },
  subtitle: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  search: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: COLORS.field, borderRadius: 14, height: 50, paddingHorizontal: 16,
  },
  searchText: { color: COLORS.muted, fontSize: 14 },
  filterButton: {
    width: 50, height: 50, borderRadius: 14, backgroundColor: COLORS.primary,
    alignItems: "center", justifyContent: "center", marginLeft: 12,
  },
  banner: {
    width: 290, height: 150, borderRadius: 20, padding: 18,
    flexDirection: "row", alignItems: "center",
  },
  bannerTitle: { fontSize: 15, fontWeight: "700", color: COLORS.dark, lineHeight: 20 },
  bannerValue: { fontSize: 30, fontWeight: "800", marginTop: 2 },
  bannerButton: {
    alignSelf: "flex-start", borderRadius: 12,
    paddingHorizontal: 12, paddingVertical: 6, marginTop: 8,
  },
  bannerButtonText: { color: COLORS.white, fontSize: 12, fontWeight: "700" },
  sectionHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginTop: 28, marginBottom: 14,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.dark },
  link: { color: COLORS.primary, fontWeight: "600", fontSize: 13 },
  category: { alignItems: "center", width: 64 },
  categoryIcon: {
    width: 60, height: 60, borderRadius: 18,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "transparent",
  },
  categoryActive: { borderColor: COLORS.primary },
  categoryText: { fontSize: 12, color: COLORS.dark, marginTop: 6 },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
});