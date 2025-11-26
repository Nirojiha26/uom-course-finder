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
import { enrollCourse } from "../services/courses";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { toggleFavorite } from "../redux/slices/favoritesSlice";

type RootStackParamList = {
  Details: { id: string };
};

export default function CourseDetailsScreen() {
  const route = useRoute<RouteProp<RootStackParamList, "Details">>();
  const navigation = useNavigation();
  const { id } = route.params;

  const dispatch = useDispatch();
  const favorites = useSelector((state: RootState) => state.favorites.items);

  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch specific course
  useEffect(() => {
    getCourseById(id)
      .then((data) => setCourse(data))
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#491B6D" />
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

  // Check if course is favorite
  const isFav = favorites.some((c) => c.id === course.id);

  return (
    <ScrollView style={styles.container}>
      {/* Back */}
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={26} color="#491B6D" />
      </TouchableOpacity>

      {/* Image */}
      <Image source={{ uri: course.imageUrl }} style={styles.image} />

      {/* Title Row + Heart */}
      <View style={styles.row}>
        <Text style={styles.title}>{course.title}</Text>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => dispatch(toggleFavorite(course))}>
            <Feather name="heart" size={26} color={isFav ? "red" : "#444"} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={async () => {
              try {
                await enrollCourse(course.id);
                Alert.alert("Success", "Enrolled successfully!");
              } catch (err: any) {
                Alert.alert(
                  "Error",
                  err.response?.data ?? "Something went wrong"
                );
              }
            }}
          >
            <Text style={styles.buttonText}>Enroll Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.department}>{course.department}</Text>
      <Text style={styles.desc}>{course.description}</Text>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const PRIMARY = "#491B6D";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backBtn: {
    padding: 16,
  },
  image: {
    width: "100%",
    height: 220,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 15,
  },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: PRIMARY,
    width: "80%",
  },
  department: {
    fontSize: 15,
    fontWeight: "600",
    color: "#6e6e6e",
    paddingHorizontal: 20,
    marginTop: 4,
  },
  desc: {
    paddingHorizontal: 20,
    fontSize: 15,
    marginTop: 16,
    color: "#444",
    lineHeight: 22,
  },
  button: {
    backgroundColor: PRIMARY,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginLeft: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
