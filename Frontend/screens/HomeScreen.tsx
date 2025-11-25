import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { getCourses } from "../services/courses";

export default function HomeScreen({ navigation }: any) {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses()
      .then((data) => setCourses(data))
      .catch((err) => console.error("API Error:", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#491B6D" />
      </View>
    );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Courses</Text>

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("Details", { id: item.id })}
          >
            <Image
              source={{ uri: item.imageUrl }}
              style={styles.image}
              resizeMode="cover"
            />

            <View style={styles.content}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.department}>{item.department}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const PRIMARY = "#491B6D";

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 16,
    overflow: "hidden",
    elevation: 2,
    flexDirection: "row",
  },
  image: {
    width: 110,
    height: 110,
  },
  content: {
    flex: 1,
    padding: 10,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#222",
  },
  cardDesc: {
    marginTop: 4,
    fontSize: 13,
    color: "#555",
  },
  department: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: "600",
    color: PRIMARY,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
