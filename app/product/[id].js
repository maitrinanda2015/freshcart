import { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { FadeInDown, ZoomIn } from "react-native-reanimated";
import { PRODUCTS, CATEGORIES } from "../../data/products";
import { useCart } from "../../store/cartStore";
import PrimaryButton from "../../components/PrimaryButton";
import { COLORS } from "../../constants/theme";

export default function ProductDetails() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const addItem = useCart((s) => s.addItem);
  const inCart = useCart((s) => s.items.find((i) => i.id === id)?.qty ?? 0);

  const [qty, setQty] = useState(1);
  const [liked, setLiked] = useState(false);

  const product = PRODUCTS.find((p) => p.id === id);

  // Handle a wrong id, e.g. /product/999
  if (!product) {
    return (
      <View style={styles.notFound}>
        <Text style={{ fontSize: 48 }}>🤷</Text>
        <Text style={styles.name}>Product not found</Text>
        <PrimaryButton title="Go Back" onPress={() => router.back()} style={{ alignSelf: "stretch", marginTop: 24 }} />
      </View>
    );
  }

  const category = CATEGORIES.find((c) => c.id === product.category);
  const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id);

  const handleAdd = () => {
    addItem(product, qty);
    router.push("/cart");
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Image area */}
        <View style={[styles.imageArea, { backgroundColor: product.bg, paddingTop: insets.top + 12 }]}>
          <View style={styles.topBar}>
            <Pressable
              style={styles.circleButton}
              onPress={() => (router.canGoBack() ? router.back() : router.replace("/home"))}
            >
              <Ionicons name="arrow-back" size={20} color={COLORS.dark} />
            </Pressable>
            <Pressable style={styles.circleButton} onPress={() => setLiked(!liked)}>
              <Ionicons name={liked ? "heart" : "heart-outline"} size={20} color={liked ? "#E5484D" : COLORS.dark} />
            </Pressable>
          </View>
          <Animated.Text entering={ZoomIn.springify().damping(14)} style={styles.bigEmoji}>
            {product.emoji}
          </Animated.Text>
        </View>

        {/* Info card */}
        <Animated.View entering={FadeInDown.delay(150)} style={styles.card}>
          <Text style={styles.categoryTag}>{category?.emoji} {category?.name}</Text>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.unit}>{product.unit}</Text>

          {/* Quick info chips */}
          <View style={styles.chips}>
            <View style={styles.chip}>
              <Ionicons name="star" size={14} color="#F5A623" />
              <Text style={styles.chipText}>4.8</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons name="time-outline" size={14} color={COLORS.primary} />
              <Text style={styles.chipText}>20 min</Text>
            </View>
            <View style={styles.chip}>
              <Ionicons name="leaf-outline" size={14} color={COLORS.primary} />
              <Text style={styles.chipText}>Fresh</Text>
            </View>
          </View>

          {/* Price + quantity selector */}
          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price}</Text>
            <View style={styles.qtyBox}>
              <Pressable style={styles.qtyButton} onPress={() => setQty(Math.max(1, qty - 1))}>
                <Ionicons name="remove" size={18} color={COLORS.dark} />
              </Pressable>
              <Text style={styles.qtyText}>{qty}</Text>
              <Pressable style={[styles.qtyButton, styles.qtyButtonPlus]} onPress={() => setQty(qty + 1)}>
                <Ionicons name="add" size={18} color={COLORS.white} />
              </Pressable>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {product.description ??
              `Farm-fresh ${product.name.toLowerCase()}, carefully picked and packed to keep it fresh until it reaches your door. Perfect for everyday cooking and healthy snacking.`}
          </Text>

          {inCart > 0 && (
            <View style={styles.inCartNote}>
              <Ionicons name="bag-check-outline" size={16} color={COLORS.primaryDark} />
              <Text style={styles.inCartText}>{inCart} already in your cart</Text>
            </View>
          )}

          {/* Related products */}
          {related.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>You may also like</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12 }}>
                {related.map((p) => (
                  <Pressable
                    key={p.id}
                    style={styles.related}
                    onPress={() => router.replace(`/product/${p.id}`)}
                  >
                    <View style={[styles.relatedImage, { backgroundColor: p.bg }]}>
                      <Text style={{ fontSize: 32 }}>{p.emoji}</Text>
                    </View>
                    <Text style={styles.relatedName} numberOfLines={1}>{p.name}</Text>
                    <Text style={styles.relatedPrice}>₹{p.price}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </>
          )}
        </Animated.View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 14 }]}>
        <View>
          <Text style={styles.totalLabel}>Total price</Text>
          <Text style={styles.total}>₹{product.price * qty}</Text>
        </View>
        <PrimaryButton title="Add to Cart" onPress={handleAdd} style={{ flex: 1, marginLeft: 20 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  imageArea: { height: 340, alignItems: "center" },
  topBar: {
    flexDirection: "row", justifyContent: "space-between",
    alignSelf: "stretch", paddingHorizontal: 24,
  },
  circleButton: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: COLORS.white,
    alignItems: "center", justifyContent: "center",
  },
  bigEmoji: { fontSize: 130, marginTop: 20 },
  card: {
    backgroundColor: COLORS.white, marginTop: -36,
    borderTopLeftRadius: 36, borderTopRightRadius: 36,
    paddingHorizontal: 24, paddingTop: 28,
  },
  categoryTag: { fontSize: 13, color: COLORS.primary, fontWeight: "600" },
  name: { fontSize: 26, fontWeight: "bold", color: COLORS.dark, marginTop: 6 },
  unit: { fontSize: 14, color: COLORS.muted, marginTop: 4 },
  chips: { flexDirection: "row", gap: 10, marginTop: 16 },
  chip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: COLORS.field, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8,
  },
  chipText: { fontSize: 13, fontWeight: "600", color: COLORS.dark },
  priceRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 24,
  },
  price: { fontSize: 28, fontWeight: "800", color: COLORS.dark },
  qtyBox: { flexDirection: "row", alignItems: "center", gap: 14 },
  qtyButton: {
    width: 38, height: 38, borderRadius: 12, backgroundColor: COLORS.field,
    alignItems: "center", justifyContent: "center",
  },
  qtyButtonPlus: { backgroundColor: COLORS.primary },
  qtyText: { fontSize: 18, fontWeight: "700", color: COLORS.dark, minWidth: 20, textAlign: "center" },
  sectionTitle: { fontSize: 17, fontWeight: "bold", color: COLORS.dark, marginTop: 28, marginBottom: 10 },
  description: { fontSize: 14, color: COLORS.muted, lineHeight: 22 },
  inCartNote: {
    flexDirection: "row", alignItems: "center", gap: 8, marginTop: 16,
    backgroundColor: COLORS.primaryLight, borderRadius: 12, padding: 10,
  },
  inCartText: { color: COLORS.primaryDark, fontWeight: "600", fontSize: 13 },
  related: { width: 110 },
  relatedImage: { height: 90, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  relatedName: { fontSize: 13, fontWeight: "600", color: COLORS.dark, marginTop: 6 },
  relatedPrice: { fontSize: 13, fontWeight: "800", color: COLORS.dark, marginTop: 2 },
  bottomBar: {
    flexDirection: "row", alignItems: "center", paddingHorizontal: 24, paddingTop: 14,
    borderTopWidth: 1, borderTopColor: "#EEF1F3", backgroundColor: COLORS.white,
  },
  totalLabel: { fontSize: 12, color: COLORS.muted },
  total: { fontSize: 22, fontWeight: "800", color: COLORS.dark },
  notFound: {
    flex: 1, alignItems: "center", justifyContent: "center",
    backgroundColor: COLORS.white, paddingHorizontal: 32,
  },
});