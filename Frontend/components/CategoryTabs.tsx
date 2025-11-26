import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { useTheme } from "../theme/ThemeProvider";

export default function CategoryTabs({
  categories,
  active,
  onPress,
}: {
  categories: string[];
  active: string;
  onPress: (c: string) => void;
}) {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: "row" }}>
      {categories.map((cat) => {
        const isActive = active === cat;
        return (
          <TouchableOpacity
            key={cat}
            onPress={() => onPress(cat)}
            style={[
              styles.chip,
              isActive && {
                backgroundColor: colors.primary,
                borderColor: colors.primary,
              },
              { borderColor: colors.border },
            ]}
          >
            <Text
              style={[
                styles.chipText,
                { color: isActive ? "#fff" : colors.text },
              ]}
            >
              {cat}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },
  chipText: { fontSize: 14, fontWeight: "500" },
});
