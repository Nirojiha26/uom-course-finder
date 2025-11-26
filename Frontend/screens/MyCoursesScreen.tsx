import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { getMyCourses } from "../services/enroll";

interface EnrolledItem {
  id?: string;
  courseId: string;
}

export default function MyCoursesScreen({ navigation }: any) {
  const [list, setList] = useState<EnrolledItem[]>([]);

  useEffect(() => {
    getMyCourses().then(setList);
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 14 }}>
        My Courses
      </Text>

      <FlatList
        data={list}
        keyExtractor={(item) => (item.id ?? item.courseId).toString()}
        renderItem={({ item }: { item: EnrolledItem }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("Details", { id: item.courseId })
            }
          >
            <Text style={{ padding: 12 }}>• Course: {item.courseId}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
