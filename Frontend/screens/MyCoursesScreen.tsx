// Frontend/screens/MyCoursesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { getMyCourses } from "../services/enroll";
import { useTheme } from "../theme/ThemeProvider";

type RootStackParamList = {
  Details: { id: string };
};

interface EnrolledCourse {
  id?: string;
  courseId: string;
  title: string;
  description: string;
  department: string;
  imageUrl: string;
  enrolledAt: string;
}

export default function MyCoursesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [list, setList] = useState<EnrolledCourse[]>([]);
  const { colors } = useTheme();

  useEffect(() => {
    getMyCourses()
      .then((res) => {
        console.log("MY COURSES RESPONSE:", res);
        setList(res || []);
      })
      .catch((err) => console.log("MyCourses Error:", err));
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.primary }]}>
        My Courses
      </Text>

      <FlatList
        data={list}
        keyExtractor={(item) => item.id ?? item.courseId}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.card, { backgroundColor: colors.card }]}
            onPress={() =>
              navigation.navigate("Details", { id: item.courseId })
            }
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.cardImage}
              resizeMode="cover"
            />
            <View style={styles.cardContent}>
              <Text style={[styles.courseTitle, { color: colors.primary }]}>
                {item.title}
              </Text>
              <Text style={[styles.courseDept, { color: colors.muted }]}>
                {item.department}
              </Text>
              <Text style={[styles.courseDesc, { color: colors.text }]}>
                {item.description.substring(0, 80)}...
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {list.length === 0 && (
        <Text style={[styles.emptyText, { color: colors.muted }]}>
          You are not enrolled in any courses yet.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  heading: { fontSize: 22, fontWeight: "700", marginBottom: 14 },
  card: {
    borderRadius: 12,
    marginBottom: 14,
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: 160,
  },
  cardContent: {
    padding: 12,
  },
  courseTitle: { fontSize: 16, fontWeight: "700", marginBottom: 4 },
  courseDept: { fontSize: 13, marginBottom: 6 },
  courseDesc: { fontSize: 14, lineHeight: 20 },
  emptyText: { textAlign: "center", marginTop: 30, fontSize: 15 },
});
