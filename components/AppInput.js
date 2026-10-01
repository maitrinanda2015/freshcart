import { useState } from "react";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/theme";

export default function AppInput({ label, icon, secure, ...props }) {
  const [hidden, setHidden] = useState(secure);
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.wrapper}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.box, focused && styles.boxFocused]}>
        {icon && <Ionicons name={icon} size={18} color={COLORS.muted} />}
        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.muted}
          secureTextEntry={hidden}
          autoCapitalize="none"
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...props}
        />
        {secure && (
          <Pressable onPress={() => setHidden(!hidden)} hitSlop={10}>
            <Ionicons
              name={hidden ? "eye-off-outline" : "eye-outline"}
              size={18}
              color={COLORS.primary}
            />
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 13, color: COLORS.muted, marginBottom: 8 },
  box: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.field,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    borderWidth: 1,
    borderColor: "transparent",
  },
  boxFocused: { borderColor: COLORS.primary, backgroundColor: COLORS.white },
  input: { flex: 1, marginLeft: 10, fontSize: 15, color: COLORS.dark, height: "100%" },
});