import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import { Ionicons } from "@expo/vector-icons";
import ProfileScreen from "../screens/ProfileScreen";
const Tab = createBottomTabNavigator();

type IconName = React.ComponentProps<typeof Ionicons>["name"];

const getIconName = (routeName: string): IconName => {
  switch (routeName) {
    case "Home":
      return "home";
    case "Favorites":
      return "heart";
    case "Profile":
      return "person";
    case "MyCourses":
      return "book";
    default:
      return "home";
  }
};

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: "#491B6D",
        tabBarInactiveTintColor: "#b0b0b0",
        tabBarStyle: {
          position: "absolute",
          left: 12,
          right: 12,
          bottom: 12,
          backgroundColor: "#fff",
          borderTopWidth: 0,
          height: 58,
          paddingBottom: 6,
          paddingTop: 6,
          borderRadius: 14,
          elevation: 6,
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
          marginTop: 2,
        },
        tabBarIcon: ({ color, size }) => {
          const iconName = getIconName(route.name);
          return <Ionicons name={iconName} size={22} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Favorites" component={FavoritesScreen} />
      <Tab.Screen name="MyCourses" component={HomeScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
