import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";

interface Props {
  course: any;
  onPress: () => void;
}

export default function CourseCard({ course, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      {/* Course Image */}
      <Image source={{ uri: course.imageUrl }} style={styles.image} />

      <View style={styles.content}>
        {/* Title */}
        <Text numberOfLines={2} style={styles.title}>
          {course.title}
        </Text>

        {/* Department */}
        <Text style={styles.department}>{course.department}</Text>

        {/* Rating + Duration */}
        <View style={styles.row}>
          <View style={styles.row}>
            <Feather name="star" size={16} color="#f5a623" />
            <Text style={styles.smallText}>{course.rating || "4.8"}</Text>
          </View>

          <View style={styles.row}>
            <Feather name="clock" size={16} color="#444" />
            <Text style={styles.smallText}>
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
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 18,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
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
    color: "#333",
  },
  department: {
    marginTop: 4,
    fontSize: 13,
    color: "#777",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 8,
    justifyContent: "space-between",
    width: "50%",
  },
  smallText: {
    fontSize: 13,
    color: "#444",
    marginLeft: 3,
  },
});
