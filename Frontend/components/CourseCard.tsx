import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    description: string;
    department: string;
    imageUrl: string;
  };
  onPress: (course: any) => void;
  colors: any;
}

export default function CourseCard({ course, onPress, colors }: CourseCardProps) {
  return (
    <TouchableOpacity
      style={[styles.card, { backgroundColor: colors.card }]}
      onPress={() => onPress(course)}
      activeOpacity={0.9}
    >
      {/* Image Header */}
      <Image source={{ uri: course.imageUrl }} style={styles.cardImage} />
      
      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Category Tag */}
        <View style={[styles.tag, { backgroundColor: "#E8F5E9" }]}>
          <Text style={styles.tagText}>{course.department}</Text>
        </View>
        
        {/* Title */}
        <Text style={[styles.title, { color: colors.text }]}>
          {course.title}
        </Text>
        
        {/* Description */}
        <Text style={[styles.description, { color: colors.muted }]}>
          {course.description}
        </Text>
        
        {/* Action Link */}
        <TouchableOpacity style={styles.actionContainer}>
          <Text style={[styles.actionText, { color: colors.primary }]}>
            Start Course
          </Text>
          <Ionicons 
            name="arrow-forward" 
            size={16} 
            color={colors.primary} 
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    overflow: "hidden",
  },
  
  cardImage: {
    width: "100%",
    height: 180,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    resizeMode: "cover",
  },
  
  contentContainer: {
    padding: 16,
  },
  
  tag: {
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 12,
  },
  
  tagText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#2E7D32",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 24,
  },
  
  description: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  
  actionContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  
  actionText: {
    fontSize: 14,
    fontWeight: "600",
  },
  
  arrowIcon: {
    marginLeft: 4,
  },
});