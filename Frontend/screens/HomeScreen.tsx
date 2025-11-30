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
} from "react-native";
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

import { getCourses } from "../services/courses";
import { useTheme } from "../theme/ThemeProvider";
import CourseCard from "../components/CourseCard";
// Navigation Types
type RootStackParamList = {
  Details: { id: string };
  Home: undefined;
  EditProfile: undefined;
};

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();

  const [courses, setCourses] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("All");

  const { colors } = useTheme(); // 🎨 dynamic dark/light theme

  const categories = ["All", "Computer Science", "AI", "Design", "Business"];

  // Fetch courses from API
  useEffect(() => {
    getCourses()
      .then((data) => {
        setCourses(data);
        setFiltered(data);
      })
      .finally(() => setLoading(false));
  }, []);

  // SEARCH + CATEGORY FILTER
  useEffect(() => {
    let items = courses;

    if (category !== "All") {
      items = items.filter((c) => c.department === category);
    }

    if (search.trim().length > 0) {
      const key = search.toLowerCase();
      items = items.filter(
        (c) =>
          c.title.toLowerCase().includes(key) ||
          c.description.toLowerCase().includes(key)
      );
    }

    setFiltered(items);
  }, [search, category, courses]);

  // Loader
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.heading, { color: colors.primary }]}>
        Available Courses
      </Text>

      {/* 🔍 SEARCH BAR */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: colors.card, borderColor: colors.border },
        ]}
      >
        <Ionicons name="search" size={20} color={colors.muted} />
        <TextInput
          placeholder="Search courses..."
          placeholderTextColor={colors.muted}
          value={search}
          onChangeText={setSearch}
          style={[styles.searchInput, { color: colors.text }]}
        />
      </View>

      {/* CATEGORY CHIPS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ marginTop: 12 }}
      >
        {categories.map((item) => {
          const active = item === category;
          return (
            <TouchableOpacity
              key={item}
              onPress={() => setCategory(item)}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? colors.primary : "transparent",
                  borderColor: active ? colors.primary : colors.border,
                },
              ]}
            >
              <Text
                style={{
                  color: active ? "#fff" : colors.text,
                  fontWeight: "600",
                }}
              >
                {item}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* COURSE LIST */}
      <View style={{ marginTop: 20 }}>
        {filtered.length === 0 ? (
          <Text style={[styles.noResults, { color: colors.muted }]}>
            No courses found
          </Text>
        ) : (
          filtered.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onPress={(course) => navigation.navigate("Details", { id: course.id })}
              colors={colors}
            />
          ))
        )}
      </View>

      <View style={{ height: 120 }} />
    </ScrollView>
  );
}

/* ---------------- Styles ---------------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },

  heading: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
  },

  /* Search */
  searchContainer: {
    flexDirection: "row",
    padding: 12,
    borderWidth: 1,
    borderRadius: 12,
    alignItems: "center",
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 15,
    flex: 1,
  },

  /* Chips */
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 12,
  },

  noResults: {
    marginTop: 30,
    textAlign: "center",
    fontSize: 16,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
