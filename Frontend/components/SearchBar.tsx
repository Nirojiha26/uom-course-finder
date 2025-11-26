import React from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";

export default function SearchBar({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.input, borderColor: colors.border },
      ]}
    >
      <Ionicons name="search" size={18} color={colors.muted} />
      <TextInput
        placeholder="Search courses..."
        placeholderTextColor={colors.muted}
        value={value}
        onChangeText={onChange}
        style={[styles.input, { color: colors.text }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: { marginLeft: 8, flex: 1, fontSize: 15 },
});
