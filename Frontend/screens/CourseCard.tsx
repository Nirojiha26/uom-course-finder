import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useTheme } from "../theme/ThemeProvider";

interface Props {
  course: any;
  onPress: () => void;
}

export default function CourseCard({ course, onPress }: Props) {
  const { colors } = useTheme(); // <-- THEME COLORS

  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card, shadowColor: colors.text }]}
      onPress={onPress}
    >
      {/* Course Image */}
      <Image
        source={{ uri: course.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        {/* Title */}
        <Text numberOfLines={2} style={[styles.title, { color: colors.text }]}>
          {course.title}
        </Text>

        {/* Department */}
        <Text style={[styles.department, { color: colors.muted }]}>
          {course.department}
        </Text>

        {/* Rating + Duration */}
        <View style={styles.rowContainer}>
          <View style={styles.row}>
            <Feather name="star" size={16} color="#f5a623" />
            <Text style={[styles.smallText, { color: colors.text }]}>
              {course.rating || "4.8"}
            </Text>
          </View>

          <View style={styles.row}>
            <Feather name="clock" size={16} color={colors.muted} />
            <Text style={[styles.smallText, { color: colors.text }]}>
              {course.duration || "2h 15m"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 18,
    overflow: "hidden",
    elevation: 4,
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
  },

  image: {
    width: "100%",
    height: 160,
  },

  content: {
    padding: 14,
  },

  title: {
    fontSize: 17,
    fontWeight: "700",
  },

  department: {
    fontSize: 13,
    marginTop: 6,
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
  },

  smallText: {
    fontSize: 13,
    marginLeft: 4,
  },
});
