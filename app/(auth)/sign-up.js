import { useState } from "react";
import { View, Text, Pressable, StyleSheet, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppInput from "../../components/AppInput";
import PrimaryButton from "../../components/PrimaryButton";
import BackButton from "../../components/BackButton";
import { COLORS } from "../../constants/theme";
import { useUser } from "../../store/userStore";

const SOCIALS = ["logo-apple", "logo-google", "logo-twitter", "logo-facebook"];

export default function SignUp() {
  const insets = useSafeAreaInsets();
  const setUser = useUser((s) => s.setUser);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignUp = () => {
    if (name.trim().length < 2) return setError("Please enter your full name.");
    if (!email.includes("@")) return setError("Please enter a valid email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    setError("");
    // Save the user so Home and Profile can show their name
    setUser({ name: name.trim(), email: email.trim() });
    // Send the email to the verify screen as a route parameter
    router.push({ pathname: "/verify", params: { email } });
  };

  return (
    <ScrollView
      style={{ backgroundColor: COLORS.white }}
      contentContainerStyle={[styles.container, { paddingTop: insets.top + 16 }]}
      keyboardShouldPersistTaps="handled"
    >
      <BackButton />
      <Text style={styles.title}>Welcome to FreshCart!</Text>

      <AppInput label="Full name" icon="person-outline" placeholder="John Xavier"
        autoCapitalize="words" value={name} onChangeText={setName} />
      <AppInput label="Email address" icon="mail-outline" placeholder="hello@example.com"
        keyboardType="email-address" value={email} onChangeText={setEmail} />
      <AppInput label="Password" icon="lock-closed-outline" placeholder="At least 6 characters"
        secure value={password} onChangeText={setPassword} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton title="Sign Up" onPress={handleSignUp} style={{ marginTop: 8 }} />

      <Text style={styles.orText}>or with</Text>
      <View style={styles.socialRow}>
        {SOCIALS.map((n) => (
          <Pressable key={n} style={styles.socialButton}>
            <Ionicons name={n} size={20} color={COLORS.dark} />
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>Already have an account? </Text>
        <Pressable onPress={() => router.replace("/sign-in")}>
          <Text style={styles.link}>Sign In</Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 32 },
  title: { fontSize: 26, fontWeight: "bold", color: COLORS.dark, marginBottom: 32 },
  error: { color: "#E5484D", fontSize: 13, marginBottom: 12, textAlign: "center" },
  orText: { textAlign: "center", color: COLORS.muted, fontSize: 13, marginVertical: 24 },
  socialRow: { flexDirection: "row", justifyContent: "center", gap: 16 },
  socialButton: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: COLORS.field,
    alignItems: "center", justifyContent: "center",
  },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: "auto", paddingTop: 32 },
  footerText: { color: COLORS.muted, fontSize: 13 },
  link: { color: COLORS.primary, fontWeight: "600", fontSize: 13 },
});