import { useState, useRef } from "react";
import { View, Text, TextInput, ScrollView, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { PRODUCTS, CATEGORIES } from "../../data/products";
import ProductCard from "../../components/ProductCard";
import { COLORS } from "../../constants/theme";

const POPULAR = ["Mango", "Milk", "Bread", "Tomato", "Juice", "Cheese"];
const SORTS = ["Relevance", "Price: Low to High", "Price: High to Low"];

export default function Search() {
  const insets = useSafeAreaInsets();
  const inputRef = useRef(null);
  const [query, setQuery] = useState("");
  const [recent, setRecent] = useState(["Avocado", "Banana"]);
  const [view, setView] = useState("grid"); // "grid" or "list"
  const [sortIndex, setSortIndex] = useState(0);

  const q = query.trim().toLowerCase();

  // Match product name OR category name
  let results = PRODUCTS.filter((p) => {
    const category = CATEGORIES.find((c) => c.id === p.category)?.name.toLowerCase() ?? "";
    return p.name.toLowerCase().includes(q) || category.includes(q);
  });

  // Sort a copy (never sort the original array)
  if (sortIndex === 1) results = [...results].sort((a, b) => a.price - b.price);
  if (sortIndex === 2) results = [...results].sort((a, b) => b.price - a.price);

  // Save a search term to the top of "recent" (no duplicates, max 6)
  const saveRecent = (term) => {
    const t = term.trim();
    if (!t) return;
    setRecent((prev) => [t, ...prev.filter((r) => r.toLowerCase() !== t.toLowerCase())].slice(0, 6));
  };

  const searchFor = (term) => {
    setQuery(term);
    saveRecent(term);
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.white }}>
      {/* Search bar */}
      <View style={[styles.searchRow, { paddingTop: insets.top + 16 }]}>
        <View style={styles.searchBox}>
          <Ionicons name="search" size={18} color={COLORS.primary} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            placeholder="Search fresh groceries"
            placeholderTextColor={COLORS.muted}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => saveRecent(query)}
            returnKeyType="search"
            autoCorrect={false}
          />
          {query.length > 0 && (
            <Pressable onPress={() => { setQuery(""); inputRef.current?.focus(); }} hitSlop={8}>
              <Ionicons name="close-circle" size={18} color={COLORS.muted} />
            </Pressable>
          )}
        </View>
        <Pressable
          style={styles.sortButton}
          onPress={() => setSortIndex((sortIndex + 1) % SORTS.length)}
        >
          <Ionicons name="swap-vertical" size={22} color={COLORS.white} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {q === "" ? (
          /* ---------- Nothing typed: recent + popular ---------- */
          <>
            {recent.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent searches</Text>
                  <Pressable onPress={() => setRecent([])}>
                    <Text style={styles.link}>Clear all</Text>
                  </Pressable>
                </View>
                {recent.map((r) => (
                  <Pressable key={r} style={styles.recentRow} onPress={() => searchFor(r)}>
                    <Ionicons name="time-outline" size={18} color={COLORS.muted} />
                    <Text style={styles.recentText}>{r}</Text>
                    <Pressable
                      hitSlop={8}
                      onPress={() => setRecent((prev) => prev.filter((x) => x !== r))}
                    >
                      <Ionicons name="close" size={18} color={COLORS.muted} />
                    </Pressable>
                  </Pressable>
                ))}
              </>
            )}

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Popular searches</Text>
            </View>
            <View style={styles.chips}>
              {POPULAR.map((p) => (
                <Pressable key={p} style={styles.chip} onPress={() => searchFor(p)}>
                  <Ionicons name="trending-up" size={14} color={COLORS.primary} />
                  <Text style={styles.chipText}>{p}</Text>
                </Pressable>
              ))}
            </View>
          </>
        ) : results.length === 0 ? (
          /* ---------- No results ---------- */
          <View style={styles.empty}>
            <Text style={{ fontSize: 64 }}>😕</Text>
            <Text style={styles.emptyTitle}>No results for "{query}"</Text>
            <Text style={styles.emptyText}>Try a different word, like "fruit" or "milk".</Text>
          </View>
        ) : (
          /* ---------- Results ---------- */
          <>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  Found {results.length} {results.length === 1 ? "result" : "results"}
                </Text>
                <Text style={styles.sortLabel}>Sorted by: {SORTS[sortIndex]}</Text>
              </View>
              <Pressable
                style={styles.viewToggle}
                onPress={() => setView(view === "grid" ? "list" : "grid")}
              >
                <Ionicons name={view === "grid" ? "list" : "grid-outline"} size={20} color={COLORS.dark} />
              </Pressable>
            </View>

            <View style={view === "grid" ? styles.grid : null}>
              {results.map((p) => (
                <ProductCard key={p.id} product={p} variant={view} />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  searchRow: { flexDirection: "row", alignItems: "center", paddingHorizontal: 24, paddingBottom: 8 },
  searchBox: {
    flex: 1, flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: COLORS.field, borderRadius: 14, height: 50, paddingHorizontal: 16,
  },
  input: { flex: 1, fontSize: 15, color: COLORS.dark, height: "100%" },
  sortButton: {
    width: 50, height: 50, borderRadius: 14, backgroundColor: COLORS.primary,
    alignItems: "center", justifyContent: "center", marginLeft: 12,
  },
  sectionHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    marginTop: 20, marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: "bold", color: COLORS.dark },
  sortLabel: { fontSize: 12, color: COLORS.muted, marginTop: 2 },
  link: { color: COLORS.primary, fontWeight: "600", fontSize: 13 },
  recentRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#F1F3F5",
  },
  recentText: { flex: 1, fontSize: 14, color: COLORS.dark },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  chip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    borderWidth: 1, borderColor: "#E6E9EC", borderRadius: 20,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  chipText: { fontSize: 13, color: COLORS.dark, fontWeight: "600" },
  viewToggle: {
    width: 40, height: 40, borderRadius: 12, backgroundColor: COLORS.field,
    alignItems: "center", justifyContent: "center",
  },
  grid: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  empty: { alignItems: "center", marginTop: 80, paddingHorizontal: 24 },
  emptyTitle: { fontSize: 18, fontWeight: "bold", color: COLORS.dark, marginTop: 14, textAlign: "center" },
  emptyText: { fontSize: 14, color: COLORS.muted, marginTop: 6, textAlign: "center" },
});