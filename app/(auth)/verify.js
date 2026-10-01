import { useRef, useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import PrimaryButton from "../../components/PrimaryButton";
import BackButton from "../../components/BackButton";
import { COLORS } from "../../constants/theme";

const CODE_LENGTH = 4;

export default function Verify() {
  const insets = useSafeAreaInsets();
  const { email } = useLocalSearchParams(); // read the email sent from Sign Up
  const inputRef = useRef(null);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");

  const handleVerify = () => {
    if (code.length < CODE_LENGTH) return setMessage("Please enter the 4-digit code.");
    // Demo: any 4 digits work. Real verification comes with the backend.
    router.replace("/success");
  };

  const handleResend = () => {
    setCode("");
    setMessage("A new code has been sent.");
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16 }]}>
      <BackButton />
      <Text style={styles.title}>Verify your{"\n"}identity</Text>
      <Text style={styles.subtitle}>
        We have just sent a code to{"\n"}
        <Text style={styles.email}>{email || "your email"}</Text>
      </Text>

      {/* The four display boxes; tapping them focuses the hidden input */}
      <Pressable style={styles.boxRow} onPress={() => inputRef.current?.focus()}>
        {Array.from({ length: CODE_LENGTH }).map((_, i) => (
          <View key={i} style={[styles.box, i === code.length && styles.boxActive]}>
            <Text style={styles.digit}>{code[i] || ""}</Text>
          </View>
        ))}
      </Pressable>

      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={(t) => setCode(t.replace(/[^0-9]/g, ""))}
        maxLength={CODE_LENGTH}
        keyboardType="number-pad"
        autoFocus
        style={styles.hiddenInput}
      />

      <View style={styles.resendRow}>
        <Text style={styles.muted}>Didn't receive the code? </Text>
        <Pressable onPress={handleResend}>
          <Text style={styles.link}>Resend Code</Text>
        </Pressable>
      </View>

      {message ? <Text style={styles.message}>{message}</Text> : null}

      <PrimaryButton title="Verify" onPress={handleVerify} style={{ marginTop: 24 }} />

      <Text style={styles.terms}>
        By signing up, you agree to our{"\n"}
        <Text style={styles.link}>Terms and Conditions</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white, paddingHorizontal: 24 },
  title: { fontSize: 26, fontWeight: "bold", color: COLORS.dark, lineHeight: 34 },
  subtitle: { color: COLORS.muted, fontSize: 14, lineHeight: 22, marginTop: 12, marginBottom: 32 },
  email: { color: COLORS.dark, fontWeight: "600" },
  boxRow: { flexDirection: "row", justifyContent: "center", gap: 14 },
  box: {
    width: 60, height: 60, borderRadius: 14, backgroundColor: COLORS.field,
    alignItems: "center", justifyContent: "center",
    borderWidth: 1.5, borderColor: "transparent",
  },
  boxActive: { borderColor: COLORS.primary, backgroundColor: COLORS.white },
  digit: { fontSize: 22, fontWeight: "bold", color: COLORS.dark },
  hiddenInput: { position: "absolute", opacity: 0, width: 1, height: 1 },
  resendRow: { flexDirection: "row", justifyContent: "center", marginTop: 24 },
  muted: { color: COLORS.muted, fontSize: 13 },
  link: { color: COLORS.primary, fontWeight: "600", fontSize: 13 },
  message: { textAlign: "center", color: COLORS.primaryDark, fontSize: 13, marginTop: 12 },
  terms: { textAlign: "center", color: COLORS.muted, fontSize: 12, lineHeight: 20, marginTop: 20 },
});