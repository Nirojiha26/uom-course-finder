import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store";
import { NavigationProp } from "@react-navigation/native";

type RootStackParamList = {
  Details: { id: string };
};

interface Props {
  navigation: NavigationProp<RootStackParamList>;
}

export default function FavoritesScreen({ navigation }: Props) {
  const favorites = useSelector((state: RootState) => state.favorites.items);

  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        Favorite Courses
      </Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => navigation.navigate("Details", { id: item.id })}
          >
            <Text style={{ padding: 10 }}>{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
