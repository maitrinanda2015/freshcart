import { useRef, useState, useEffect } from "react";
import {
  View, Text, FlatList, Pressable, StyleSheet, useWindowDimensions,
} from "react-native";
import { router, Redirect } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";
import { useUser } from "../store/userStore";

const SLIDES = [
  {
    id: "1",
    emoji: "🥑🥦🍅",
    bg: "#DDF3E4",
    title: "Fresh groceries to\nyour doorstep!",
    text: "Pick from hundreds of fresh fruits, vegetables and daily essentials.",
  },
  {
    id: "2",
    emoji: "🫐🌶️🧅",
    bg: "#F9C23C",
    title: "Shop your daily\nnecessities!",
    text: "Everything you need for your kitchen, all in one place.",
  },
  {
    id: "3",
    emoji: "📦🛵",
    bg: "#E3EEF9",
    title: "Fast delivery\nto your home!",
    text: "Get your order delivered in minutes, right to your door.",
  },
];

export default function Onboarding() {
  const { width, height } = useWindowDimensions();
  const listRef = useRef(null);
  const [index, setIndex] = useState(0);

  // Wait until the saved user is loaded from storage
  const user = useUser((s) => s.user);
  const [hydrated, setHydrated] = useState(useUser.persist.hasHydrated());

  useEffect(() => {
    const unsubscribe = useUser.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useUser.persist.hasHydrated());
    return unsubscribe;
  }, []);

  if (!hydrated) return <View style={{ flex: 1, backgroundColor: COLORS.white }} />;
  if (user) return <Redirect href="/home" />;

  // Track which slide is visible while swiping
  const handleScroll = (e) => {
    const newIndex = Math.round(e.nativeEvent.contentOffset.x / width);
    if (newIndex !== index) setIndex(newIndex);
  };

  // Arrow button: next slide, or go to sign in on the last one
  const handleNext = () => {
    if (index < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: index + 1 });
    } else {
      router.replace("/sign-in");
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        ref={listRef}
        data={SLIDES}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        extraData={index}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        renderItem={({ item }) => (
          <View style={{ width, height }}>
            {/* Colored image area */}
            <View style={[styles.imageArea, { backgroundColor: item.bg, height: height * 0.55 }]}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>

            {/* Curved white card */}
            <View style={styles.card}>
              <View style={styles.dots}>
                {SLIDES.map((_, i) => (
                  <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
                ))}
              </View>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.text}>{item.text}</Text>
            </View>
          </View>
        )}
      />

      {/* Arrow button stays fixed at the bottom */}
      <Pressable
        onPress={handleNext}
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
      >
        <Ionicons name="arrow-forward" size={24} color={COLORS.white} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  imageArea: { alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 72 },
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    marginTop: -40,
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    alignItems: "center",
    paddingTop: 28,
    paddingHorizontal: 32,
  },
  dots: { flexDirection: "row", marginBottom: 20 },
  dot: {
    width: 10, height: 4, borderRadius: 2,
    backgroundColor: COLORS.primaryLight, marginHorizontal: 3,
  },
  dotActive: { width: 24, backgroundColor: COLORS.primary },
  title: {
    fontSize: 24, fontWeight: "bold", color: COLORS.dark,
    textAlign: "center", lineHeight: 32,
  },
  text: {
    fontSize: 14, color: COLORS.muted, textAlign: "center",
    lineHeight: 22, marginTop: 12,
  },
  button: {
    position: "absolute",
    bottom: 48,
    alignSelf: "center",
    width: 80, height: 56, borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center", justifyContent: "center",
    shadowColor: COLORS.primary, shadowOpacity: 0.4,
    shadowRadius: 12, shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
  buttonPressed: { backgroundColor: COLORS.primaryDark },
});