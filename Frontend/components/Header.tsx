import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../theme/ThemeProvider";

export default function Header({ title }: { title?: string }) {
  const navigation = useNavigation();
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.card, borderBottomColor: colors.border },
      ]}
    >
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.iconWrap}
      >
        <Ionicons name="arrow-back" size={22} color={colors.primary} />
      </TouchableOpacity>

      <Text style={[styles.title, { color: colors.text }]}>
        {title ?? "Courses"}
      </Text>

      <View style={styles.iconWrap} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    paddingHorizontal: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
  },
  title: { fontSize: 18, fontWeight: "700" },
  iconWrap: { width: 36, alignItems: "center", justifyContent: "center" },
});
