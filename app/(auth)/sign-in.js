import { useState } from "react";
import {
  View, Text, Pressable, StyleSheet, ScrollView, KeyboardAvoidingView, Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppInput from "../../components/AppInput";
import PrimaryButton from "../../components/PrimaryButton";
import BackButton from "../../components/BackButton";
import { COLORS } from "../../constants/theme";
import { useUser } from "../../store/userStore";

const SOCIALS = ["logo-apple", "logo-google", "logo-twitter", "logo-facebook"];

export default function SignIn() {
  const insets = useSafeAreaInsets();
  const setUser = useUser((s) => s.setUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = () => {
    if (!email.includes("@")) return setError("Please enter a valid email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setError("");
    // Demo login: use the part before "@" as the name
    const name = email.trim().split("@")[0];
    setUser({ name: name.charAt(0).toUpperCase() + name.slice(1), email: email.trim() });
    router.replace("/home");
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.white }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={[styles.container, { paddingTop: insets.top + 16 }]}
        keyboardShouldPersistTaps="handled"
      >
        <BackButton />

        <Text style={styles.title}>Welcome back{"\n"}to FreshCart!</Text>

        <AppInput
          label="Email address"
          icon="mail-outline"
          placeholder="hello@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <AppInput
          label="Password"
          icon="lock-closed-outline"
          placeholder="Enter your password"
          secure
          value={password}
          onChangeText={setPassword}
        />

        <Pressable onPress={() => router.push("/forgot-password")} style={styles.forgot}>
          <Text style={styles.link}>Forgot password?</Text>
        </Pressable>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <PrimaryButton title="Sign In" onPress={handleSignIn} />

        <Text style={styles.orText}>or with</Text>

        <View style={styles.socialRow}>
          {SOCIALS.map((n) => (
            <Pressable key={n} style={styles.socialButton}>
              <Ionicons name={n} size={20} color={COLORS.dark} />
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>New user? </Text>
          <Pressable onPress={() => router.push("/sign-up")}>
            <Text style={styles.link}>Sign Up</Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },
  title: { fontSize: 26, fontWeight: "bold", color: COLORS.dark, lineHeight: 34, marginBottom: 32 },
  forgot: { alignSelf: "flex-end", marginTop: -4, marginBottom: 24 },
  link: { color: COLORS.primary, fontWeight: "600", fontSize: 13 },
  error: { color: "#E5484D", fontSize: 13, marginBottom: 12, textAlign: "center" },
  orText: { textAlign: "center", color: COLORS.muted, fontSize: 13, marginVertical: 24 },
  socialRow: { flexDirection: "row", justifyContent: "center", gap: 16 },
  socialButton: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.field,
    alignItems: "center", justifyContent: "center",
  },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: "auto", paddingTop: 32 },
  footerText: { color: COLORS.muted, fontSize: 13 },
});