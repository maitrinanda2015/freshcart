import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppInput from "../../components/AppInput";
import PrimaryButton from "../../components/PrimaryButton";
import BackButton from "../../components/BackButton";
import { COLORS } from "../../constants/theme";

export default function ForgotPassword() {
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSend = () => {
    if (!email.includes("@")) return setError("Please enter a valid email.");
    setError("");
    // Demo: go straight to the new password screen
    router.push("/new-password");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <BackButton />
      <Text style={styles.title}>Forgot{"\n"}Password</Text>
      <Text style={styles.subtitle}>
        Enter your email address and we will send you a link to reset your password.
      </Text>

      <AppInput label="Email address" icon="mail-outline" placeholder="hello@example.com"
        keyboardType="email-address" value={email} onChangeText={setEmail} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton title="Send me Link" onPress={handleSend} style={{ marginTop: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, paddingHorizontal: 24 },
  title: { fontSize: 26, fontWeight: "bold", color: COLORS.dark, lineHeight: 34 },
  subtitle: { color: COLORS.muted, fontSize: 14, lineHeight: 22, marginTop: 12, marginBottom: 32 },
  error: { color: "#E5484D", fontSize: 13, marginBottom: 12, textAlign: "center" },
});