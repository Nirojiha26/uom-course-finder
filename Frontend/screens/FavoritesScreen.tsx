import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import { RootState } from "../redux/store";
import { Course } from "../redux/slices/favoritesSlice";
import { Ionicons } from "@expo/vector-icons";

const PRIMARY = "#491B6D";

type RootStackParamList = {
  Details: { id: string };
  Home: undefined;
  Favorites: undefined;
  MyCourses: undefined;
  Profile: undefined;
};

export default function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const favorites = useSelector((state: RootState) => state.favorites.items);

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Ionicons name="heart" size={64} color={PRIMARY} />
        <Text style={styles.emptyText}>No favorite courses yet</Text>
        <Text style={styles.emptySubText}>
          Add courses to your favorites to see them here
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Favorite Courses</Text>

      {favorites.map((item: Course) => (
        <TouchableOpacity
          key={item.id}
          style={styles.card}
          onPress={() => navigation.navigate("Details", { id: item.id })}
        >
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>{item.title}</Text>
            {item.description && (
              <Text style={styles.cardDesc} numberOfLines={2}>
                {item.description}
              </Text>
            )}
          </View>
          <Ionicons name="chevron-forward" size={24} color={PRIMARY} />
        </TouchableOpacity>
      ))}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

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

  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 15,
    elevation: 3,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: PRIMARY,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardContent: {
    flex: 1,
    marginRight: 12,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#222",
    marginBottom: 6,
  },

  cardDesc: {
    fontSize: 13,
    color: "#777",
    lineHeight: 18,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },

  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    color: PRIMARY,
    marginBottom: 8,
    marginTop: 16,
  },

  emptySubText: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
