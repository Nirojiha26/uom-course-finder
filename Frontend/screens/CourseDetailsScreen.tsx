// Frontend/screens/CourseDetailsScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { getCourseById } from "../services/courses";
import { Ionicons, Feather } from "@expo/vector-icons";
import { enrollCourse } from "../services/enroll";  // ✅ FIXED
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toggleFavorite } from "../redux/slices/favoritesSlice";
import { useTheme } from "../theme/ThemeProvider";

type RootStackParamList = {
  Details: { id: string };
};

export default function CourseDetailsScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "Details">>();
  const navigation = useNavigation();
  const { id } = route.params;

  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const { colors } = useTheme();

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourseById(id)
      .then(setCourse)
      .catch((err) => console.error("Course Load Error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  if (!course) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, color: "red" }}>
          Course not found
        </Text>
      </View>
    );
  }

  const isFav = favorites.some((c) => c.id === course.id);

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>

      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={26} color={colors.primary} />
      </TouchableOpacity>

      <Image source={{ uri: course.imageUrl }} style={styles.image} />

      <View style={styles.row}>
        <Text style={[styles.title, { color: colors.primary }]}>
          {course.title}
        </Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => dispatch(toggleFavorite(course))}>
            <Feather name="heart" size={26} color={isFav ? "red" : colors.muted} />
          </TouchableOpacity>

          {/* ENROLL BUTTON */}
          <TouchableOpacity
            style={[styles.button, { backgroundColor: colors.primary }]}
            onPress={async () => {
              try {
                const res = await enrollCourse(course.id);
                Alert.alert("Success", "Enrolled successfully!");
              } catch (err: any) {
                console.log("Enroll Error:", err.response?.data);
                Alert.alert("Error", err.response?.data ?? "Something went wrong");
              }
            }}
          >
            <Text style={styles.buttonText}>Enroll Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={[styles.department, { color: colors.muted }]}>
        {course.department}
      </Text>

      <Text style={[styles.desc, { color: colors.text }]}>
        {course.description}
      </Text>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backBtn: { padding: 16 },
  image: { width: "100%", height: 220 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  title: { fontSize: 26, fontWeight: "800", width: "80%" },
  department: { paddingHorizontal: 20, marginTop: 4, fontSize: 15 },
  desc: { paddingHorizontal: 20, marginTop: 16, fontSize: 15, lineHeight: 22 },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginLeft: 12,
  },
  buttonText: { color: "#fff", fontWeight: "700" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
