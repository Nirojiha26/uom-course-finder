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
import { enrollCourse, getMyCourses } from "../services/enroll";
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
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    const loadCourseAndCheckEnrollment = async () => {
      try {
        // Load course
        const courseData = await getCourseById(id);
        setCourse(courseData);

        // Check if already enrolled
        const enrolledCourses = await getMyCourses();
        const alreadyEnrolled = enrolledCourses.some(
          (course: any) => course.courseId === id
        );
        setIsEnrolled(alreadyEnrolled);
      } catch (err) {
        console.error("Load Error:", err);
      } finally {
        setLoading(false);
      }
    };

    loadCourseAndCheckEnrollment();
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    try {
      await enrollCourse(id);
      setIsEnrolled(true);
      Alert.alert("Success", "Enrolled successfully!");
    } catch (err: any) {
      const errorMsg = err.response?.data;
      if (errorMsg === "Already enrolled") {
        setIsEnrolled(true);
        Alert.alert("Info", "You are already enrolled in this course");
      } else {
        Alert.alert("Error", errorMsg ?? "Something went wrong");
      }
    } finally {
      setEnrolling(false);
    }
  };

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
        <Text style={{ fontSize: 18, color: "red" }}>Course not found</Text>
      </View>
    );
  }

  const isFav = favorites.some((c) => c.id === course.id);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={26} color={colors.primary} />
      </TouchableOpacity>

      <Image source={{ uri: course.imageUrl }} style={styles.image} />

      <View style={styles.headerRow}>
        <Text style={[styles.title, { color: colors.primary }]}>
          {course.title}
        </Text>

        <TouchableOpacity onPress={() => dispatch(toggleFavorite(course))}>
          <Feather
            name="heart"
            size={26}
            color={isFav ? "red" : colors.muted}
          />
        </TouchableOpacity>
      </View>

      <Text style={[styles.department, { color: colors.muted }]}>
        {course.department}
      </Text>

      <Text style={[styles.desc, { color: colors.text }]}>
        {course.description}
      </Text>

      {/* ENROLL BUTTON - FULL WIDTH */}
      <TouchableOpacity
        style={[
          styles.enrollButton,
          {
            backgroundColor: isEnrolled ? "#4caf50" : colors.primary,
          },
        ]}
        onPress={handleEnroll}
        disabled={isEnrolled || enrolling}
      >
        {enrolling ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.enrollButtonText}>
            {isEnrolled ? "✓ Enrolled" : "Enroll Now"}
          </Text>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  backBtn: { padding: 16 },
  image: { width: "100%", height: 220 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  title: { fontSize: 26, fontWeight: "800", flex: 1 },
  department: { paddingHorizontal: 20, marginTop: 4, fontSize: 15 },
  desc: { paddingHorizontal: 20, marginTop: 16, fontSize: 15, lineHeight: 22 },
  enrollButton: {
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 20,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  enrollButtonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginLeft: 12,
  },
  buttonText: { color: "#fff", fontWeight: "700" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
});
