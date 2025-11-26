import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { getCourses } from "../services/courses";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY = "#491B6D";

type RootStackParamList = {
  Details: { id: string };
  Home: undefined;
  Favorites: undefined;
  MyCourses: undefined;
  Profile: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const [courses, setCourses] = useState<any[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = ["All", "Computer Science", "AI", "Design", "Business"];

  // Fetch courses from API
  useEffect(() => {
    getCourses()
      .then((data) => {
        setCourses(data);
        setFilteredCourses(data);
      })
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, []);

  // Filtering Logic (SEARCH + CATEGORY)
  useEffect(() => {
    let result = courses;

    if (activeCategory !== "All") {
      result = result.filter((c) => c.department === activeCategory);
    }

    if (search.trim().length > 0) {
      const key = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title.toLowerCase().includes(key) ||
          c.description.toLowerCase().includes(key)
      );
    }

    setFilteredCourses(result);
  }, [search, activeCategory, courses]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={PRIMARY} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Available Courses</Text>

      {/* SEARCH BAR */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#888" />
        <TextInput
          placeholder="Search courses..."
          value={search}
          onChangeText={setSearch}
          placeholderTextColor="#aaa"
          style={styles.searchInput}
        />
      </View>

      {/* CATEGORY CHIPS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 10 }}
      >
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <TouchableOpacity
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[styles.chip, isActive && styles.chipActive]}
            >
              <Text
                style={[styles.chipText, isActive && styles.chipTextActive]}
              >
                {cat}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* COURSE LIST */}
      <View style={{ marginTop: 20 }}>
        {filteredCourses.length === 0 ? (
          <Text style={styles.noResults}>No courses found.</Text>
        ) : (
          filteredCourses.map((course) => (
            <TouchableOpacity
              key={course.id}
              style={styles.card}
              onPress={() => navigation.navigate("Details", { id: course.id })}
            >
              <Image source={{ uri: course.imageUrl }} style={styles.cardImg} />

              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{course.title}</Text>
                <Text style={styles.cardDesc}>{course.description}</Text>
                <Text style={styles.cardDepartment}>{course.department}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

/* --------------------- STYLES ----------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 20,
    marginTop: 10,
  },

  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#f4f4f4",
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  searchInput: {
    marginLeft: 10,
    fontSize: 15,
    flex: 1,
    color: "#222",
  },

  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#ccc",
    marginRight: 10,
  },

  chipActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },

  chipText: {
    fontSize: 14,
    color: "#444",
    fontWeight: "500",
  },

  chipTextActive: {
    color: "#fff",
  },

  card: {
    backgroundColor: "#fff",
    flexDirection: "row",
    padding: 12,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 3,
  },

  cardImg: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
  },

  cardDesc: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },

  cardDepartment: {
    fontSize: 12,
    color: PRIMARY,
    fontWeight: "600",
    marginTop: 4,
  },

  noResults: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 16,
    color: "#888",
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
