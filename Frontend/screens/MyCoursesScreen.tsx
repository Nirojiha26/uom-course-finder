// Frontend/screens/MyCoursesScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { getMyCourses } from "../services/enroll";
import { useTheme } from "../theme/ThemeProvider";

type RootStackParamList = {
  Details: { id: string };
};

interface EnrolledItem {
  id?: string;
  courseId: string;
}

export default function MyCoursesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [list, setList] = useState<EnrolledItem[]>([]);
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
            <Text style={[styles.itemText, { color: colors.text }]}>
              • Course: {item.courseId}
            </Text>
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
  card: { padding: 14, marginBottom: 10, borderRadius: 10 },
  itemText: { fontSize: 15, fontWeight: "500" },
  emptyText: { textAlign: "center", marginTop: 30, fontSize: 15 },
});
