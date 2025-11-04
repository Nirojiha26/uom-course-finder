import React, { useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { getCourses } from "../services/api";

export default function HomeScreen() {
  const [courses, setCourses] = useState<any[]>([]);

  useEffect(() => {
    getCourses()
      .then(setCourses)
      .catch((err) => console.error("API Error:", err));
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>Courses</Text>
      <FlatList
        data={courses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={{ padding: 5 }}>{item.title || item.name}</Text>
        )}
      />
    </View>
  );
}
