import { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AppInput from "../../components/AppInput";
import PrimaryButton from "../../components/PrimaryButton";
import BackButton from "../../components/BackButton";
import { COLORS } from "../../constants/theme";

export default function NewPassword() {
  const insets = useSafeAreaInsets();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");

  // Each rule is checked live as the user types
  const rules = [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "One uppercase letter", ok: /[A-Z]/.test(password) },
    { label: "One lowercase letter", ok: /[a-z]/.test(password) },
    { label: "One special character", ok: /[^A-Za-z0-9]/.test(password) },
  ];

  const handleSave = () => {
    if (!rules.every((r) => r.ok)) return setError("Please meet all password rules.");
    if (password !== confirm) return setError("Passwords do not match.");
    setError("");
    router.replace({
      pathname: "/success",
      params: {
        message: "Your password has been\nreset successfully.",
        button: "Back to Sign In",
        next: "/sign-in",
      },
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <BackButton />
      <Text style={styles.title}>New{"\n"}Password</Text>

      <View style={styles.rules}>
        {rules.map((r) => (
          <View key={r.label} style={styles.ruleRow}>
            <Ionicons
              name={r.ok ? "checkmark-circle" : "ellipse-outline"}
              size={16}
              color={r.ok ? COLORS.primary : COLORS.muted}
            />
            <Text style={[styles.ruleText, r.ok && { color: COLORS.primary }]}>{r.label}</Text>
          </View>
        ))}
      </View>

      <AppInput label="New password" icon="lock-closed-outline" placeholder="Enter new password"
        secure value={password} onChangeText={setPassword} />
      <AppInput label="Confirm password" icon="lock-closed-outline" placeholder="Re-enter password"
        secure value={confirm} onChangeText={setConfirm} />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <PrimaryButton title="Save Password" onPress={handleSave} style={{ marginTop: 8 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, paddingHorizontal: 24 },
  title: { fontSize: 26, fontWeight: "bold", color: COLORS.dark, lineHeight: 34, marginBottom: 16 },
  rules: { marginBottom: 24 },
  ruleRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  ruleText: { marginLeft: 8, fontSize: 13, color: COLORS.muted },
  error: { color: "#E5484D", fontSize: 13, marginBottom: 12, textAlign: "center" },
});