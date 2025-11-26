import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

export default function Banner({
  title,
  subtitle,
  image,
}: {
  title?: string;
  subtitle?: string;
  image?: string;
}) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      {image ? <Image source={{ uri: image }} style={styles.image} /> : null}
      <View style={styles.content}>
        <Text style={[styles.title, { color: "#fff" }]}>{title}</Text>
        {subtitle ? (
          <Text style={[styles.subtitle, { color: "#fff" }]}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
  },
  image: { width: 64, height: 64, borderRadius: 8, marginRight: 12 },
  content: {},
  title: { fontSize: 16, fontWeight: "800" },
  subtitle: { fontSize: 13, marginTop: 4 },
});
