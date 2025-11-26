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
import { useTheme } from "../theme/ThemeProvider";

type RootStackParamList = {
  Details: { id: string };
};

export default function FavoritesScreen() {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const favorites = useSelector((state: RootState) => state.favorites.items);
  const { colors } = useTheme();

  if (favorites.length === 0) {
    return (
      <View style={[styles.emptyContainer, { backgroundColor: colors.background }]}>
        <Ionicons name="heart" size={64} color={colors.primary} />
        <Text style={[styles.emptyText, { color: colors.primary }]}>
          No favorite courses yet
        </Text>
        <Text style={[styles.emptySubText, { color: colors.muted }]}>
          Add courses to your favorites to see them here
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.heading, { color: colors.primary }]}>Favorite Courses</Text>

      {favorites.map((item: Course) => (
        <TouchableOpacity
          key={item.id}
          style={[
            styles.card,
            { backgroundColor: colors.card, borderLeftColor: colors.primary },
          ]}
          onPress={() => navigation.navigate("Details", { id: item.id })}
        >
          <View style={styles.cardContent}>
            <Text style={[styles.cardTitle, { color: colors.text }]}>
              {item.title}
            </Text>

            {item.description ? (
              <Text style={[styles.cardDesc, { color: colors.muted }]} numberOfLines={2}>
                {item.description}
              </Text>
            ) : null}
          </View>

          <Ionicons name="chevron-forward" size={24} color={colors.primary} />
        </TouchableOpacity>
      ))}

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

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
    marginTop: 10,
  },

  card: {
    borderRadius: 16,
    marginBottom: 15,
    elevation: 3,
    padding: 16,
    borderLeftWidth: 4,
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
    marginBottom: 6,
  },

  cardDesc: {
    fontSize: 13,
    lineHeight: 18,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    marginTop: 16,
  },

  emptySubText: {
    fontSize: 14,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
